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
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    toast({
      title: t("copy_to_clipboard_toast"),
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button onClick={handleCopy} size="icon" variant="ghost" {...props}>
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      <span className="sr-only">Copy</span>
    </Button>
  )
}
