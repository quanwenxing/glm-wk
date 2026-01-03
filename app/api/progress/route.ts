import { NextRequest, NextResponse } from "next/server"
import { mockProgress, Progress, mockUsers } from "@/lib/db"
import { auth } from "@/lib/auth"

/**
 * GET /api/progress
 * ユーザーの進捗状況を取得するAPI
 *
 * クエリパラメータ:
 * - userId: ユーザーID
 *
 * レスポンス: Progress[]
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    // 認証チェック
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証されていません", message: "ログインが必要です" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // 他のユーザーの進捗は取得できない
    if (userId && userId !== session.user.id) {
      return NextResponse.json(
        { error: "権限がありません", message: "自分の進捗のみ取得できます" },
        { status: 403 }
      )
    }

    // セッションのユーザーIDを使用
    const currentUserId = userId || session.user.id

    // モックデータからフィルタリング
    const userProgress = mockProgress.filter((progress) => progress.user_id === currentUserId)

    return NextResponse.json(userProgress, { status: 200 })
  } catch (error) {
    console.error("Error in GET /api/progress:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", message: "進捗の取得中にエラーが発生しました" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/progress
 * 新しい進捗を記録するAPI
 *
 * リクエストボディ:
 * - themeId: テーマID
 * - completed: 完了フラグ
 * - quizScore: クイズスコア (オプション)
 *
 * レスポンス: Progress
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    // 認証チェック
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証されていません", message: "ログインが必要です" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { themeId, completed, quizScore } = body

    // バリデーション
    if (!themeId) {
      return NextResponse.json(
        { error: "無効なリクエストです", message: "themeIdが必要です" },
        { status: 400 }
      )
    }

    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "無効なリクエストです", message: "completedはbooleanである必要があります" },
        { status: 400 }
      )
    }

    if (quizScore !== undefined && (typeof quizScore !== "number" || quizScore < 0 || quizScore > 100)) {
      return NextResponse.json(
        { error: "無効なリクエストです", message: "quizScoreは0-100の数値である必要があります" },
        { status: 400 }
      )
    }

    // 既存の進捗をチェック
    const existingProgress = mockProgress.find(
      (p) => p.user_id === session.user.id && p.theme_id === themeId
    )

    if (existingProgress) {
      return NextResponse.json(
        { error: "進捗が既に存在します", message: "PUTメソッドを使用して更新してください" },
        { status: 409 }
      )
    }

    // 新しい進捗を作成
    const newProgress: Progress = {
      id: `progress-${Date.now()}`,
      user_id: session.user.id,
      theme_id: themeId,
      completed,
      quiz_score: quizScore ?? null,
      completed_at: completed ? new Date() : null,
      created_at: new Date(),
      updated_at: new Date(),
    }

    // モックデータに追加（実際のDBでは保存処理）
    mockProgress.push(newProgress)

    return NextResponse.json(newProgress, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/progress:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", message: "進捗の記録中にエラーが発生しました" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/progress
 * 進捗を更新するAPI
 *
 * リクエストボディ:
 * - themeId: テーマID
 * - completed: 完了フラグ
 * - quizScore: クイズスコア (オプション)
 *
 * レスポンス: Progress
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    // 認証チェック
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証されていません", message: "ログインが必要です" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { themeId, completed, quizScore } = body

    // バリデーション
    if (!themeId) {
      return NextResponse.json(
        { error: "無効なリクエストです", message: "themeIdが必要です" },
        { status: 400 }
      )
    }

    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "無効なリクエストです", message: "completedはbooleanである必要があります" },
        { status: 400 }
      )
    }

    if (quizScore !== undefined && (typeof quizScore !== "number" || quizScore < 0 || quizScore > 100)) {
      return NextResponse.json(
        { error: "無効なリクエストです", message: "quizScoreは0-100の数値である必要があります" },
        { status: 400 }
      )
    }

    // 既存の進捗を検索
    const progressIndex = mockProgress.findIndex(
      (p) => p.user_id === session.user.id && p.theme_id === themeId
    )

    if (progressIndex === -1) {
      return NextResponse.json(
        { error: "進捗が見つかりません", message: "POSTメソッドを使用して新規作成してください" },
        { status: 404 }
      )
    }

    // 進捗を更新
    const updatedProgress: Progress = {
      ...mockProgress[progressIndex],
      completed,
      quiz_score: quizScore ?? mockProgress[progressIndex].quiz_score,
      completed_at: completed ? new Date() : mockProgress[progressIndex].completed_at,
      updated_at: new Date(),
    }

    // モックデータを更新
    mockProgress[progressIndex] = updatedProgress

    return NextResponse.json(updatedProgress, { status: 200 })
  } catch (error) {
    console.error("Error in PUT /api/progress:", error)
    return NextResponse.json(
      { error: "サーバーエラーが発生しました", message: "進捗の更新中にエラーが発生しました" },
      { status: 500 }
    )
  }
}
