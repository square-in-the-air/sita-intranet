import { handlers } from '@/auth'

// Handles /api/auth/* (Microsoft redirect, callback, session, sign out).
// The Entra redirect URI is /api/auth/callback/microsoft-entra-id
export const { GET, POST } = handlers
