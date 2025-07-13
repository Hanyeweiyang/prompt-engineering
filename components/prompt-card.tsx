"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Image from "next/image"
import { CopyButton } from "./copy-button"
import { MarkdownRenderer } from "./markdown-renderer"
import { parseStableDiffusionParams, type StableDiffusionParams } from "@/lib/prompt-parser"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/context/language-context"

interface Prompt {
  id: string
  type: "text" | "image"
  title_en: string
  title_zh: string
  content_en?: string // For text prompts
  content_zh?: string
  prompt_en?: string // For image prompts
  prompt_zh?: string
  imageUrl?: string // For image prompts
  tags_en?: string[]
  tags_zh?: string[]
  styleTags_en?: string[]
  styleTags_zh?: string[]
  favorites: number
}

interface PromptCardProps {
  prompt: Prompt
  highlight?: string
}

const highlightText = (text: string, highlight: string) => {
  if (!highlight) return text
  const parts = text.split(new RegExp(`(${highlight})`, "gi"))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 dark:bg-yellow-700">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}

export function PromptCard({ prompt, highlight }: PromptCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentFavorites, setCurrentFavorites] = useState(prompt.favorites)
  const t = useTranslation()
  const { language } = useLanguage()

  const currentTitle = language === "zh" ? prompt.title_zh : prompt.title_en
  const currentContent = language === "zh" ? prompt.content_zh : prompt.content_en
  const currentPromptText = language === "zh" ? prompt.prompt_zh : prompt.prompt_en
  const currentTags = language === "zh" ? prompt.tags_zh : prompt.tags_en
  const currentStyleTags = language === "zh" ? prompt.styleTags_zh : prompt.styleTags_en

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    setCurrentFavorites(isFavorited ? currentFavorites - 1 : currentFavorites + 1)
  }

  const parsedParams: StableDiffusionParams =
    prompt.type === "image" && currentPromptText ? parseStableDiffusionParams(currentPromptText) : {}

  const cleanPromptText =
    prompt.type === "image" && currentPromptText
      ? currentPromptText
          .replace(/--ar\s+\d+:\d+|--v\s+[\d.]+|--s\s+\d+|--q\s+\d+|--chaos\s+\d+|--niji\s+\d+|--style raw/g, "")
          .trim()
      : ""

  return (
    <Card className="flex flex-col h-full interactive-card bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle>{highlightText(currentTitle, highlight || "")}</CardTitle>
        {prompt.type === "text" && currentContent && (
          <CardDescription className="line-clamp-3">
            {highlightText(currentContent.split("\n")[0], highlight || "")}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        {prompt.type === "text" && currentContent && (
          <MarkdownRenderer content={currentContent} className="max-h-40 overflow-hidden text-sm" />
        )}
        {prompt.type === "image" && prompt.imageUrl && (
          <div className="relative w-full h-48 overflow-hidden rounded-md mb-4">
            <Image
              src={prompt.imageUrl || "/placeholder.svg"}
              alt={currentTitle}
              fill
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
        {prompt.type === "image" && currentPromptText && (
          <div className="text-sm text-muted-foreground mb-2">
            <p className="font-medium">{t("prompt_label")}</p>
            <p className="break-words">{highlightText(cleanPromptText, highlight || "")}</p>
            {Object.keys(parsedParams).length > 0 && (
              <div className="mt-2 text-xs">
                <p className="font-medium">{t("parameters_label")}</p>
                <ul className="list-disc list-inside">
                  {Object.entries(parsedParams).map(([key, value]) => (
                    <li key={key}>
                      {key}: {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-4">
          {(currentTags || currentStyleTags)?.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-secondary/80">
              {highlightText(tag, highlight || "")}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleFavorite} className={cn(isFavorited && "text-red-500")}>
            <Heart className="h-4 w-4" fill={isFavorited ? "currentColor" : "none"} />
            <span className="sr-only">{t("favorite_button_sr_only")}</span>
          </Button>
          <span className="text-sm text-muted-foreground">{currentFavorites}</span>
        </div>
        <CopyButton textToCopy={prompt.type === "text" ? currentContent || "" : currentPromptText || ""} />
      </CardFooter>
    </Card>
  )
}
