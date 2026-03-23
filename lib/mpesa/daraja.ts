import 'server-only'
import { mpesaConfig } from './config'
import type { DarajaAuthToken, STKPushPayload, STKPushResponse } from '@/types/mpesa'

function generateTimestamp(): string {
  return new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
}

function generateSTKPassword(shortcode: string, passkey: string, timestamp: string): string {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')
}

export async function getDarajaAccessToken(): Promise<string> {
  const credentials = Buffer.from(
    `${mpesaConfig.consumerKey}:${mpesaConfig.consumerSecret}`
  ).toString('base64')

  const response = await fetch(
    `${mpesaConfig.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    throw new Error(`Daraja auth failed: ${response.status} ${response.statusText}`)
  }

  const data: DarajaAuthToken = await response.json()
  return data.access_token
}

export async function initiateSTKPush(payload: STKPushPayload): Promise<STKPushResponse> {
  const accessToken = await getDarajaAccessToken()
  const timestamp = generateTimestamp()
  const password = generateSTKPassword(mpesaConfig.shortcode, mpesaConfig.passkey, timestamp)

  const response = await fetch(
    `${mpesaConfig.baseUrl}/mpesa/stkpush/v1/processrequest`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: mpesaConfig.shortcode,
        Password:          password,
        Timestamp:         timestamp,
        TransactionType:   'CustomerPayBillOnline',
        Amount:            payload.amountKES,
        PartyA:            payload.phoneNumber,
        PartyB:            mpesaConfig.shortcode,
        PhoneNumber:       payload.phoneNumber,
        CallBackURL:       mpesaConfig.callbackUrl,
        AccountReference:  payload.lookId,
        TransactionDesc:   `KESTRA ${payload.lookTitle}`.slice(0, 20),
      }),
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    const errBody = await response.text().catch(() => '')
    throw new Error(`STK Push failed: ${response.status} — ${errBody}`)
  }

  return response.json() as Promise<STKPushResponse>
}
