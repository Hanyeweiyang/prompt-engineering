"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Carousel } from "@/components/carousel"
import { PromptCard } from "@/components/prompt-card"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import promptsData from "@/data/prompts.json"
import Image from "next/image"
import { useTranslation } from "@/hooks/use-translation"
import { AnimatedBackground } from "@/components/animated-background" // Import the new component

export default function HomePage() {
  const featuredTextPrompts = promptsData.filter((p) => p.type === "text").slice(0, 3)
  const featuredImagePrompts = promptsData.filter((p) => p.type === "image").slice(0, 3)
  const t = useTranslation()

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary text-primary-foreground overflow-hidden">
          <AnimatedBackground /> {/* Add the animated background here */}
          <div className="container relative z-10 px-4 md:px-6 text-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                {t("homepage_title")}
              </h1>
              <p className="mx-auto max-w-[900px] text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("homepage_description")}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Link href="/text-prompts">
                  <Button className="bg-primary-foreground text-primary hover:bg-secondary px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105">
                    {t("explore_text_prompts")}
                  </Button>
                </Link>
                <Link href="/image-prompts">
                  <Button
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105 bg-transparent"
                  >
                    {t("explore_image_prompts")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  {t("what_is_prompt_engineering_title")}
                </h2>
                <MarkdownRenderer content={t("what_is_prompt_engineering_content")} />
              </div>
              <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Prompt Engineering Concept"
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Carousel
              title={t("featured_text_prompts")}
              items={featuredTextPrompts}
              renderItem={(prompt) => <PromptCard prompt={prompt} />}
            />
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <Carousel
              title={t("featured_image_prompts")}
              items={featuredImagePrompts}
              renderItem={(prompt) => <PromptCard prompt={prompt} />}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
