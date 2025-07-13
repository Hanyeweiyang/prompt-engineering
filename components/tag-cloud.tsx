"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"

interface TagCloudProps {
  tags: string[] // These tags are already in the selected language
  onTagClick: (tag: string) => void
  selectedTags?: string[]
}

export function TagCloud({ tags, onTagClick, selectedTags = [] }: TagCloudProps) {
  const t = useTranslation()
  // Calculate tag frequencies
  const tagFrequencies: { [key: string]: number } = {}
  tags.forEach((tag) => {
    tagFrequencies[tag] = (tagFrequencies[tag] || 0) + 1
  })

  // Sort tags by frequency (descending)
  const sortedTags = Object.entries(tagFrequencies).sort(([, freqA], [, freqB]) => freqB - freqA)

  // Determine font sizes based on frequency (simple scaling)
  const maxFreq = sortedTags.length > 0 ? sortedTags[0][1] : 1
  const minFontSize = 0.8 // rem
  const maxFontSize = 1.5 // rem

  const getFontSize = (freq: number) => {
    if (maxFreq === 1) return minFontSize // Avoid division by zero or weird scaling for single tags
    const scale = (freq - 1) / (maxFreq - 1)
    return minFontSize + scale * (maxFontSize - minFontSize)
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 border rounded-md bg-muted/40">
      <span className="text-sm font-semibold text-muted-foreground mr-2">{t("tags_label")}</span>
      {sortedTags.map(([tag, freq]) => {
        const isSelected = selectedTags.includes(tag)
        return (
          <Badge
            key={tag}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground",
              isSelected && "bg-primary text-primary-foreground",
              `text-[${getFontSize(freq)}rem]`, // Dynamic font size
            )}
            onClick={() => onTagClick(tag)}
            style={{ fontSize: `${getFontSize(freq)}rem` }}
          >
            {tag}
          </Badge>
        )
      })}
    </div>
  )
}
