"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { debounce } from "@/lib/utils"
import { useCallback, useState } from "react"

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  debounceTime?: number
  initialValue?: string
}

export function SearchInput({
  onSearch,
  placeholder = "Search...",
  debounceTime = 300,
  initialValue = "",
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState(initialValue)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query)
    }, debounceTime),
    [onSearch, debounceTime],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSearch(value)
  }

  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="pl-9 pr-4 py-2 rounded-md border focus:ring-2 focus:ring-primary focus:border-primary"
      />
    </div>
  )
}
