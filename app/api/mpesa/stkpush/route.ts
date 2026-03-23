import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { initiateSTKPush } from '@/lib/mpesa/daraja'

const stkPushRequestSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^2547\d{8}$/, 'Phone must be in format 2547XXXXXXXX'),
  amountKES: z
    .number()
    .int('Amount must be a whole number')
    .positive('Amount must be positive')
    .max(150000, 'Amount exceeds M-Pesa single-transaction limit'),
  lookId:    z.string().min(1),
  lookTitle: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json()
    const parsed = stkPushRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const stkResponse = await initiateSTKPush(parsed.data)

    return NextResponse.json(
      { checkoutRequestId: stkResponse.CheckoutRequestID },
      { status: 200 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error'
    console.error('[STK Push]', message)
    return NextResponse.json({ error: 'Payment initiation failed' }, { status: 500 })
  }
}
