# データベース設計

## ER図

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │     themes      │       │    quizzes      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │───┐   │ id (PK)         │
│ email           │  │    │ subject         │   │   │ theme_id (FK)   │◄─┐
│ password_hash   │  │    │ grade           │   │   │ question        │  │
│ name            │  │    │ title           │   │   │ options         │  │
│ grade           │  │    │ description     │   │   │ correct_answer  │  │
│ created_at      │  │    │ content         │   │   │ order           │  │
└─────────────────┘  │    │ video_url       │   │   └─────────────────┘  │
                      │    │ order           │   │                      │
                      │    └─────────────────┘   │                      │
                      │                          │                      │
                      │    ┌─────────────────┐   │                      │
                      └───►│    progress     │   │                      │
                           ├─────────────────┤   │                      │
                           │ id (PK)         │   │                      │
                           │ user_id (FK)    │◄──┘                      │
                           │ theme_id (FK)   │◄─────────────────────────┘
                           │ completed       │
                           │ quiz_score      │
                           │ completed_at    │
                           └─────────────────┘
```

## テーブル定義

### 1. users（ユーザー）

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | TEXT | PRIMARY KEY | ユーザーID（UUID） |
| email | TEXT | UNIQUE NOT NULL | メールアドレス |
| password_hash | TEXT | NOT NULL | パスワードハッシュ |
| name | TEXT | NOT NULL | ユーザー名 |
| grade | INTEGER | NOT NULL | 学年（4, 5, 6） |
| created_at | DATETIME | DEFAULT NOW() | 作成日時 |

### 2. themes（学習テーマ）

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | TEXT | PRIMARY KEY | テーマID |
| subject | TEXT | NOT NULL | 科目（kokugo/sansu/rika/shakai） |
| grade | INTEGER | NOT NULL | 対象学年（4, 5, 6） |
| title | TEXT | NOT NULL | タイトル |
| description | TEXT | | 説明（一覧用） |
| content | TEXT | | コンテンツ（Markdown） |
| video_url | TEXT | | 動画URL（YouTube/Vimeo） |
| order | INTEGER | DEFAULT 0 | 表示順 |
| created_at | DATETIME | DEFAULT NOW() | 作成日時 |
| updated_at | DATETIME | DEFAULT NOW() | 更新日時 |

### 3. quizzes（クイズ）

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | TEXT | PRIMARY KEY | クイズID |
| theme_id | TEXT | NOT NULL, FOREIGN KEY | 対象テーマID → themes.id |
| question | TEXT | NOT NULL | 問題文 |
| options | TEXT | NOT NULL | 選択肢（JSON配列） |
| correct_answer | INTEGER | NOT NULL | 正解のインデックス（0-3） |
| order | INTEGER | DEFAULT 0 | 表示順 |
| created_at | DATETIME | DEFAULT NOW() | 作成日時 |

### 4. progress（学習進捗）

| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | TEXT | PRIMARY KEY | 進捗ID |
| user_id | TEXT | NOT NULL, FOREIGN KEY | ユーザーID → users.id |
| theme_id | TEXT | NOT NULL, FOREIGN KEY | テーマID → themes.id |
| completed | BOOLEAN | DEFAULT FALSE | 完了フラグ |
| quiz_score | INTEGER | | クイズスコア（0-100） |
| completed_at | DATETIME | | 完了日時 |
| created_at | DATETIME | DEFAULT NOW() | 作成日時 |
| updated_at | DATETIME | DEFAULT NOW() | 更新日時 |

## インデックス

### users
- `idx_users_email`: email
- `idx_users_grade`: grade

### themes
- `idx_themes_subject_grade`: (subject, grade)
- `idx_themes_order`: (subject, grade, order)

### quizzes
- `idx_quizzes_theme_id`: theme_id
- `idx_quizzes_order`: (theme_id, order)

### progress
- `idx_progress_user_id`: user_id
- `idx_progress_user_theme`: (user_id, theme_id) UNIQUE
- `idx_progress_completed`: (user_id, completed)

## リレーションシップ

| 親テーブル | 子テーブル | カーディナリティ | 説明 |
|------------|------------|------------------|------|
| users | progress | 1:N | 1人のユーザーは複数の進捗記録を持つ |
| themes | progress | 1:N | 1つのテーマは複数の進捗記録を持つ |
| themes | quizzes | 1:N | 1つのテーマは複数のクイズを持つ |

## 制約

### 外部キー制約

```sql
-- quizzes.theme_id → themes.id
FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE

