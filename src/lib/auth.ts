import { betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { Resend } from 'resend'
import { db } from '@/lib/db'
import { generateUsername } from '@/lib/username'
import { user, session, account, verification, profiles } from '@/lib/db/schema'
import { VerificationEmail } from '@/emails/VerificationEmail'
import { ResetPasswordEmail } from '@/emails/ResetPasswordEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user, session, account, verification },
  }),

  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPassword: async ({ user: u, url }) => {
      await resend.emails.send({
        from: 'Sferus <onboarding@resend.dev>',
        to: u.email,
        subject: 'Сброс пароля — Sferus',
        react: ResetPasswordEmail({ name: u.name, resetUrl: url }),
      });
    },
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
      });
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (u) => {
          const username = await generateUsername(u.name);
          await db.insert(profiles).values({
            userId: u.id,
            username,
          });
        },
      },
    },
  },

  plugins: [
    admin({ defaultRole: 'user', adminRoles: ['admin'] }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
