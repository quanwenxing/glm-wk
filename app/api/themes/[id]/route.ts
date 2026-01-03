import { NextRequest, NextResponse } from "next/server"
import { Theme } from "@/lib/db"
import fs from "fs/promises"
import path from "path"

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

    // JSONファイルからテーマデータを読み込む
    const themesDir = path.join(process.cwd(), "content", "themes")
    const files = await fs.readdir(themesDir)
    const themeFiles = files.filter(f => f.endsWith(".json"))

    for (const file of themeFiles) {
      const filePath = path.join(themesDir, file)
      const content = await fs.readFile(filePath, "utf-8")
      const theme = JSON.parse(content) as Theme

      if (theme.id === id) {
        // created_atとupdated_atを追加
        return NextResponse.json({
          ...theme,
          created_at: new Date(),
          updated_at: new Date(),
        }, { status: 200 })
      }
    }

    return NextResponse.json(
      { error: "テーマが見つかりません", message: `ID: ${id} のテーマは存在しません` },
      { status: 404 }
    )
  } catch (error) {
    console.error("Error in GET /api/themes/[id]:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", message: "テーマ詳細の取得中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
