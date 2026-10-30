/**
 * Shared OAuth 2.0 PKCE & CSRF State Utilities
 * Used across Google, Microsoft, LinkedIn, GitHub, and Facebook auth modules.
 */

export function generateStateParam(prefix = 'nx') {
  const randomPart = Math.random().toString(36).substring(2, 12);
  return `${prefix}_state_${Date.now().toString(36)}_${randomPart}`;
}

export function generateCodeChallenge() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < 43; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createSessionPayload({ name, email, provider, providerId, role, scopes = [] }) {
  const randomSuffix = Math.random().toString(36).substring(2, 12);
  return {
    name,
    email,
    provider,
    providerId,
    role,
    scopes,
    token: `oauth2_${providerId}_${randomSuffix}`,
    loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
