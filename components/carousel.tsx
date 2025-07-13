"use client"

import type * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  title?: string
}

export function Carousel<T>({ items, renderItem, title }: CarouselProps<T>) {
  return (
    <div className="w-full">
      {title && <h3 className="text-2xl font-bold mb-4">{title}</h3>}
      <ShadcnCarousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="h-full">
                  {" "}
                  {/* Ensure the card itself takes full height */}
                  <CardContent className="flex flex-col justify-center p-6 h-full">
                    {" "}
                    {/* Removed aspect-square */}
                    {renderItem(item, index)}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </ShadcnCarousel>
    </div>
  )
}
