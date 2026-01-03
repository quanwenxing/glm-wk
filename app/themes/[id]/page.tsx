import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface PageProps {
  params: Promise<{ id: string }>
}

const SUBJECT_COLORS: Record<string, string> = {
  kokugo: "bg-kokugo",
  sansu: "bg-sansu",
  rika: "bg-rika",
  shakai: "bg-shakai",
}

const SUBJECT_NAMES: Record<string, string> = {
  kokugo: "国語",
  sansu: "算数",
  rika: "理科",
  shakai: "社会",
}

async function getTheme(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  const res = await fetch(`${baseUrl}/api/themes/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export default async function ThemeDetailPage({ params }: PageProps) {
  const { id } = await params
  const theme = await getTheme(id)

  if (!theme) {
    notFound()
  }

  const subjectColor = SUBJECT_COLORS[theme.subject] || "bg-primary"
  const subjectName = SUBJECT_NAMES[theme.subject] || theme.subject

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b-2 border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              トップに戻る
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Theme Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`${subjectColor} text-white px-4 py-1 rounded-full text-sm font-bold`}
            >
              {subjectName}
            </span>
            <span className="text-muted-foreground font-medium">
              {theme.grade}年生
            </span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {theme.title}
          </h1>
          {theme.description && (
            <p className="text-xl text-muted-foreground">{theme.description}</p>
          )}
        </div>

        {/* Video */}
        {theme.video_url && (
          <Card className="mb-8 border-2 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video">
                <iframe
                  src={theme.video_url}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {theme.content && (
          <Card className="mb-8 border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">学習内容</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {theme.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quiz Button */}
        <div className="flex justify-center">
          <Link href={`/quiz/${theme.id}`}>
            <Button size="lg" variant="primary" className="text-lg px-8 py-6 gap-3 shadow-lg">
              <Play className="h-6 w-6" />
              クイズに挑戦！
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
