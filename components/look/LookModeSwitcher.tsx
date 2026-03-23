'use client'

import { motion } from 'framer-motion'
import type { LookMode } from '@/types/look'

interface LookModeSwitcherProps {
  activeMode: LookMode
  onModeChange: (mode: LookMode) => void
}

const MODES: { value: LookMode; label: string; desc: string }[] = [
  { value: 'editorial', label: 'Editorial', desc: 'Story & credits' },
  { value: 'specs',     label: 'Tailor Specs', desc: 'Fabric & construction' },
]

export function LookModeSwitcher({ activeMode, onModeChange }: LookModeSwitcherProps) {
  return (
    <div
      className="flex gap-0 border-b border-void-black"
      role="tablist"
      aria-label="Look view mode"
    >
      {MODES.map(({ value, label }) => (
        <button
          key={value}
          role="tab"
          aria-selected={activeMode === value}
          onClick={() => onModeChange(value)}
          className={`relative flex-1 text-left py-3 pr-6 transition-colors duration-200 group ${
            activeMode === value ? 'text-void-black' : 'text-steel-grey hover:text-void-black'
          }`}
        >
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em]">
            {label}
          </span>

          {/* Active indicator — animated underline */}
          {activeMode === value && (
            <motion.div
              layoutId="mode-underline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-void-black"
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
