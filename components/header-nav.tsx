"use client"

import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

export function HeaderNav() {
  const t = useTranslation()

  return (
    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
      <Link href="/text-prompts" className="hover:underline underline-offset-4 text-foreground">
        {t("nav_text_prompts")}
      </Link>
      <Link href="/image-prompts" className="hover:underline underline-offset-4 text-foreground">
        {t("nav_image_prompts")}
      </Link>
    </nav>
  )
}
