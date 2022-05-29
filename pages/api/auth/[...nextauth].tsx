import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { checkPassword } from "../../../utils/passwords";

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
          if (session?.user) {
            session.user.id = token?.uid as string;
            session.user.username = token?.username as string;
          }
          return session;
        },
        jwt: async ({ user, token }) => {
          if (user) {
            token.uid = user?.id;
            token.username = user?.username;
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