"use client"

import type React from "react"
import type { JSX } from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { SearchIcon, X } from "lucide-react"
import { debounce } from "@/lib/utils"
import Fuse from "fuse.js"
import promptsData from "@/data/prompts.json"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/context/language-context"

interface Prompt {
  id: string
  type: "text" | "image"
  title_en: string
  title_zh: string
  content_en?: string
  content_zh?: string
  prompt_en?: string
  prompt_zh?: string
  tags_en?: string[]
  tags_zh?: string[]
  styleTags_en?: string[]
  styleTags_zh?: string[]
}

const fuseOptions = {
  keys: [
    "title_en",
    "title_zh",
    "content_en",
    "content_zh",
    "prompt_en",
    "prompt_zh",
    "tags_en",
    "tags_zh",
    "styleTags_en",
    "styleTags_zh",
  ],
  includeScore: true,
  includeMatches: true,
  threshold: 0.3, // Adjust for fuzziness
}

const fuse = new Fuse(promptsData as Prompt[], fuseOptions)

export function GlobalSearchResults() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Fuse.FuseResult<Prompt>[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const t = useTranslation()
  const { language } = useLanguage()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useRef(
    debounce((query: string) => {
      if (query.trim() === "") {
        setSearchResults([])
        return
      }
      const results = fuse.search(query)
      setSearchResults(results)
    }, 300),
  ).current

  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (!isSearchOpen) setIsSearchOpen(true)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearchOpen(false)
  }

  const getPath = (prompt: Prompt) => {
    if (prompt.type === "text") {
      return `/text-prompts?id=${prompt.id}`
    } else if (prompt.type === "image") {
      return `/image-prompts?id=${prompt.id}`
    }
    return "#"
  }

  const highlightMatch = (text: string, matches: Fuse.FuseResultMatch[] | undefined) => {
    if (!matches || matches.length === 0) return text

    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0

    matches.forEach((match) => {
      if (match.indices) {
        match.indices.forEach(([start, end]) => {
          // Add text before the match
          if (start > lastIndex) {
            parts.push(text.substring(lastIndex, start))
          }
          // Add the highlighted match
          parts.push(
            <span key={`${start}-${end}`} className="bg-yellow-200 dark:bg-yellow-700">
              {text.substring(start, end + 1)}
            </span>,
          )
          lastIndex = end + 1
        })
      }
    })

    // Add any remaining text after the last match
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return <>{parts}</>
  }

  return (
    <div className="relative w-full max-w-md" ref={searchContainerRef}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("global_search_placeholder")}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsSearchOpen(true)}
          className="pl-9 pr-10 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t("clear_search_sr_only")}</span>
          </Button>
        )}
      </div>

      {isSearchOpen && searchQuery && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-background border rounded-md shadow-lg max-h-80 overflow-hidden">
          <ScrollArea className="h-full">
            <ul className="divide-y divide-border">
              {searchResults.map((result) => {
                const item = result.item
                const currentTitle = language === "zh" ? item.title_zh : item.title_en
                const currentContent = language === "zh" ? item.content_zh : item.content_en
                const currentPromptText = language === "zh" ? item.prompt_zh : item.prompt_en
                const currentTags = language === "zh" ? item.tags_zh : item.tags_en
                const currentStyleTags = language === "zh" ? item.styleTags_zh : item.styleTags_en

                const titleMatches = result.matches?.find((m) => m.key === `title_${language}`)
                const contentMatches = result.matches?.find(
                  (m) => m.key === `content_${language}` || m.key === `prompt_${language}`,
                )
                const tagsMatches = result.matches?.filter(
                  (m) => m.key === `tags_${language}` || m.key === `styleTags_${language}`,
                )

                return (
                  <li key={item.id}>
                    <Link
                      href={getPath(item)}
                      className="block p-3 hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <h4 className="font-semibold text-sm">
                        {highlightMatch(
                          currentTitle,
                          titleMatches?.indices ? [{ indices: titleMatches.indices }] : undefined,
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.type === "text" &&
                          currentContent &&
                          highlightMatch(
                            currentContent,
                            contentMatches?.indices ? [{ indices: contentMatches.indices }] : undefined,
                          )}
                        {item.type === "image" &&
                          currentPromptText &&
                          highlightMatch(
                            currentPromptText,
                            contentMatches?.indices ? [{ indices: contentMatches.indices }] : undefined,
                          )}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(currentTags || currentStyleTags)?.map((tag, idx) => {
                          const tagMatch = tagsMatches?.find((m) => m.value === tag)
                          return (
                            <span
                              key={idx}
                              className={cn(
                                "text-xs px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground",
                                tagMatch && "bg-yellow-200 dark:bg-yellow-700",
                              )}
                            >
                              {tag}
                            </span>
                          )
                        })}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        </div>
      )}
      {isSearchOpen && searchQuery && searchResults.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-background border rounded-md shadow-lg p-4 text-center text-muted-foreground">
          {t("no_results_found_for", { query: searchQuery })}
        </div>
      )}
    </div>
  )
}
