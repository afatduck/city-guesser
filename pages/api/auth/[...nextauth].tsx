import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { checkPassword } from "../../../utils/passwords";

import client from "../../../utils/redis/client";
import prisma from "../../../utils/prisma";

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {},
                password: {},
            },
            async authorize(credentials, req) {
                const user = await prisma.user.findFirst({
                    where: {
                        username: credentials?.username,
                    }
                });
                
                if (!user) throw new Error("NF");
                if (!checkPassword(credentials?.password || "", user.password || "")) 
                    throw new Error("IP");

                return user;
            },
        })
    ],
    callbacks: {
        session: async ({ session, token }) => {
          if (token) {
            session.user = { ...session.user, ...token}
          }
          return session;
        },

        jwt: async ({ user, token }) => {     
          if (user) {
              const credentialsProvider = !!user.password
              const emailVerified = !!user.emailVerified
              const updatedAt = String(user.updatedAt)
              token = { ...token, ...user, credentialsProvider, 
                emailVerified, updatedAt };
          } else if (token.updatedAt) {
            const cachedUpdatedAt = await client.get(`UPDATED_AT_${token.id}`);  
            if (cachedUpdatedAt && cachedUpdatedAt !== token.updatedAt) {
                const user = await prisma.user.findFirst({
                    where: {
                        id: token.id as string,
                    },
                    select: {
                        id: true,
                        username: true,
                        image: true,
                        name: true,
                        email: true,
                        emailVerified: true,
                        bestScore: true,
                        totalScore: true,
                        updatedAt: true,
                    }
                });
                if (user !== null) return {
                    ...token,
                    ...user,
                    emailVerified: !!user.emailVerified,
                    updatedAt: String(user.updatedAt),
                };
            }
          }
          return token;
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
    },
    debug: process.env.NODE_ENV !== "production",
})