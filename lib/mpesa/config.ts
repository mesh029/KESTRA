import 'server-only'

export const mpesaConfig = {
  consumerKey:    process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  shortcode:      process.env.MPESA_SHORTCODE!,
  passkey:        process.env.MPESA_PASSKEY!,
  callbackUrl:    process.env.MPESA_CALLBACK_URL!,
  baseUrl:
    process.env.MPESA_ENVIRONMENT === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke',
} as const
