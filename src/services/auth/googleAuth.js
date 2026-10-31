/**
 * Google OAuth 2.0 + OpenID Connect Authorization Implementation
 * Endpoint: https://accounts.google.com/o/oauth2/v2/auth
 */
import { generateStateParam, generateCodeChallenge, createSessionPayload } from './pkceUtils.js';

export const googleAuthProvider = {
  id: 'google',
  name: 'Google',
  tagline: 'Continue with Google Workspace or Gmail',
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  clientId: 'nexus-google-client.apps.googleusercontent.com',
  redirectUri: 'https://app.nexusauth.dev/auth/callback/google',
  responseType: 'code',
  codeChallengeMethod: 'S256',
  accentHover: 'hover:border-red-500/40 hover:bg-red-500/5',
  badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
  scopes: ['openid', 'email', 'profile'],
  demoAccounts: [
    { name: 'Alex Rivera', email: 'alex.rivera@gmail.com', role: 'Personal Account' },
    { name: 'Alex Rivera (Work)', email: 'alex@nexus-studio.dev', role: 'Google Workspace' }
  ],

  buildAuthorizeUrl() {
    const state = generateStateParam('google');
    const codeChallenge = generateCodeChallenge();
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: this.responseType,
      scope: this.scopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: this.codeChallengeMethod,
      access_type: 'offline',
      prompt: 'select_account'
    });
    return `${this.authorizationEndpoint}?${params.toString()}`;
  },

  exchangeCodeForSession(account) {
    return createSessionPayload({
      name: account.name,
      email: account.email,
      provider: `${this.name} OAuth 2.0`,
      providerId: this.id,
      role: account.role,
      scopes: this.scopes
    });
  }
};
