/**
 * GitHub Developer OAuth 2.0 Web Application Flow Implementation
 * Endpoint: https://github.com/login/oauth/authorize
 */
import { generateStateParam, createSessionPayload } from './pkceUtils.js';

export const githubAuthProvider = {
  id: 'github',
  name: 'GitHub',
  tagline: 'Authenticate with your GitHub developer account',
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  clientId: 'Iv1.9a8b7c6d5e4f3g2h',
  redirectUri: 'https://app.nexusauth.dev/auth/callback/github',
  accentHover: 'hover:border-purple-500/40 hover:bg-purple-500/5',
  badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  scopes: ['read:user', 'user:email'],
  demoAccounts: [
    { name: '@alexrivera-dev', email: 'alex@github-users.dev', role: 'Pro Developer' }
  ],

  buildAuthorizeUrl() {
    const state = generateStateParam('github');
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes.join(' '),
      state,
      allow_signup: 'true'
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