-- progress.user_id → users.id
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

-- progress.theme_id → themes.id
FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
```

### ユニーク制約

```sql
-- progress: ユーザーとテーマの組み合わせは一意
UNIQUE (user_id, theme_id)
```

## マイグレーション（Cloudflare D1 SQL）

```sql
-- users テーブル
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK(grade IN (4, 5, 6)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_grade ON users(grade);

-- themes テーブル
CREATE TABLE IF NOT EXISTS themes (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL CHECK(subject IN ('kokugo', 'sansu', 'rika', 'shakai')),
  grade INTEGER NOT NULL CHECK(grade IN (4, 5, 6)),
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  `order` INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_themes_subject_grade ON themes(subject, grade);
CREATE INDEX IF NOT EXISTS idx_themes_order ON themes(subject, grade, `order`);

-- quizzes テーブル
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  theme_id TEXT NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT NOT NULL, -- JSON: ["選択肢1", "選択肢2", "選択肢3", "選択肢4"]
  correct_answer INTEGER NOT NULL CHECK(correct_answer >= 0 AND correct_answer <= 3),
  `order` INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quizzes_theme_id ON quizzes(theme_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_order ON quizzes(theme_id, `order`);

-- progress テーブル
CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT 0,
  quiz_score INTEGER CHECK(quiz_score >= 0 AND quiz_score <= 100),
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, theme_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON progress(user_id, completed);
```

## サンプルデータ

### サンプルユーザー
```sql
INSERT INTO users (id, email, password_hash, name, grade) VALUES
('user-001', 'test@example.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'テストユーザー', 5);
```

### サンプルテーマ（理科）
```sql
INSERT INTO themes (id, subject, grade, title, description, content, `order`) VALUES
('theme-001', 'rika', 5, '植物の光合成', '植物が光を使って栄養を作る仕組みを学びます', '# 植物の光合成\n\n## 光合成とは\n光合成（こうごうせい）とは、植物が光のエネルギーを使って、二酸化炭素と水からブドウ糖などの栄養分を作る働きです。\n\n## 光合成の仕組み\n\n1. **光を吸収**: 葉緑素（ようりょくそ）が光を吸収します\n2. **二酸化炭素を取り込む**: 気孔（きこう）から空気中の二酸化炭素を取り込みます\n3. **水を吸収**: 根から水を吸収します\n4. **ブドウ糖を作る**: 光のエネルギーを使って化学反応を起こします\n\n## 光合成の式\n\n```\n二酸化炭素 ＋ 水 ──光のエネルギー→ ブドウ糖 ＋ 酸素\n```\n\n## まとめ\n\n植物の光合成は、私たち人間にとって酸素を供給してくれる大切な働きです。', 1);
```

### サンプルクイズ
```sql
INSERT INTO quizzes (id, theme_id, question, options, correct_answer, `order`) VALUES
('quiz-001', 'theme-001', '光合成で作られるものはどれ？', '["二酸化炭素", "ブドウ糖", "水", "窒素"]', 1, 1),
('quiz-002', 'theme-001', '光を吸収するものは何？', '["気孔", "根", "葉緑素", "茎"]', 2, 2),
('quiz-003', 'theme-001', '光分解の式で正しいものはどれ？', '["酸素 ＋ 水 → 二酸化炭素 ＋ ブドウ糖", "二酸化炭素 ＋ 水 → ブドウ糖 ＋ 酸素", "ブドウ糖 ＋ 酸素 → 二酸化炭素 ＋ 水", "水 ＋ 酸素 → 二酸化炭素 ＋ ブドウ糖"]', 1, 3);
```
