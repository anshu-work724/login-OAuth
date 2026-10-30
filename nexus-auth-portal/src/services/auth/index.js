/**
 * Central Authorization Barrel & Provider Registry
 * Exports each isolated authorization implementation module.
 */
import {
  EMAIL_AUTH_CONFIG,
  evaluatePasswordChecks,
  authenticateWithEmail,
  requestPasswordReset
} from './emailPasswordAuth.js';
import { googleAuthProvider } from './googleAuth.js';
import { microsoftAuthProvider } from './microsoftAuth.js';
import { linkedinAuthProvider } from './linkedinAuth.js';
import { githubAuthProvider } from './githubAuth.js';
import { facebookAuthProvider } from './facebookAuth.js';

export const OAUTH_PROVIDERS = [
  googleAuthProvider,
  microsoftAuthProvider,
  linkedinAuthProvider,
  githubAuthProvider,
  facebookAuthProvider
];

export const AUTH_PROVIDERS_MAP = {
  google: googleAuthProvider,
  microsoft: microsoftAuthProvider,
  linkedin: linkedinAuthProvider,
  github: githubAuthProvider,
  facebook: facebookAuthProvider
};

export {
  EMAIL_AUTH_CONFIG,
  evaluatePasswordChecks,
  authenticateWithEmail,
  requestPasswordReset,
  googleAuthProvider,
  microsoftAuthProvider,
  linkedinAuthProvider,
  githubAuthProvider,
  facebookAuthProvider
};
