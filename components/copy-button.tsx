"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/hooks/use-translation"

interface CopyButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  textToCopy: string
}

export function CopyButton({ textToCopy, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const t = useTranslation()

  const handleCopy = () => {
    // 检查是否支持 navigator.clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true)
        toast({
          title: t("copy_to_clipboard_toast"),
        })
        setTimeout(() => setCopied(false), 2000)
      }).catch((err) => {
        console.error('Failed to copy text: ', err)
        // 如果 Clipboard API 失败，使用 fallback 方法
        fallbackCopyTextToClipboard(textToCopy)
      })
    } else {
      // 不支持 Clipboard API 时使用 fallback 方法
      fallbackCopyTextToClipboard(textToCopy)
    }
  }

  // Fallback 方法：创建临时 textarea 并使用 document.execCommand
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea")
    textArea.value = text
    
    // 避免滚动到底部
    textArea.style.top = "0"
    textArea.style.left = "0"
    textArea.style.position = "fixed"
    textArea.style.opacity = "0"
    
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      const successful = document.execCommand('copy')
      setCopied(successful)
      if (successful) {
        toast({
          title: t("copy_to_clipboard_toast"),
        })
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err)
    }
    
    document.body.removeChild(textArea)
  }

  return (
    <Button onClick={handleCopy} size="icon" variant="ghost" {...props}>
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      <span className="sr-only">Copy</span>
    </Button>
  )
}
