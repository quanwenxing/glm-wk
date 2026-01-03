import { ThemeCard } from "@/components/ThemeCard"
import { Button } from "@/components/ui/button"
import { BookOpen, Calculator, Beaker, Globe, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

type SubjectType = "kokugo" | "sansu" | "rika" | "shakai"

interface SubjectInfo {
  name: string
  nameEn: string
  icon: React.ReactNode
  color: string
  description: string
}

const subjectInfo: Record<SubjectType, SubjectInfo> = {
  kokugo: {
    name: "国語",
    nameEn: "Kokugo",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-kokugo",
    description: "漢字や文章を読む力を身につけよう",
  },
  sansu: {
    name: "算数",
    nameEn: "Sansu",
    icon: <Calculator className="h-6 w-6" />,
    color: "bg-sansu",
    description: "計算や図形の考え方をマスターしよう",
  },
  rika: {
    name: "理科",
    nameEn: "Rika",
    icon: <Beaker className="h-6 w-6" />,
    color: "bg-rika",
    description: "自然の不思議を探求しよう",
  },
  shakai: {
    name: "社会",
    nameEn: "Shakai",
    icon: <Globe className="h-6 w-6" />,
    color: "bg-shakai",
    description: "身近な地域や日本について学ぼう",
  },
}

const grades = [4, 5, 6]

interface SubjectPageProps {
  params: Promise<{
    subject: string
  }>
  searchParams: Promise<{
    grade?: string
  }>
}

async function getThemes(subject: SubjectType, grade?: number) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const url = new URL(`${baseUrl}/api/themes`)
  url.searchParams.set("subject", subject)
  if (grade) {
    url.searchParams.set("grade", grade.toString())
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch themes")
  }

  return res.json()
}

export default async function SubjectPage({
  params,
  searchParams,
}: SubjectPageProps) {
  const { subject } = await params
  const { grade: gradeParam } = await searchParams

  // 科目のバリデーション
  if (
    !subject ||
    !["kokugo", "sansu", "rika", "shakai"].includes(subject)
  ) {
    notFound()
  }

  const subjectType = subject as SubjectType
  const grade = gradeParam ? parseInt(gradeParam) : undefined

  // 学年のバリデーション
  if (grade && ![4, 5, 6].includes(grade)) {
    notFound()
  }

  const themes = await getThemes(subjectType, grade)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            トップに戻る
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div
              className={`inline-flex rounded-xl p-3 text-white ${subjectInfo[subjectType].color}`}
            >
              {subjectInfo[subjectType].icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                {subjectInfo[subjectType].name}
              </h1>
              <p className="text-muted-foreground">
                {subjectInfo[subjectType].description}
              </p>
            </div>
          </div>

          {/* Grade Filter */}
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <span className="text-sm font-medium text-foreground">学年:</span>
            <Link href={`/subjects/${subject}`}>
              <Button
                variant={!grade ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                すべて
              </Button>
            </Link>
            {grades.map((g) => (
              <Link key={g} href={`/subjects/${subject}?grade=${g}`}>
                <Button
                  variant={grade === g ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  {g}年生
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-64 h-64 rounded-full bg-secondary/20 blur-3xl" />
      </section>

      {/* Themes Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {themes.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {grade ? `${grade}年生の` : ""}テーマ一覧
                  <span className="ml-2 text-lg font-normal text-muted-foreground">
                    ({themes.length}件)
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {themes.map((theme: any) => (
                  <ThemeCard
                    key={theme.id}
                    title={theme.title}
                    description={theme.description || ""}
                    subject={theme.subject}
                    grade={theme.grade}
                    href={`/themes/${theme.id}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex rounded-full bg-muted p-6 mb-4">
                {subjectInfo[subjectType].icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                テーマが見つかりません
              </h3>
              <p className="text-muted-foreground mb-6">
                {grade
                  ? `${grade}年生の${subjectInfo[subjectType].name}のテーマはまだありません`
                  : `${subjectInfo[subjectType].name}のテーマはまだありません`}
              </p>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  トップに戻る
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
