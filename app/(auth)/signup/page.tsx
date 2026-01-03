"use client"

import { useState } from "react"
import { signIn } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    grade: "5",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // バリデーション
      if (!formData.email || !formData.password || !formData.name || !formData.grade) {
        setError("すべての項目を入力してください")
        setIsLoading(false)
        return
      }

      // メールアドレス形式のバリデーション
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("正しいメールアドレスを入力してください")
        setIsLoading(false)
        return
      }

      // パスワードのバリデーション（最低8文字）
      if (formData.password.length < 8) {
        setError("パスワードは8文字以上である必要があります")
        setIsLoading(false)
        return
      }

      // パスワード確認のバリデーション
      if (formData.password !== formData.confirmPassword) {
        setError("パスワードが一致しません")
        setIsLoading(false)
        return
      }

      // 学年のバリデーション
      if (!["4", "5", "6"].includes(formData.grade)) {
        setError("学年を選択してください")
        setIsLoading(false)
        return
      }

      // API呼び出し：新規登録
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          grade: parseInt(formData.grade),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "登録中にエラーが発生しました")
        setIsLoading(false)
        return
      }

      // 登録成功後、自動ログイン
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        // 登録は成功したがログインに失敗した場合
        router.push("/login?registered=true")
        return
      }

      // ホームへリダイレクト
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("Signup error:", err)
      setError("登録中にエラーが発生しました。もう一度お試しください。")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            新規登録
          </CardTitle>
          <CardDescription className="text-base">
            アカウントを作成して学習を始めよう！
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-foreground block"
              >
                お名前
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="山田太郎"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="text-lg h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground block"
              >
                メールアドレス
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="text-lg h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="grade"
                className="text-sm font-semibold text-foreground block"
              >
                学年
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full h-12 px-4 text-lg font-medium border-2 border-input rounded-lg bg-white shadow-sm transition-all focus-visible:border-primary focus-visible:ring-[4px] focus-visible:ring-primary/30 focus-visible:-translate-y-0.5 outline-none"
                required
              >
                <option value="4">小学4年生</option>
                <option value="5">小学5年生</option>
                <option value="6">小学6年生</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-foreground block"
              >
                パスワード
                <span className="text-muted-foreground font-normal ml-2">
                  （8文字以上）
                </span>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="パスワード"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="text-lg h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-foreground block"
              >
                パスワード（確認）
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="パスワードを再入力"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {isLoading ? "登録中..." : "アカウントを作成"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                すでにアカウントをお持ちですか？{" "}
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  ログイン
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
