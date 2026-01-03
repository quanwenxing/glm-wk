import { NextRequest, NextResponse } from "next/server"
import { mockThemes, Theme } from "@/lib/db"

/**
 * GET /api/themes
 * テーマ一覧を取得するAPI
 *
 * クエリパラメータ:
 * - subject?: 科目でフィルタ (kokugo | sansu | rika | shakai)
 * - grade?: 学年でフィルタ (4 | 5 | 6)
 *
 * レスポンス: Theme[]
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject")
    const grade = searchParams.get("grade")

    // 科目フィルタのバリデーション
    if (subject && !["kokugo", "sansu", "rika", "shakai"].includes(subject)) {
      return NextResponse.json(
        { error: "無効な科目です", message: "subjectは kokugo, sansu, rika, shakai のいずれかである必要があります" },
        { status: 400 }
      )
    }

    // 学年フィルタのバリデーション
    if (grade && ![4, 5, 6].includes(parseInt(grade))) {
      return NextResponse.json(
        { error: "無効な学年です", message: "gradeは 4, 5, 6 のいずれかである必要があります" },
        { status: 400 }
      )
    }

    // モックデータからフィルタリング
    let filteredThemes = [...mockThemes]

    if (subject) {
      filteredThemes = filteredThemes.filter((theme) => theme.subject === subject)
    }

    if (grade) {
      filteredThemes = filteredThemes.filter((theme) => theme.grade === parseInt(grade))
    }

    // order順にソート
    filteredThemes.sort((a, b) => a.order - b.order)

    return NextResponse.json(filteredThemes, { status: 200 })
  } catch (error) {
    console.error("Error in GET /api/themes:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", message: "テーマの取得中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
