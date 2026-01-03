import { NextRequest, NextResponse } from "next/server"
import { mockQuizzes, Quiz } from "@/lib/db"

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

    // モックデータからフィルタリング
    const filteredQuizzes = mockQuizzes.filter((quiz) => quiz.theme_id === themeId)

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
    filteredQuizzes.sort((a, b) => a.order - b.order)

    return NextResponse.json(filteredQuizzes, { status: 200 })
  } catch (error) {
    console.error("Error in GET /api/quizzes:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", message: "クイズの取得中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
