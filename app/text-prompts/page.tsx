"use client"

import { useState, useMemo, useEffect } from "react"
import { Virtuoso } from "react-virtuoso"
import { PromptCard } from "@/components/prompt-card"
import { SearchInput } from "@/components/search-input"
import { TagCloud } from "@/components/tag-cloud"
import promptsData from "@/data/prompts.json"
import { useSearchParams } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/context/language-context"

interface Prompt {
  id: string
  type: "text" | "image"
  title_en: string
  title_zh: string
  content_en?: string
  content_zh?: string
  tags_en?: string[]
  tags_zh?: string[]
  favorites: number
}

export default function TextPromptsPage() {
  const { language } = useLanguage()
  const allTextPrompts: Prompt[] = useMemo(() => promptsData.filter((p) => p.type === "text") as Prompt[], [])
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>()
    allTextPrompts.forEach((p) => {
      ;(p.tags_en || []).forEach((tag) => tagsSet.add(tag))
      ;(p.tags_zh || []).forEach((tag) => tagsSet.add(tag))
    })
    return Array.from(tagsSet)
  }, [allTextPrompts])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const t = useTranslation()

  const searchParams = useSearchParams()

  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      // Scroll to the specific prompt if ID is in URL
      const element = document.getElementById(`prompt-${id}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [searchParams])

  const filteredPrompts = useMemo(() => {
    let filtered = allTextPrompts

    if (selectedTags.length > 0) {
      filtered = filtered.filter((prompt) => {
        const promptTags = language === "zh" ? prompt.tags_zh : prompt.tags_en
        return selectedTags.every((tag) => promptTags?.includes(tag))
      })
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((prompt) => {
        const title = language === "zh" ? prompt.title_zh : prompt.title_en
        const content = language === "zh" ? prompt.content_zh : prompt.content_en
        const tags = language === "zh" ? prompt.tags_zh : prompt.tags_en

        return (
          title.toLowerCase().includes(lowerCaseQuery) ||
          content?.toLowerCase().includes(lowerCaseQuery) ||
          tags?.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
        )
      })
    }
    return filtered
  }, [allTextPrompts, searchQuery, selectedTags, language])

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const currentLanguageTags = useMemo(() => {
    const tagsInCurrentLanguage = new Set<string>()
    allTextPrompts.forEach((p) => {
      const tags = language === "zh" ? p.tags_zh : p.tags_en
      ;(tags || []).forEach((tag) => tagsInCurrentLanguage.add(tag))
    })
    return Array.from(tagsInCurrentLanguage)
  }, [allTextPrompts, language])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{t("text_prompts_page_title")}</h1>

      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="sticky top-8">
            <SearchInput onSearch={setSearchQuery} placeholder={t("search_text_prompts_placeholder")} />
            <div className="mt-6">
              <TagCloud tags={currentLanguageTags} onTagClick={handleTagClick} selectedTags={selectedTags} />
            </div>
          </div>
        </aside>

        <section>
          {filteredPrompts.length > 0 ? (
            <Virtuoso
              style={{ height: "calc(100vh - 150px)" }} // Adjust height as needed
              data={filteredPrompts}
              itemContent={(index, prompt) => (
                <div key={prompt.id} id={`prompt-${prompt.id}`} className="mb-6">
                  <PromptCard prompt={prompt} highlight={searchQuery} />
                </div>
              )}
            />
          ) : (
            <div className="text-center text-muted-foreground py-12">{t("no_text_prompts_found")}</div>
          )}
        </section>
      </div>
    </div>
  )
}
