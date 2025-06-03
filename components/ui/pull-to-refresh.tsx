"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  pullDownThreshold?: number
  maxPullDownDistance?: number
}

export function PullToRefresh({
  onRefresh,
  children,
  pullDownThreshold = 80,
  maxPullDownDistance = 120,
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number | null>(null)
  const scrollTopRef = useRef<number>(0)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (containerRef.current) {
        scrollTopRef.current = containerRef.current.scrollTop
        if (scrollTopRef.current === 0) {
          startYRef.current = e.touches[0].clientY
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startYRef.current !== null && !isRefreshing && containerRef.current) {
        const currentY = e.touches[0].clientY
        const diff = currentY - startYRef.current

        if (diff > 0 && containerRef.current.scrollTop === 0) {
          setIsPulling(true)
          setPullDistance(Math.min(diff * 0.5, maxPullDownDistance))
          e.preventDefault()
        } else {
          setIsPulling(false)
          setPullDistance(0)
        }
      }
    }

    const handleTouchEnd = async () => {
      if (isPulling && pullDistance >= pullDownThreshold) {
        setIsRefreshing(true)
        setPullDistance(pullDownThreshold)

        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
          setPullDistance(0)
          setIsPulling(false)
        }
      } else {
        setPullDistance(0)
        setIsPulling(false)
      }

      startYRef.current = null
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isPulling, isRefreshing, pullDistance, pullDownThreshold, maxPullDownDistance, onRefresh])

  const refreshIndicatorHeight = Math.min(pullDistance, maxPullDownDistance)
  const progress = (refreshIndicatorHeight / pullDownThreshold) * 100
  const shouldShowSpinner = isRefreshing || progress >= 100

  return (
    <div ref={containerRef} className="h-full overflow-auto" style={{ overscrollBehavior: "none" }}>
      <div
        className="flex items-center justify-center transition-all duration-200 overflow-hidden"
        style={{ height: `${refreshIndicatorHeight}px` }}
      >
        {shouldShowSpinner ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : (
          <div
            className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent"
            style={{ transform: `rotate(${progress * 3.6}deg)` }}
          />
        )}
      </div>
      {children}
    </div>
  )
}
