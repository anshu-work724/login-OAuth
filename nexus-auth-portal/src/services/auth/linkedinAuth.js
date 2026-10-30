/**
 * LinkedIn OAuth 2.0 Professional Identity Authorization Implementation
 * Endpoint: https://www.linkedin.com/oauth/v2/authorization
 */
import { generateStateParam, createSessionPayload } from './pkceUtils.js';

export const linkedinAuthProvider = {
  id: 'linkedin',
  name: 'LinkedIn',
  tagline: 'Verify professional identity via LinkedIn OAuth 2.0',
  authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
  clientId: '86nexuslinkedinclient',
  redirectUri: 'https://app.nexusauth.dev/auth/callback/linkedin',
  responseType: 'code',
  accentHover: 'hover:border-blue-500/40 hover:bg-blue-500/5',
  badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  scopes: ['r_liteprofile', 'r_emailaddress'],
  demoAccounts: [
    { name: 'Alex Rivera • Staff UI Engineer', email: 'alex.rivera@linkedin.member', role: 'Verified Profile' }
  ],

  buildAuthorizeUrl() {
    const state = generateStateParam('linkedin');
    const params = new URLSearchParams({
      response_type: this.responseType,
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state,
      scope: this.scopes.join(' ')
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
