import NextAuth from "next-auth"
import {User as DBUser} from "@prisma/client/"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserData
  }
  interface User extends DBUser {
    image: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserData {}
}

interface UserData {
  id: string
  name: string | null
  email: string | null
  emailVerified: boolean | null
  username: string | null
  image: string
  updatedAt: string
  bestScore: number
  totalScore: number
  credentialsProvider: boolean
}