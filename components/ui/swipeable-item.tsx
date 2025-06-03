"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SwipeableItemProps {
  children: React.ReactNode
  onEdit?: () => void
  onDelete?: () => void
  threshold?: number
  className?: string
}

export function SwipeableItem({ children, onEdit, onDelete, threshold = 0.4, className }: SwipeableItemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number | null>(null)
  const currentXRef = useRef<number>(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [swipeDistance, setSwipeDistance] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX
    setIsSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startXRef.current || !containerRef.current) return

    const currentX = e.touches[0].clientX
    const diff = startXRef.current - currentX

    // Only allow swiping left (positive diff)
    if (diff < 0) {
      setSwipeDistance(0)
      return
    }

    // Limit the swipe distance to the container width
    const maxSwipe = containerRef.current.offsetWidth * 0.6
    const newDistance = Math.min(diff, maxSwipe)

    setSwipeDistance(newDistance)
    currentXRef.current = newDistance
  }

  const handleTouchEnd = () => {
    if (!containerRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const swipeThreshold = containerWidth * threshold

    if (swipeDistance > swipeThreshold) {
      // Show action buttons
      setSwipeDistance(containerWidth * 0.4)
    } else {
      // Reset position
      setSwipeDistance(0)
    }

    setIsSwiping(false)
    startXRef.current = null
  }

  const resetPosition = () => {
    setSwipeDistance(0)
  }

  // Reset position when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node) && swipeDistance > 0) {
        resetPosition()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [swipeDistance])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Action buttons */}
      <div className="absolute inset-y-0 right-0 flex h-full">
        {onEdit && (
          <button
            onClick={() => {
              onEdit()
              resetPosition()
            }}
            className="flex items-center justify-center w-16 bg-blue-500 text-white"
          >
            <Edit className="h-5 w-5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => {
              onDelete()
              resetPosition()
            }}
            className="flex items-center justify-center w-16 bg-red-500 text-white"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className={cn(
          "relative bg-background transition-transform",
          isSwiping ? "transition-none" : "transition-transform duration-200 ease-out",
        )}
        style={{ transform: `translateX(-${swipeDistance}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}
