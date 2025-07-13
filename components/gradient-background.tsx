"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function GradientBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Animated gradient background */}
      <div
        className={`absolute inset-0 opacity-30 ${
          isDark
            ? "bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-indigo-900/20"
            : "bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"
        }`}
        style={{
          background: isDark
            ? `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
            `
            : `
              radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)
            `,
          animation: "gradient-shift 20s ease-in-out infinite",
        }}
      />
    </div>
  )
}
