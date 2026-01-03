import { ThemeCard } from "@/components/ThemeCard"
import { Button } from "@/components/ui/button"
import { BookOpen, Calculator, Beaker, Globe } from "lucide-react"
import Link from "next/link"
import { headers } from "next/headers"

type SubjectType = "kokugo" | "sansu" | "rika" | "shakai"

interface Subject {
  id: SubjectType
  name: string
  nameEn: string
  icon: React.ReactNode
  color: string
  description: string
}

const subjects: Subject[] = [
  {
    id: "kokugo",
    name: "国語",
    nameEn: "Kokugo",
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-kokugo hover:bg-kokugo/90",
    description: "漢字や文章を読む力を身につけよう",
  },
  {
    id: "sansu",
    name: "算数",
    nameEn: "Sansu",
    icon: <Calculator className="h-8 w-8" />,
    color: "bg-sansu hover:bg-sansu/90",
    description: "計算や図形の考え方をマスターしよう",
  },
  {
    id: "rika",
    name: "理科",
    nameEn: "Rika",
    icon: <Beaker className="h-8 w-8" />,
    color: "bg-rika hover:bg-rika/90",
    description: "自然の不思議を探求しよう",
  },
  {
    id: "shakai",
    name: "社会",
    nameEn: "Shakai",
    icon: <Globe className="h-8 w-8" />,
    color: "bg-shakai hover:bg-shakai/90",
    description: "身近な地域や日本について学ぼう",
  },
]

const grades = [4, 5, 6]

async function getThemes() {
  // サーバーサイドレンダリングでは絶対URLが必要
  const headersList = await headers()
  const host = headersList.get("host") || "localhost:3001"
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const baseUrl = `${protocol}://${host}`

  const res = await fetch(`${baseUrl}/api/themes`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch themes")
  }

  return res.json()
}

async function getRecommendedThemes() {
  const themes = await getThemes()
  // おすすめテーマとして各科目から1つずつ取得（5年生を基準）
  return themes.filter((t: any) => t.grade === 5).slice(0, 4)
}

async function getNewThemes() {
  const themes = await getThemes()
  // 新しいテーマとして全テーマからorder順に最初の4つを返す
  return themes.slice(0, 4)
}

export default async function HomePage() {
  const [recommendedThemes, newThemes] = await Promise.all([
    getRecommendedThemes(),
    getNewThemes(),
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              みんなで学ぼう！
              <span className="block mt-2 text-primary">楽しくわかる学習サイト</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
              国語・算数・理科・社会の学習テーマがいっぱい！
              <br />
              自分に合った学年と科目を選んで始めよう
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 rounded-full bg-secondary/20 blur-3xl" />
      </section>

      {/* Subject Selection Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              科目を選ぼう
            </h2>
            <p className="mt-2 text-muted-foreground">
              好きな科目をクリックして学習を始めよう
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/subjects/${subject.id}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl border-2 border-border bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className={`mb-4 inline-flex rounded-xl p-4 text-white ${subject.color} transition-colors`}>
                    {subject.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {subject.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-semibold text-primary">
                    もっと見る
                    <svg
                      className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grade Selection Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              学年を選ぼう
            </h2>
            <p className="mt-2 text-muted-foreground">
              自分の学年の勉強をしよう
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {grades.map((grade) => (
              <Link key={grade} href={`/subjects?grade=${grade}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-20 px-8 text-xl font-bold border-2 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  {grade}年生
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Themes Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              新しいテーマ
            </h2>
            <p className="mt-2 text-muted-foreground">
              最新の学習テーマをチェックしよう
            </p>
          </div>

          {newThemes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newThemes.map((theme: any) => (
                <ThemeCard
                  key={theme.id}
                  title={theme.title}
                  description={theme.description || ""}
                  subject={theme.subject}
                  grade={theme.grade}
                  href={`/subjects/${theme.subject}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                テーマがまだありません
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Themes Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              おすすめテーマ
            </h2>
            <p className="mt-2 text-muted-foreground">
              みんなに人気のテーマだよ
            </p>
          </div>

          {recommendedThemes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedThemes.map((theme: any) => (
                <ThemeCard
                  key={theme.id}
                  title={theme.title}
                  description={theme.description || ""}
                  subject={theme.subject}
                  grade={theme.grade}
                  href={`/subjects/${theme.subject}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                テーマがまだありません
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
