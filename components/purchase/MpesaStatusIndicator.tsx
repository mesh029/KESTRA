'use client'

import { motion } from 'framer-motion'
import type { PurchaseStatus } from '@/types/mpesa'

interface MpesaStatusIndicatorProps {
  status: PurchaseStatus
}

export function MpesaStatusIndicator({ status }: MpesaStatusIndicatorProps) {
  if (status === 'pending') {
    return (
      <div className="flex flex-col items-center gap-3">
        {/* Animated ring */}
        <motion.div
          className="w-10 h-10 border border-void-black rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-steel-grey">
          Connecting…
        </span>
      </div>
    )
  }

  if (status === 'awaiting-pin') {
    return (
      <div className="flex items-center gap-3">
        {/* Pulsing dot trio */}
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.span
            key={i}
            className="block w-2 h-2 rounded-full bg-void-black"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.2, delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-steel-grey ml-1">
          Awaiting PIN
        </span>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-2">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-12 h-12 border-2 border-void-black flex items-center justify-center"
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
          >
            <motion.path
              d="M4 10l5 5 7-8"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="square"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            />
          </motion.svg>
        </motion.div>
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-steel-grey">
          Confirmed
        </span>
      </div>
    )
  }

  if (status === 'failed' || status === 'timeout') {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-[0.9rem] text-sunset-orange">✕</span>
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-sunset-orange">
          {status === 'timeout' ? 'Timed Out' : 'Failed'}
        </span>
      </div>
    )
  }

  return null
}
