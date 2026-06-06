import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { user, session, account, verification } from '@/lib/db/schema'
import { VerificationEmail } from '@/emails/VerificationEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user, session, account, verification },
  }),

  // URL приложения — нужен для формирования callback URL в OAuth
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    expiresIn: 60 * 60 * 24,
    sendVerificationEmail: async ({ user: u, url }) => {
      await resend.emails.send({
        from: 'Sferus <onboarding@resend.dev>',
        to: u.email,
        subject: 'Подтвердите email — Sferus',
        react: VerificationEmail({ name: u.name, verificationUrl: url }),
      })
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Google всегда возвращает verified email — пропускаем шаг верификации
      // better-auth автоматически ставит emailVerified: true для OAuth пользователей
    },
  },

  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
