import { NextRequest, NextResponse } from "next/server"
import { mockUsers, User } from "@/lib/db"
import bcrypt from "bcryptjs"

/**
 * POST /api/auth/register
 * ユーザー新規登録API
 *
 * リクエストボディ:
 * - email: メールアドレス
 * - password: パスワード
 * - name: ユーザー名
 * - grade: 学年 (4 | 5 | 6)
 *
 * レスポンス: User (パスワード除く)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, grade } = body

    // バリデーション
    if (!email || !password || !name || grade === undefined) {
      return NextResponse.json(
        {
          error: "無効なリクエストです",
          message: "email, password, name, gradeはすべて必須です",
        },
        { status: 400 }
      )
    }

    // メールアドレス形式のバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "無効なメールアドレスです", message: "正しいメールアドレスを入力してください" },
        { status: 400 }
      )
    }

    // パスワードのバリデーション（最低8文字）
    if (password.length < 8) {
      return NextResponse.json(
        { error: "パスワードが短すぎます", message: "パスワードは8文字以上である必要があります" },
        { status: 400 }
      )
    }

    // 学年のバリデーション
    if (![4, 5, 6].includes(grade)) {
      return NextResponse.json(
        { error: "無効な学年です", message: "gradeは 4, 5, 6 のいずれかである必要があります" },
        { status: 400 }
      )
    }

    // 既存ユーザーのチェック
    const existingUser = mockUsers.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: "メールアドレスは既に登録されています", message: "別のメールアドレスを使用してください" },
        { status: 409 }
      )
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)

    // 新規ユーザーの作成
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      grade,
      created_at: new Date(),
    }

    // モックデータに追加（実際のDBでは保存処理とパスワードハッシュの保存）
    mockUsers.push(newUser)

    // レスポンスからパスワードを除外
    const { password: _, ...userResponse } = newUser as any

    return NextResponse.json(
      {
        user: userResponse,
        message: "ユーザー登録が完了しました",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error in POST /api/auth/register:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", message: "ユーザー登録中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
