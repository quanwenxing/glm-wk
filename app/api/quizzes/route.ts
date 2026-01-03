import { NextRequest, NextResponse } from "next/server"
import { Quiz } from "@/lib/db"
import fs from "fs/promises"
import path from "path"

/**
 * GET /api/quizzes
 * クイズ一覧を取得するAPI
 *
 * クエリパラメータ:
 * - themeId: テーマIDでフィルタ (必須)
 *
 * レスポンス: Quiz[]
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const themeId = searchParams.get("themeId")

    // themeIdのバリデーション
    if (!themeId) {
      return NextResponse.json(
        { error: "無効なリクエストです", message: "themeIdクエリパラメータが必要です" },
        { status: 400 }
      )
    }

    // JSONファイルからクイズデータを読み込む
    const quizzesDir = path.join(process.cwd(), "content", "quizzes")
    const files = await fs.readdir(quizzesDir)
    const quizFiles = files.filter(f => f.endsWith(".json"))

    let allQuizzes: Quiz[] = []
    for (const file of quizFiles) {
      const filePath = path.join(quizzesDir, file)
      const content = await fs.readFile(filePath, "utf-8")
      const quizzes = JSON.parse(content) as Quiz[]
      allQuizzes.push(...quizzes)
    }

    // themeIdでフィルタリング
    const filteredQuizzes = allQuizzes.filter((quiz) => quiz.theme_id === themeId)

    if (filteredQuizzes.length === 0) {
      return NextResponse.json(
        {
          error: "クイズが見つかりません",
          message: `themeId: ${themeId} のクイズは存在しません`,
        },
        { status: 404 }
      )
    }

    // order順にソート
    filteredQuizzes.sort((a, b) => (a.order || 0) - (b.order || 0))

    return NextResponse.json(filteredQuizzes, { status: 200 })
  } catch (error) {
    console.error("Error in GET /api/quizzes:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", message: "クイズの取得中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
