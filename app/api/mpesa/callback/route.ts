import { NextRequest, NextResponse } from 'next/server'
import type { STKCallbackPayload } from '@/types/mpesa'

export async function POST(request: NextRequest) {
  try {
    const payload: STKCallbackPayload = await request.json()
    const { stkCallback } = payload.Body

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback

    if (ResultCode === 0) {
      // Payment successful — extract metadata
      const meta = stkCallback.CallbackMetadata?.Item ?? []
      const getMeta = (name: string) =>
        meta.find((item) => item.Name === name)?.Value

      const mpesaReceiptNumber = getMeta('MpesaReceiptNumber')
      const transactionDate    = getMeta('TransactionDate')
      const phoneNumber        = getMeta('PhoneNumber')

      // TODO: persist order to database
      // await db.insert(orders).values({
      //   merchantRequestId: MerchantRequestID,
      //   checkoutRequestId: CheckoutRequestID,
      //   mpesaReceiptNumber,
      //   transactionDate: String(transactionDate),
      //   status: 'paid',
      // })

      console.info('[M-Pesa Callback] Payment confirmed', {
        MerchantRequestID,
        CheckoutRequestID,
        mpesaReceiptNumber,
        transactionDate,
        // Never log phone numbers in production
        phoneLast4: phoneNumber ? String(phoneNumber).slice(-4) : 'N/A',
      })
    } else {
      // Payment failed or cancelled
      console.warn('[M-Pesa Callback] Payment not completed', {
        MerchantRequestID,
        CheckoutRequestID,
        ResultCode,
        ResultDesc,
      })

      // TODO: update order status to 'failed' in DB
    }

    // Always return 200 to Safaricom — they require this within 5 seconds
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' }, { status: 200 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[M-Pesa Callback] Parse error:', message)
    // Still return 200 — Safaricom will retry on any non-200
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' }, { status: 200 })
  }
}
