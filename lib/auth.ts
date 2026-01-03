import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// TODO: データベース接続後に実装
// import { db } from "@/lib/db"
// import { users } from "@/lib/schema"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },
      authorize: async (credentials) => {
        // TODO: データベースからユーザーを取得
        // const user = await db.query.users.findFirst({
        //   where: eq(users.email, credentials.email as string),
        // })

        // MVP開発用: ダミーの認証ロジック
        // データベース接続後に本実装
        if (credentials.email === "test@example.com" && credentials.password === "password123") {
          return {
            id: "user-001",
            email: "test@example.com",
            name: "テストユーザー",
            grade: 5,
          }
        }

        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.grade = (user as any).grade
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.grade = token.grade as number
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
})

// 型定義の拡張
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
