/**
 * Cloudflare D1 データベース操作用ユーティリティ
 *
 * 開発環境: ローカルのSQLiteファイル
 * 本番環境: Cloudflare D1
 */

// TODO: Cloudflare D1のセットアップ後に実装
// まずは型定義と基本構造を作成

export interface User {
  id: string
  email: string
  name: string
  grade: number
  created_at: Date
}

export interface Theme {
  id: string
  subject: "kokugo" | "sansu" | "rika" | "shakai"
  grade: 4 | 5 | 6
  title: string
  description: string | null
  content: string | null
  video_url: string | null
  order: number
  created_at: Date
  updated_at: Date
}

export interface Quiz {
  id: string
  theme_id: string
  question: string
  options: string[]
  correct_answer: number
  order: number
  created_at: Date
}

export interface Progress {
  id: string
  user_id: string
  theme_id: string
  completed: boolean
  quiz_score: number | null
  completed_at: Date | null
  created_at: Date
  updated_at: Date
}

// データベースクライアントのプレースホルダー
// Cloudflare D1 のセットアップ後に実装
export class Database {
  private db: any

  constructor(db: any) {
    this.db = db
  }

  // Users
  async getUserById(id: string): Promise<User | null> {
    // TODO: 実装
    return null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // TODO: 実装
    return null
  }

  async createUser(data: Omit<User, "id" | "created_at">): Promise<User> {
    // TODO: 実装
    throw new Error("Not implemented")
  }

  // Themes
  async getThemes(subject?: string, grade?: number): Promise<Theme[]> {
    // TODO: 実装
    return []
  }

  async getThemeById(id: string): Promise<Theme | null> {
    // TODO: 実装
    return null
  }

  async createTheme(data: Omit<Theme, "id" | "created_at" | "updated_at">): Promise<Theme> {
    // TODO: 実装
    throw new Error("Not implemented")
  }

  // Quizzes
  async getQuizzesByThemeId(themeId: string): Promise<Quiz[]> {
    // TODO: 実装
    return []
  }

  async createQuiz(data: Omit<Quiz, "id" | "created_at">): Promise<Quiz> {
    // TODO: 実装
    throw new Error("Not implemented")
  }

  // Progress
  async getProgressByUserId(userId: string): Promise<Progress[]> {
    // TODO: 実装
    return []
  }

  async getProgress(userId: string, themeId: string): Promise<Progress | null> {
    // TODO: 実装
    return null
  }

  async upsertProgress(data: Omit<Progress, "id" | "created_at" | "updated_at">): Promise<Progress> {
    // TODO: 実装
    throw new Error("Not implemented")
  }
}

// 開発環境用のダミーデータ
export const mockThemes: Theme[] = [
  {
    id: "theme-001",
    subject: "rika",
    grade: 5,
    title: "植物の光合成",
    description: "植物が光を使って栄養を作る仕組みを学びます",
    content: "# 植物の光合成\n\n## 光合成とは\n光合成（こうごうせい）とは、植物が光のエネルギーを使って、二酸化炭素と水からブドウ糖などの栄養分を作る働きです。\n\n## 光合成の仕組み\n\n1. **光を吸収**: 葉緑素（ようりょくそ）が光を吸収します\n2. **二酸化炭素を取り込む**: 気孔（きこう）から空気中の二酸化炭素を取り込みます\n3. **水を吸収**: 根から水を吸収します\n4. **ブドウ糖を作る**: 光のエネルギーを使って化学反応を起こします\n\n## 光合成の式\n\n```\n二酸化炭素 ＋ 水 ──光のエネルギー→ ブドウ糖 ＋ 酸素\n```\n\n## まとめ\n\n植物の光合成は、私たち人間にとって酸素を供給してくれる大切な働きです。",
    video_url: null,
    order: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

export const mockQuizzes: Quiz[] = [
  {
    id: "quiz-001",
    theme_id: "theme-001",
    question: "光合成で作られるものはどれ？",
    options: ["二酸化炭素", "ブドウ糖", "水", "窒素"],
    correct_answer: 1,
    order: 1,
    created_at: new Date(),
  },
  {
    id: "quiz-002",
    theme_id: "theme-001",
    question: "光を吸収するものは何？",
    options: ["気孔", "根", "葉緑素", "茎"],
    correct_answer: 2,
    order: 2,
    created_at: new Date(),
  },
  {
    id: "quiz-003",
    theme_id: "theme-001",
    question: "光合成の式で正しいものはどれ？",
    options: [
      "酸素 ＋ 水 → 二酸化炭素 ＋ ブドウ糖",
      "二酸化炭素 ＋ 水 → ブドウ糖 ＋ 酸素",
      "ブドウ糖 ＋ 酸素 → 二酸化炭素 ＋ 水",
      "水 ＋ 酸素 → 二酸化炭素 ＋ ブドウ糖",
    ],
    correct_answer: 1,
    order: 3,
    created_at: new Date(),
  },
]

// 開発環境用の進捗ダミーデータ
export const mockProgress: Progress[] = [
  {
    id: "progress-001",
    user_id: "user-001",
    theme_id: "theme-001",
    completed: false,
    quiz_score: null,
    completed_at: null,
    created_at: new Date(),
    updated_at: new Date(),
  },
]

// 開発環境用のユーザーダミーデータ
export const mockUsers: User[] = [
  {
    id: "user-001",
    email: "test@example.com",
    name: "テストユーザー",
    grade: 5,
    created_at: new Date(),
  },
]
