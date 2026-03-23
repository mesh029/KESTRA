'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { LookEntry } from '@/types/look'
import type { PurchaseStatus } from '@/types/mpesa'
import { MpesaStatusIndicator } from './MpesaStatusIndicator'

interface MpesaPurchaseDrawerProps {
  lookEntry: LookEntry
  isOpen: boolean
  onClose: () => void
}

const STATUS_COPY: Record<PurchaseStatus, { heading: string; body: string }> = {
  idle: {
    heading: 'Purchase This Look',
    body: 'Enter your M-Pesa number. A payment request will be sent directly to your phone.',
  },
  pending: {
    heading: 'Sending Request\u2026',
    body: 'Connecting to M-Pesa. Please wait.',
  },
  'awaiting-pin': {
    heading: 'Enter PIN on Your Phone',
    body: 'Check your phone for the M-Pesa STK Push prompt. Enter your PIN to confirm.',
  },
  success: {
    heading: 'Purchase Confirmed',
    body: 'You will receive an M-Pesa confirmation SMS shortly. Thank you for your order.',
  },
  failed: {
    heading: 'Payment Failed',
    body: 'The request was declined or an error occurred. Please check your M-Pesa balance and try again.',
  },
  timeout: {
    heading: 'Request Timed Out',
    body: 'No response received within 60 seconds. Please try again.',
  },
}

function formatDisplayPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length <= 4) return digits
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`
}

function normalizeToInternational(display: string): string {
  const digits = display.replace(/\D/g, '')
  if (digits.startsWith('0')) return `254${digits.slice(1)}`
  if (digits.startsWith('254')) return digits
  return `254${digits}`
}

export function MpesaPurchaseDrawer({
  lookEntry,
  isOpen,
  onClose,
}: MpesaPurchaseDrawerProps) {
  const [rawPhone, setRawPhone] = useState('')
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>('idle')
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const copy = STATUS_COPY[purchaseStatus]
  const isInteractive =
    purchaseStatus === 'idle' ||
    purchaseStatus === 'failed' ||
    purchaseStatus === 'timeout'

  // Autofocus input when drawer opens in idle/failed/timeout states
  useEffect(() => {
    if (isOpen && isInteractive) {
      const t = setTimeout(() => inputRef.current?.focus(), 350)
      return () => clearTimeout(t)
    }
  }, [isOpen, purchaseStatus, isInteractive])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
    setRawPhone(formatDisplayPhone(digits))
    setErrorDetail(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorDetail(null)
    setPurchaseStatus('pending')

    const phoneNumber = normalizeToInternational(rawPhone)
    if (!/^2547\d{8}$/.test(phoneNumber)) {
      setErrorDetail('Please enter a valid Safaricom number starting with 07 (e.g. 0712 345 678)')
      setPurchaseStatus('idle')
      return
    }

    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          amountKES: lookEntry.priceKES,
          lookId: lookEntry.lookId,
          lookTitle: lookEntry.lookTitle,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error ?? 'Payment initiation failed. Please try again.')
      }

      setPurchaseStatus('awaiting-pin')

      timeoutRef.current = setTimeout(() => {
        setPurchaseStatus((prev) =>
          prev === 'awaiting-pin' ? 'timeout' : prev
        )
      }, 60_000)
    } catch (err) {
      setErrorDetail(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setPurchaseStatus('failed')
    }
  }

  function handleClose() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (purchaseStatus !== 'awaiting-pin' && purchaseStatus !== 'pending') {
      setPurchaseStatus('idle')
      setErrorDetail(null)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ─────────────────────────────────────────────── */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-void-black/60"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* ── Drawer panel ─────────────────────────────────────────── */}
          <motion.div
            key="drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-paper-white border-t border-void-black max-h-[90dvh] flex flex-col"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-[2px] bg-mid-grey" />
            </div>

            {/* ── Drawer header ──────────────────────────────────────── */}
            <div className="flex items-start justify-between px-5 sm:px-8 pt-3 pb-5 border-b border-void-black flex-shrink-0">
              <div className="flex-1 min-w-0 pr-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-steel-grey mb-1.5 truncate">
                  M-Pesa · {lookEntry.lookTitle}
                </p>
                <h2
                  id="drawer-title"
                  className="font-display italic text-[1.4rem] leading-tight text-void-black"
                >
                  {copy.heading}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center border border-void-black hover:bg-void-black hover:text-paper-white transition-colors duration-200 mt-0.5"
                aria-label="Close"
              >
                <X size={14} />
              </button>
            </div>

            {/* ── Drawer body ────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 no-scrollbar">
              <AnimatePresence mode="wait">

                {/* ── SUCCESS STATE ─────────────────────────────── */}
                {purchaseStatus === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6"
                  >
                    <MpesaStatusIndicator status="success" />
                    <h3 className="font-display italic text-[1.2rem] text-void-black mt-5 mb-2">
                      Order confirmed.
                    </h3>
                    <p className="font-sans text-[0.875rem] text-steel-grey max-w-xs mx-auto leading-relaxed">
                      {copy.body}
                    </p>
                    <div className="mt-4 pt-4 border-t border-light-grey">
                      <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-steel-grey">
                        Production begins in 2 business days · 4–6 week delivery
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="mt-7 px-10 py-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] border border-void-black bg-void-black text-paper-white hover:bg-sunset-orange hover:border-sunset-orange transition-colors duration-200"
                    >
                      Done
                    </button>
                  </motion.div>
                )}

                {/* ── AWAITING PIN STATE ────────────────────────── */}
                {purchaseStatus === 'awaiting-pin' && (
                  <motion.div
                    key="awaiting"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6"
                  >
                    <MpesaStatusIndicator status="awaiting-pin" />
                    <p className="font-sans text-[0.875rem] text-steel-grey mt-5 max-w-xs mx-auto leading-relaxed">
                      {copy.body}
                    </p>
                    <div className="mt-6 pt-5 border-t border-light-grey">
                      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-left max-w-[240px] mx-auto">
                        <span className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-steel-grey self-center">Amount</span>
                        <span className="font-sans text-[0.875rem] text-void-black">KES {lookEntry.priceKES.toLocaleString('en-KE')}</span>
                        <span className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-steel-grey self-center">Look</span>
                        <span className="font-sans text-[0.875rem] text-void-black truncate">{lookEntry.lookTitle}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── FORM STATE (idle / failed / timeout) ─────── */}
                {isInteractive && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="font-sans text-[0.875rem] text-steel-grey mb-6 leading-relaxed">
                      {copy.body}
                    </p>

                    <form onSubmit={handleSubmit} noValidate>

                      {/* Phone field */}
                      <div className="mb-5">
                        <label
                          htmlFor="mpesa-phone"
                          className="block font-mono text-[0.58rem] uppercase tracking-[0.2em] text-steel-grey mb-2"
                        >
                          M-Pesa Number (Safaricom)
                        </label>
                        <input
                          ref={inputRef}
                          id="mpesa-phone"
                          type="tel"
                          inputMode="numeric"
                          value={rawPhone}
                          onChange={handlePhoneChange}
                          placeholder="0712 345 678"
                          maxLength={12}
                          autoComplete="tel"
                          className="w-full border border-void-black bg-paper-white px-4 py-3.5 font-mono text-[1rem] text-void-black placeholder:text-steel-grey/50 focus:outline-none focus:border-sunset-orange transition-colors duration-200"
                          required
                        />
                        <AnimatePresence>
                          {errorDetail && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="font-mono text-[0.6rem] text-sunset-orange mt-2 leading-snug"
                            >
                              {errorDetail}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Amount summary */}
                      <div className="bg-light-grey px-4 py-4 mb-5 grid grid-cols-2 gap-y-2.5">
                        <div>
                          <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-steel-grey mb-1">
                            Look
                          </p>
                          <p className="font-sans text-[0.8rem] text-void-black leading-snug">
                            {lookEntry.lookTitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-steel-grey mb-1">
                            Total
                          </p>
                          <p className="font-sans font-medium text-[1.1rem] text-void-black leading-none">
                            KES {lookEntry.priceKES.toLocaleString('en-KE')}
                          </p>
                        </div>
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        className="w-full py-4 font-mono text-[0.65rem] uppercase tracking-[0.22em] bg-void-black text-paper-white border border-void-black hover:bg-sunset-orange hover:border-sunset-orange transition-colors duration-200 active:scale-[0.99]"
                      >
                        Send M-Pesa Request
                      </button>

                      {/* Footnote */}
                      <p className="font-mono text-[0.5rem] uppercase tracking-[0.13em] text-steel-grey text-center mt-4">
                        Powered by Safaricom Daraja · Secure STK Push
                      </p>
                    </form>
                  </motion.div>
                )}

                {/* ── PENDING STATE ─────────────────────────────── */}
                {purchaseStatus === 'pending' && (
                  <motion.div
                    key="pending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <MpesaStatusIndicator status="pending" />
                    <p className="font-sans text-[0.875rem] text-steel-grey mt-5 max-w-xs mx-auto">
                      {copy.body}
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
