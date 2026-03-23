'use client'

import { useEffect, useState } from 'react'
import type { LookEntry } from '@/types/look'
import { LookRackCard } from './LookRackCard'

/* ─────────────────────────────────────────────────────────────────────────────
   MASONRY RACK
   A Pinterest-style masonry grid for the Look collection.

   Architecture:
   • Flex-column approach — items are split into N columns (JS, not CSS columns)
     so Framer Motion viewport reveals work correctly and column count is
     responsive via a ResizeObserver hook.
   • Aspect ratios are varied deterministically (based on col + row position)
     so every refresh looks the same but the grid feels organic.
   • No external masonry library — zero extra bundle weight.
────────────────────────────────────────────────────────────────────────────── */

/* Aspect ratio cycle — ordered so adjacent cells almost never repeat */
const ASPECT_POOL: string[] = [
  '3/4',   // standard portrait
  '2/3',   // tall portrait
  '4/5',   // slightly shorter
  '1/1',   // square
  '3/5',   // very tall
  '3/4',
  '4/5',
  '2/3',
  '1/1',
  '3/5',
]

/**
 * Returns a deterministic aspect ratio that avoids repeating vertically
 * within the same column.
 */
function pickAspectRatio(colIndex: number, rowIndex: number): string {
  const offset = colIndex * 3
  return ASPECT_POOL[(offset + rowIndex * 2) % ASPECT_POOL.length]
}

/**
 * Height "weight" of each aspect ratio — used to estimate column height
 * so we can always insert the next card into the shortest column.
 * This is the same algorithm Pinterest uses to eliminate bottom-edge gaps.
 */
const ASPECT_WEIGHT: Record<string, number> = {
  '3/4': 1.33,
  '2/3': 1.50,
  '4/5': 1.25,
  '1/1': 1.00,
  '3/5': 1.67,
}

/**
 * Shortest-column-first distribution.
 * Each item goes to whichever column currently has the least estimated height.
 * Result: column bottoms are as even as possible — no orphan gaps.
 */
function distributeToColumns<T>(items: T[], count: number): T[][] {
  const cols: T[][] = Array.from({ length: count }, () => [])
  const heights: number[] = new Array(count).fill(0)
  const GAP_UNIT = 0.03 // gap between cards in height units

  items.forEach((item) => {
    const targetCol = heights.indexOf(Math.min(...heights))
    cols[targetCol].push(item)
    const rowIdx = cols[targetCol].length - 1
    const ar = pickAspectRatio(targetCol, rowIdx)
    heights[targetCol] += (ASPECT_WEIGHT[ar] ?? 1.33) + GAP_UNIT
  })

  return cols
}

/** Derive column count from container width */
function widthToColumnCount(width: number): number {
  if (width < 480) return 2
  if (width < 768) return 3
  if (width < 1200) return 4
  return 5
}

interface MasonryRackProps {
  looks: LookEntry[]
  /** Offset added to global look index so rack numbering starts after cover (index 0 = cover) */
  indexOffset?: number
}

export function MasonryRack({ looks, indexOffset = 1 }: MasonryRackProps) {
  const [columnCount, setColumnCount] = useState(3) // SSR default

  /* Responsive column count via ResizeObserver */
  useEffect(() => {
    const root = document.getElementById('masonry-rack-root')
    if (!root) return

    const ro = new ResizeObserver(([entry]) => {
      setColumnCount(widthToColumnCount(entry.contentRect.width))
    })
    ro.observe(root)

    // Set immediately on mount
    setColumnCount(widthToColumnCount(root.getBoundingClientRect().width))

    return () => ro.disconnect()
  }, [])

  const columns = distributeToColumns(looks, columnCount)

  return (
    /*
     * items-stretch so every column div reaches the tallest column's height.
     * Each column is flex-col. The last card in every column gets fillHeight=true
     * so it expands with flex-grow:1 to consume the leftover space — exactly like
     * Pinterest stretches its last card in each column to align the grid bottom.
     */
    <div
      id="masonry-rack-root"
      className="flex gap-1.5 items-stretch"
      role="list"
      aria-label="Collection looks"
    >
      {columns.map((colItems, colIdx) => (
        <div
          key={colIdx}
          className="flex flex-col gap-1.5 flex-1 min-w-0"
          role="listitem"
        >
          {colItems.map((look, rowIdx) => {
            const isLast = rowIdx === colItems.length - 1
            const globalIndex = rowIdx * columnCount + colIdx + indexOffset
            const aspectRatio = pickAspectRatio(colIdx, rowIdx)

            return (
              /* Wrapper: last card gets flex-grow so it fills remaining column height */
              <div
                key={look.lookId}
                className={isLast ? 'flex-1 min-h-[160px]' : undefined}
              >
                <LookRackCard
                  look={look}
                  index={globalIndex}
                  aspectRatio={aspectRatio}
                  colDelay={colIdx * 0.07}
                  fillHeight={isLast}
                />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
