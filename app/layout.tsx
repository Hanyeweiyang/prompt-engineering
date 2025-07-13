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
import { InteractiveBackground } from "@/components/interactive-background"
import { GradientBackground } from "@/components/gradient-background"
import { HeaderNav } from "@/components/header-nav"
import { FooterContent } from "@/components/footer-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prompt Engineering Hub",
  description: "Discover, share, and refine prompts for AI models.",
    generator: 'v0.dev'
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
