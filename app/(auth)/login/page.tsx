"use client"

import { useState } from "react"
import { signIn } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // バリデーション
      if (!email || !password) {
        setError("メールアドレスとパスワードを入力してください")
        setIsLoading(false)
        return
      }

      // メールアドレス形式のバリデーション
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError("正しいメールアドレスを入力してください")
        setIsLoading(false)
        return
      }

      // NextAuth.jsのサインイン
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("メールアドレスまたはパスワードが正しくありません")
        setIsLoading(false)
        return
      }

      // ログイン成功後にホームへリダイレクト
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Login error:", err)
      setError("ログイン中にエラーが発生しました。もう一度お試しください。")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            ログイン
          </CardTitle>
          <CardDescription className="text-base">
            学習アプリへようこそ！
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground block"
              >
                メールアドレス
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="text-lg h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-foreground block"
              >
                パスワード
              </label>
              <Input
                id="password"
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="text-lg h-12"
                required
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-error/10 border-2 border-error text-error font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              variant="primary"
              className="w-full text-lg h-14"
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                アカウントをお持ちでないですか？{" "}
                <Link
                  href="/signup"
                  className="text-primary font-semibold hover:underline"
                >
                  新規登録
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
