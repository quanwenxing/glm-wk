"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QuizCard } from "@/components/QuizCard"
import { ArrowLeft, CheckCircle2, XCircle, Trophy } from "lucide-react"

interface Quiz {
  id: string
  theme_id: string
  question: string
  options: string[]
  correct_answer: number
  order: number
}

interface Theme {
  id: string
  subject: string
  grade: number
  title: string
  description: string | null
}

interface QuizResult {
  quizId: string
  selectedAnswer: number
  correctAnswer: number
  isCorrect: boolean
}

export default function QuizPage({ params }: { params: Promise<{ themeId: string }> }) {
  const [themeId, setThemeId] = useState<string | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [theme, setTheme] = useState<Theme | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [progressSaved, setProgressSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    params.then((resolvedParams) => {
      setThemeId(resolvedParams.themeId)
      fetchData(resolvedParams.themeId)
    })
  }, [params])

  async function fetchData(id: string) {
    try {
      setLoading(true)
      setError(null)

      // クイズデータを取得
      const quizzesRes = await fetch(`/api/quizzes?themeId=${id}`)
      if (!quizzesRes.ok) {
        throw new Error("クイズの取得に失敗しました")
      }
      const quizzesData = await quizzesRes.json()

      // テーマデータを取得
      const themeRes = await fetch(`/api/themes/${id}`)
      if (!themeRes.ok) {
        throw new Error("テーマの取得に失敗しました")
      }
      const themeData = await themeRes.json()

      setQuizzes(quizzesData)
      setTheme(themeData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAnswer = (quizIndex: number, answerIndex: number) => {
    if (submitted) return

    const newResults = [...quizResults]
    newResults[quizIndex] = {
      quizId: quizzes[quizIndex].id,
      selectedAnswer: answerIndex,
      correctAnswer: quizzes[quizIndex].correct_answer,
      isCorrect: answerIndex === quizzes[quizIndex].correct_answer,
    }
    setQuizResults(newResults)
  }

  const handleSubmit = async () => {
    // 全問回答済みかチェック
    const answeredCount = quizResults.filter((r) => r !== undefined).length
    if (answeredCount < quizzes.length) {
      alert("全ての問題に回答してください")
      return
    }

    setSubmitted(true)
    setShowResults(true)

    // スコア計算
    const correctCount = quizResults.filter((r) => r.isCorrect).length
    const score = Math.round((correctCount / quizzes.length) * 100)

    // 進捗を保存
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          themeId,
          completed: true,
          quizScore: score,
        }),
      })
      setProgressSaved(true)
    } catch (err) {
      console.error("進捗の保存に失敗しました:", err)
    }
  }

  const handleReset = () => {
    setQuizResults([])
    setShowResults(false)
    setSubmitted(false)
    setProgressSaved(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md border-2 shadow-lg">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-error mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">エラー</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/">
              <Button variant="primary" size="lg">
                トップに戻る
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md border-2 shadow-lg">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 text-error mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">クイズが見つかりません</h2>
            <p className="text-muted-foreground mb-6">
              このテーマにはまだクイズが登録されていません
            </p>
            {theme && (
              <Link href={`/themes/${theme.id}`}>
                <Button variant="outline" size="lg" className="mr-3">
                  テーマに戻る
                </Button>
              </Link>
            )}
            <Link href="/">
              <Button variant="primary" size="lg">
                トップに戻る
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // スコア計算
  const correctCount = quizResults.filter((r) => r?.isCorrect).length
  const score = quizzes.length > 0 ? Math.round((correctCount / quizzes.length) * 100) : 0
  const answeredCount = quizResults.filter((r) => r !== undefined).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b-2 border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/themes/${themeId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                テーマに戻る
              </Button>
            </Link>
            {!showResults && (
              <div className="text-sm font-medium text-muted-foreground">
                回答状況: {answeredCount} / {quizzes.length}問
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {theme?.title || "クイズ"}
          </h1>
          <p className="text-lg text-muted-foreground">
            全{quizzes.length}問のクイズに挑戦しよう！
          </p>
        </div>

        {/* Results */}
        {showResults && (
          <Card className="mb-8 border-2 shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="p-8 text-center">
              <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">クイズ結果</h2>
              <div className="text-6xl font-bold text-primary mb-4">{score}点</div>
              <p className="text-xl text-muted-foreground mb-6">
                {quizzes.length}問中 {correctCount}問正解！
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg" onClick={handleReset}>
                  もう一度挑戦
                </Button>
                <Link href="/">
                  <Button variant="primary" size="lg">
                    トップに戻る
                  </Button>
                </Link>
              </div>
              {progressSaved && (
                <p className="mt-4 text-sm text-success flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  進捗を保存しました
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quizzes */}
        <div className="space-y-6">
          {quizzes.map((quiz, index) => {
            const result = quizResults[index]
            const isAnswered = result !== undefined

            return (
              <div key={quiz.id} className="quiz-item">
                <div className="mb-3 flex items-center gap-3">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                    Q{index + 1}
                  </span>
                  {showResults && isAnswered && (
                    <span
                      className={`flex items-center gap-1 text-sm font-bold ${
                        result.isCorrect ? "text-success" : "text-error"
                      }`}
                    >
                      {result.isCorrect ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          正解
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          不正解
                        </>
                      )}
                    </span>
                  )}
                </div>
                <QuizCard
                  question={quiz.question}
                  options={quiz.options}
                  selectedAnswer={result?.selectedAnswer}
                  correctAnswer={showResults ? quiz.correct_answer : undefined}
                  onSelect={(answerIndex) => handleSelectAnswer(index, answerIndex)}
                  showResult={showResults}
                />
              </div>
            )
          })}
        </div>

        {/* Submit Button */}
        {!showResults && answeredCount === quizzes.length && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              className="text-lg px-8 py-6 shadow-lg"
              onClick={handleSubmit}
            >
              結果を見る
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
