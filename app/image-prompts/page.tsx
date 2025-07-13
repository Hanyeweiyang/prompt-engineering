"use client"

import { useState, useMemo, useEffect } from "react"
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
  prompt_en?: string
  prompt_zh?: string
  imageUrl?: string
  styleTags_en?: string[]
  styleTags_zh?: string[]
  favorites: number
}

export default function ImagePromptsPage() {
  const { language } = useLanguage()
  const allImagePrompts: Prompt[] = useMemo(() => promptsData.filter((p) => p.type === "image") as Prompt[], [])
  const allStyleTags = useMemo(() => {
    const tagsSet = new Set<string>()
    allImagePrompts.forEach((p) => {
      ;(p.styleTags_en || []).forEach((tag) => tagsSet.add(tag))
      ;(p.styleTags_zh || []).forEach((tag) => tagsSet.add(tag))
    })
    return Array.from(tagsSet)
  }, [allImagePrompts])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStyleTags, setSelectedStyleTags] = useState<string[]>([])
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
    let filtered = allImagePrompts

    if (selectedStyleTags.length > 0) {
      filtered = filtered.filter((prompt) => {
        const promptStyleTags = language === "zh" ? prompt.styleTags_zh : prompt.styleTags_en
        return selectedStyleTags.every((tag) => promptStyleTags?.includes(tag))
      })
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((prompt) => {
        const title = language === "zh" ? prompt.title_zh : prompt.title_en
        const promptText = language === "zh" ? prompt.prompt_zh : prompt.prompt_en
        const styleTags = language === "zh" ? prompt.styleTags_zh : prompt.styleTags_en

        return (
          title.toLowerCase().includes(lowerCaseQuery) ||
          promptText?.toLowerCase().includes(lowerCaseQuery) ||
          styleTags?.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))
        )
      })
    }
    return filtered
  }, [allImagePrompts, searchQuery, selectedStyleTags, language])

  const handleTagClick = (tag: string) => {
    setSelectedStyleTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const currentLanguageStyleTags = useMemo(() => {
    const tagsInCurrentLanguage = new Set<string>()
    allImagePrompts.forEach((p) => {
      const tags = language === "zh" ? p.styleTags_zh : p.styleTags_en
      ;(tags || []).forEach((tag) => tagsInCurrentLanguage.add(tag))
    })
    return Array.from(tagsInCurrentLanguage)
  }, [allImagePrompts, language])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">{t("image_prompts_page_title")}</h1>

      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="sticky top-8">
            <SearchInput onSearch={setSearchQuery} placeholder={t("search_image_prompts_placeholder")} />
            <div className="mt-6">
              <TagCloud tags={currentLanguageStyleTags} onTagClick={handleTagClick} selectedTags={selectedStyleTags} />
            </div>
          </div>
        </aside>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.length > 0 ? (
            filteredPrompts.map((prompt) => (
              <div key={prompt.id} id={`prompt-${prompt.id}`}>
                <PromptCard prompt={prompt} highlight={searchQuery} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">{t("no_image_prompts_found")}</div>
          )}
        </section>
      </div>
    </div>
  )
}
