import { NextRequest, NextResponse } from "next/server"
import { mockThemes, Theme } from "@/lib/db"

/**
 * GET /api/themes/:id
 * テーマ詳細を取得するAPI
 *
 * パスパラメータ:
 * - id: テーマID
 *
 * レスポンス: Theme | 404
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "無効なリクエストです", message: "テーマIDが必要です" },
        { status: 400 }
      )
    }

    // モックデータから検索
    const theme = mockThemes.find((theme) => theme.id === id)

    if (!theme) {
      return NextResponse.json(
        { error: "テーマが見つかりません", message: `ID: ${id} のテーマは存在しません` },
        { status: 404 }
      )
    }

    return NextResponse.json(theme, { status: 200 })
  } catch (error) {
    console.error("Error in GET /api/themes/[id]:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", message: "テーマ詳細の取得中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
