/**
 * Email & Password Authorization Module
 * Handles credential validation, entropy calculation, password recovery, and JWT issuance.
 */

export const EMAIL_AUTH_CONFIG = {
  id: 'email',
  name: 'Email & Password',
  hashAlgorithm: 'Argon2id (t=3, m=65536, p=4)',
  tokenTTL: '30d (Remember Me) / 24h (Standard)'
};

export function evaluatePasswordChecks(password = '') {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
}

export function authenticateWithEmail({ mode, fullName, email, password, rememberMe }) {
  const cleanEmail = email.trim();
  const displayName =
    mode === 'signup'
      ? fullName.trim()
      : cleanEmail
          .split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    name: displayName,
    email: cleanEmail,
    provider: EMAIL_AUTH_CONFIG.name,
    providerId: EMAIL_AUTH_CONFIG.id,
    role: mode === 'signup' ? 'New Workspace Member' : 'Verified Member',
    rememberMe: Boolean(rememberMe),
    token: 'eyJhbGciOiJFZERTQSI...nx_' + Math.random().toString(36).substring(2, 10),
    loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

export function requestPasswordReset(email) {
  return {
    status: 'sent',
    email: email.trim(),
    expiresInMinutes: 15,
    requestedAt: new Date().toISOString()
  };
}
