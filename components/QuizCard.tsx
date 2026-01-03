import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, Circle } from "lucide-react"

export interface QuizCardProps {
  question: string
  options: string[]
  selectedAnswer?: number
  correctAnswer?: number
  onSelect?: (index: number) => void
  showResult?: boolean
  className?: string
}

export function QuizCard({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  onSelect,
  showResult = false,
  className,
}: QuizCardProps) {
  const getOptionState = (index: number) => {
    if (!showResult && selectedAnswer === undefined) {
      return "default"
    }

    if (showResult && correctAnswer !== undefined) {
      if (index === correctAnswer) {
        return "correct"
      }
      if (index === selectedAnswer && selectedAnswer !== correctAnswer) {
        return "incorrect"
      }
      return "disabled"
    }

    if (selectedAnswer === index) {
      return "selected"
    }

    return "default"
  }

  const getOptionStyles = (index: number) => {
    const state = getOptionState(index)

    const baseStyles = "w-full text-left justify-start transition-all duration-200 font-medium"

    switch (state) {
      case "correct":
        return cn(
          baseStyles,
          "bg-success/20 border-success text-success hover:bg-success/30",
          "border-2"
        )
      case "incorrect":
        return cn(
          baseStyles,
          "bg-error/20 border-error text-error hover:bg-error/30",
          "border-2"
        )
      case "selected":
        return cn(
          baseStyles,
          "bg-primary/20 border-primary text-primary hover:bg-primary/30",
          "border-2"
        )
      case "disabled":
        return cn(
          baseStyles,
          "bg-muted/50 border-muted text-muted-foreground cursor-not-allowed opacity-60",
          "border"
        )
      default:
        return cn(
          baseStyles,
          "bg-white border-border hover:border-primary hover:bg-primary/10 hover:shadow-md",
          "border-2 hover:-translate-y-0.5"
        )
    }
  }

  const getOptionIcon = (index: number) => {
    const state = getOptionState(index)

    switch (state) {
      case "correct":
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case "incorrect":
        return <XCircle className="h-5 w-5 text-error" />
      case "selected":
        return <Circle className="h-5 w-5 fill-primary text-primary" />
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <Card className={cn("border-2 shadow-lg", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-start gap-3">
          <span className="flex-shrink-0 mt-1">?</span>
          <span>{question}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className={getOptionStyles(index)}
              onClick={() => {
                if (!showResult && onSelect) {
                  onSelect(index)
                }
              }}
              disabled={showResult || !!selectedAnswer}
            >
              <span className="flex items-center gap-3 w-full">
                {getOptionIcon(index)}
                <span className="flex-1">{option}</span>
              </span>
            </Button>
          ))}
        </div>

        {showResult && correctAnswer !== undefined && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50 text-center">
            <p className="font-bold text-lg">
              {selectedAnswer === correctAnswer ? (
                <span className="text-success">正解です！</span>
              ) : (
                <span className="text-error">もう一度挑戦してみよう！</span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
