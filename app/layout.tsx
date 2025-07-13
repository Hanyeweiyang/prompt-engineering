import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import { Mountain } from "lucide-react"
import { GlobalSearchResults } from "@/components/global-search-results"
import { LanguageProvider } from "@/context/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import { useTranslation } from "@/hooks/use-translation"
import { InteractiveBackground } from "@/components/interactive-background"
import { GradientBackground } from "@/components/gradient-background"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prompt Engineering Hub",
  description: "Discover, share, and refine prompts for AI models.",
    generator: 'v0.dev'
}

// Define a wrapper component to use useTranslation hook for the footer
function FooterContent() {
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

// Define a wrapper component to use useTranslation hook for the header navigation
function HeaderNav() {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            {/* Background effects */}
            <GradientBackground />
            <InteractiveBackground />

            <div className="flex flex-col min-h-screen content-layer">
              <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                  <Link href="/" className="flex items-center gap-2 font-bold text-primary">
                    <Mountain className="h-6 w-6" />
                    <span>PromptHub</span>
                  </Link>
                  <HeaderNav />
                  <div className="flex items-center gap-4">
                    <GlobalSearchResults />
                    <LanguageToggle />
                  </div>
                </div>
              </header>
              {children}
              <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-muted/80 backdrop-blur-sm">
                <FooterContent />
              </footer>
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
