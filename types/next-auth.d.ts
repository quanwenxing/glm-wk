import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      grade: number
    }
  }

  interface User {
    grade?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    grade?: number
  }
}
