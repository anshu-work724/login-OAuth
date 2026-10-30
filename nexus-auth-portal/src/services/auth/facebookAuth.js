/**
 * Facebook Login (Meta Graph API v19.0) OAuth 2.0 Implementation
 * Endpoint: https://www.facebook.com/v19.0/dialog/oauth
 */
import { generateStateParam, createSessionPayload } from './pkceUtils.js';

export const facebookAuthProvider = {
  id: 'facebook',
  name: 'Facebook',
  tagline: 'Quick social login via Meta Graph API',
  authorizationEndpoint: 'https://www.facebook.com/v19.0/dialog/oauth',
  tokenEndpoint: 'https://graph.facebook.com/v19.0/oauth/access_token',
  clientId: '1094827165432109',
  redirectUri: 'https://app.nexusauth.dev/auth/callback/facebook',
  responseType: 'code',
  accentHover: 'hover:border-indigo-500/40 hover:bg-indigo-500/5',
  badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  scopes: ['public_profile', 'email'],
  demoAccounts: [
    { name: 'Alex Rivera', email: 'alex.social@meta.com', role: 'Meta Profile' }
  ],

  buildAuthorizeUrl() {
    const state = generateStateParam('facebook');
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state,
      response_type: this.responseType,
      scope: this.scopes.join(',')
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
