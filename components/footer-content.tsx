"use client"

import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"

export function FooterContent() {
  const t = useTranslation()

  return (
    <>
      <p className="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} PromptHub. {t("all_rights_reserved")}
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link href="#" className="text-xs hover:underline underline-offset-4">
          {t("terms_of_service")}
        </Link>
        <Link href="#" className="text-xs hover:underline underline-offset-4">
          {t("privacy_policy")}
        </Link>
      </nav>
    </>
  )
}
