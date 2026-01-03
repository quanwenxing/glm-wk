import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

export interface Subject {
  name: string
  color: string
  gradient: string
}

const subjectColors: Record<string, Subject> = {
  kokugo: {
    name: "国語",
    color: "bg-kokugo",
    gradient: "from-kokugo/20 to-kokugo/5",
  },
  sansu: {
    name: "算数",
    color: "bg-sansu",
    gradient: "from-sansu/20 to-sansu/5",
  },
  rika: {
    name: "理科",
    color: "bg-rika",
    gradient: "from-rika/20 to-rika/5",
  },
  shakai: {
    name: "社会",
    color: "bg-shakai",
    gradient: "from-shakai/20 to-shakai/5",
  },
}

export interface ThemeCardProps {
  title: string
  description: string
  subject: "kokugo" | "sansu" | "rika" | "shakai"
  grade: number
  href?: string
  className?: string
}

export function ThemeCard({
  title,
  description,
  subject,
  grade,
  href,
  className,
}: ThemeCardProps) {
  const subjectInfo = subjectColors[subject] || subjectColors.kokugo // デフォルト値を設定

  const cardContent = (
    <>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-sm font-bold text-white",
              subjectInfo.color
            )}
          >
            {subjectInfo.name} {grade}年生
          </div>
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {href && (
          <Button
            variant={subject === "kokugo" ? "outline" : subject === "sansu" ? "primary" : subject === "rika" ? "outline" : "secondary"}
            size="sm"
            className="w-full group"
            asChild
          >
            <a href={href}>
              はじめる
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        )}
      </CardContent>
    </>
  )

  if (href) {
    return (
      <a href={href} className="block transition-transform hover:scale-[1.02]">
        <Card
          className={cn(
            "relative overflow-hidden border-2 bg-gradient-to-br",
            subjectInfo.gradient,
            "hover:shadow-xl",
            className
          )}
        >
          {cardContent}
        </Card>
      </a>
    )
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-2 bg-gradient-to-br",
        subjectInfo.gradient,
        "hover:shadow-xl",
        className
      )}
    >
      {cardContent}
    </Card>
  )
}
