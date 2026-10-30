/**
 * Microsoft Identity Platform (Entra ID / Azure AD v2.0) Authorization Implementation
 * Endpoint: https://login.microsoftonline.com/common/oauth2/v2.0/authorize
 */
import { generateStateParam, generateCodeChallenge, createSessionPayload } from './pkceUtils.js';

export const microsoftAuthProvider = {
  id: 'microsoft',
  name: 'Microsoft',
  tagline: 'Sign in with Entra ID, Azure AD, or Outlook',
  authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  clientId: 'a8f4e21c-9b30-4d1a-8123-nexusmsft01',
  redirectUri: 'https://app.nexusauth.dev/auth/callback/microsoft',
  responseType: 'code',
  codeChallengeMethod: 'S256',
  accentHover: 'hover:border-sky-500/40 hover:bg-sky-500/5',
  badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  scopes: ['User.Read', 'email', 'offline_access'],
  demoAccounts: [
    { name: 'Alex Rivera', email: 'alex.rivera@outlook.com', role: 'Microsoft Account' },
    { name: 'Alex Rivera (Enterprise)', email: 'arivera@corp.microsoft.com', role: 'Entra ID' }
  ],

  buildAuthorizeUrl() {
    const state = generateStateParam('msft');
    const codeChallenge = generateCodeChallenge();
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: this.responseType,
      response_mode: 'query',
      scope: this.scopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: this.codeChallengeMethod
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
