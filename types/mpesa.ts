// ─── KESTRA PROTOCOL — M-Pesa Type Definitions ──────────────────────────────

export interface STKPushPayload {
  phoneNumber: string               // Format: 2547XXXXXXXX (no +, no spaces)
  amountKES: number                 // Integer, no decimals
  lookId: string
  lookTitle: string
}

export interface STKPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export interface DarajaAuthToken {
  access_token: string
  expires_in: string
}

export interface STKCallbackPayload {
  Body: {
    stkCallback: {
      MerchantRequestID: string
      CheckoutRequestID: string
      ResultCode: number            // 0 = success, any other = failure
      ResultDesc: string
      CallbackMetadata?: {
        Item: Array<{ Name: string; Value: string | number }>
      }
    }
  }
}

export type PurchaseStatus =
  | 'idle'
  | 'pending'
  | 'awaiting-pin'
  | 'success'
  | 'failed'
  | 'timeout'
