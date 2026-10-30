import React, { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  KeyRound,
  LogOut,
  Check,
  RefreshCw,
  Sun,
  Moon,
  Copy,
  Terminal,
  Laptop,
  Fingerprint,
  Globe,
  ChevronRight,
  X,
  Info,
  FolderTree,
  FileCode2
} from 'lucide-react';

import { BrandIcons } from './components/icons/BrandIcons.jsx';
import {
  OAUTH_PROVIDERS,
  evaluatePasswordChecks,
  authenticateWithEmail,
  requestPasswordReset
} from './services/auth/index.js';

const ARCHITECTURE_FILES = [
  {
    "path": "tailwind.config.js",
    "label": "Tailwind CSS Config & Keyframes",
    "code": "/** @type {import('tailwindcss').Config} */\nexport default {\n  content: [\n    './index.html',\n    './src/**/*.{js,ts,jsx,tsx}'\n  ],\n  darkMode: 'class',\n  theme: {\n    extend: {\n      fontFamily: {\n        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],\n        mono: ['JetBrains Mono', 'Fira Code', 'monospace']\n      },\n      animation: {\n        fadeIn: 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',\n        floatSlow: 'floatSlow 6s ease-in-out infinite',\n        pulseGlow: 'pulseGlow 4s ease-in-out infinite'\n      },\n      keyframes: {\n        fadeIn: {\n          '0%': { opacity: '0', transform: 'translateY(8px)' },\n          '100%': { opacity: '1', transform: 'translateY(0)' }\n        },\n        floatSlow: {\n          '0%, 100%': { transform: 'translateY(0px)' },\n          '50%': { transform: 'translateY(-8px)' }\n        },\n        pulseGlow: {\n          '0%, 100%': { opacity: '0.18', transform: 'scale(1)' },\n          '50%': { opacity: '0.32', transform: 'scale(1.06)' }\n        }\n      }\n    }\n  },\n  plugins: []\n};\n"
  },
  {
    "path": "postcss.config.js",
    "label": "PostCSS Config (Tailwind + Autoprefixer)",
    "code": "export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {}\n  }\n};\n"
  },
  {
    "path": "src/index.css",
    "label": "Main Stylesheet & Tailwind Directives",
    "code": "@import './styles/animations.css';\n@import './styles/auth.css';\n\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n  :root {\n    color-scheme: dark light;\n  }\n\n  * {\n    box-sizing: border-box;\n  }\n\n  html,\n  body,\n  #root {\n    min-height: 100vh;\n    margin: 0;\n    padding: 0;\n    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n}\n"
  },
  {
    "path": "src/styles/animations.css",
    "label": "Keyframe Animations Stylesheet",
    "code": "/* ==========================================================================\n   src/styles/animations.css\n   Keyframes & Micro-Interaction Transitions for NexusAuth Portal\n   ========================================================================== */\n\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes floatSlow {\n  0%,\n  100% {\n    transform: translateY(0px);\n  }\n  50% {\n    transform: translateY(-8px);\n  }\n}\n\n@keyframes shimmerSweep {\n  0% {\n    transform: translateX(-100%);\n  }\n  100% {\n    transform: translateX(100%);\n  }\n}\n\n.animate-fadeIn {\n  animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n}\n\n.animate-floatSlow {\n  animation: floatSlow 6s ease-in-out infinite;\n}\n"
  },
  {
    "path": "src/styles/auth.css",
    "label": "Glassmorphism & Input Autofill Styles",
    "code": "/* ==========================================================================\n   src/styles/auth.css\n   Component Surface Polish, Scrollbars & Glassmorphic Utilities\n   ========================================================================== */\n\n/* Custom subtle scrollbars for code viewer & modals */\n::-webkit-scrollbar {\n  width: 6px;\n  height: 6px;\n}\n\n::-webkit-scrollbar-track {\n  background: rgba(15, 23, 42, 0.4);\n}\n\n::-webkit-scrollbar-thumb {\n  background: rgba(99, 102, 241, 0.35);\n  border-radius: 9999px;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: rgba(99, 102, 241, 0.6);\n}\n\n/* Remove browser autofill yellow/blue background flash */\ninput:-webkit-autofill,\ninput:-webkit-autofill:hover,\ninput:-webkit-autofill:focus {\n  -webkit-text-fill-color: inherit;\n  transition: background-color 5000s ease-in-out 0s;\n}\n"
  },
  {
    "path": "src/services/auth/emailPasswordAuth.js",
    "label": "Email & Password Auth Module",
    "code": "/**\n * Email & Password Authorization Module\n * Handles credential validation, entropy calculation, password recovery, and JWT issuance.\n */\n\nexport const EMAIL_AUTH_CONFIG = {\n  id: 'email',\n  name: 'Email & Password',\n  hashAlgorithm: 'Argon2id (t=3, m=65536, p=4)',\n  tokenTTL: '30d (Remember Me) / 24h (Standard)'\n};\n\nexport function evaluatePasswordChecks(password = '') {\n  return {\n    length: password.length >= 8,\n    uppercase: /[A-Z]/.test(password),\n    number: /[0-9]/.test(password),\n    special: /[^A-Za-z0-9]/.test(password)\n  };\n}\n\nexport function authenticateWithEmail({ mode, fullName, email, password, rememberMe }) {\n  const cleanEmail = email.trim();\n  const displayName =\n    mode === 'signup'\n      ? fullName.trim()\n      : cleanEmail\n          .split('@')[0]\n          .replace(/[._-]/g, ' ')\n          .replace(/\\b\\w/g, (l) => l.toUpperCase());\n\n  return {\n    name: displayName,\n    email: cleanEmail,\n    provider: EMAIL_AUTH_CONFIG.name,\n    providerId: EMAIL_AUTH_CONFIG.id,\n    role: mode === 'signup' ? 'New Workspace Member' : 'Verified Member',\n    rememberMe: Boolean(rememberMe),\n    token: 'eyJhbGciOiJFZERTQSI...nx_' + Math.random().toString(36).substring(2, 10),\n    loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })\n  };\n}\n\nexport function requestPasswordReset(email) {\n  return {\n    status: 'sent',\n    email: email.trim(),\n    expiresInMinutes: 15,\n    requestedAt: new Date().toISOString()\n  };\n}\n"
  },
  {
    "path": "src/services/auth/googleAuth.js",
    "label": "Google OAuth 2.0 / OIDC Module",
    "code": "/**\n * Google OAuth 2.0 + OpenID Connect Authorization Implementation\n * Endpoint: https://accounts.google.com/o/oauth2/v2/auth\n */\nimport { generateStateParam, generateCodeChallenge, createSessionPayload } from './pkceUtils.js';\n\nexport const googleAuthProvider = {\n  id: 'google',\n  name: 'Google',\n  tagline: 'Continue with Google Workspace or Gmail',\n  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',\n  tokenEndpoint: 'https://oauth2.googleapis.com/token',\n  clientId: 'nexus-google-client.apps.googleusercontent.com',\n  redirectUri: 'https://app.nexusauth.dev/auth/callback/google',\n  responseType: 'code',\n  codeChallengeMethod: 'S256',\n  accentHover: 'hover:border-red-500/40 hover:bg-red-500/5',\n  badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',\n  scopes: ['openid', 'email', 'profile'],\n  demoAccounts: [\n    { name: 'Alex Rivera', email: 'alex.rivera@gmail.com', role: 'Personal Account' },\n    { name: 'Alex Rivera (Work)', email: 'alex@nexus-studio.dev', role: 'Google Workspace' }\n  ],\n\n  buildAuthorizeUrl() {\n    const state = generateStateParam('google');\n    const codeChallenge = generateCodeChallenge();\n    const params = new URLSearchParams({\n      client_id: this.clientId,\n      redirect_uri: this.redirectUri,\n      response_type: this.responseType,\n      scope: this.scopes.join(' '),\n      state,\n      code_challenge: codeChallenge,\n      code_challenge_method: this.codeChallengeMethod,\n      access_type: 'offline',\n      prompt: 'select_account'\n    });\n    return `${this.authorizationEndpoint}?${params.toString()}`;\n  },\n\n  exchangeCodeForSession(account) {\n    return createSessionPayload({\n      name: account.name,\n      email: account.email,\n      provider: `${this.name} OAuth 2.0`,\n      providerId: this.id,\n      role: account.role,\n      scopes: this.scopes\n    });\n  }\n};\n"
  },
  {
    "path": "src/services/auth/microsoftAuth.js",
    "label": "Microsoft Entra ID OAuth Module",
    "code": "/**\n * Microsoft Identity Platform (Entra ID / Azure AD v2.0) Authorization Implementation\n * Endpoint: https://login.microsoftonline.com/common/oauth2/v2.0/authorize\n */\nimport { generateStateParam, generateCodeChallenge, createSessionPayload } from './pkceUtils.js';\n\nexport const microsoftAuthProvider = {\n  id: 'microsoft',\n  name: 'Microsoft',\n  tagline: 'Sign in with Entra ID, Azure AD, or Outlook',\n  authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',\n  tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',\n  clientId: 'a8f4e21c-9b30-4d1a-8123-nexusmsft01',\n  redirectUri: 'https://app.nexusauth.dev/auth/callback/microsoft',\n  responseType: 'code',\n  codeChallengeMethod: 'S256',\n  accentHover: 'hover:border-sky-500/40 hover:bg-sky-500/5',\n  badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',\n  scopes: ['User.Read', 'email', 'offline_access'],\n  demoAccounts: [\n    { name: 'Alex Rivera', email: 'alex.rivera@outlook.com', role: 'Microsoft Account' },\n    { name: 'Alex Rivera (Enterprise)', email: 'arivera@corp.microsoft.com', role: 'Entra ID' }\n  ],\n\n  buildAuthorizeUrl() {\n    const state = generateStateParam('msft');\n    const codeChallenge = generateCodeChallenge();\n    const params = new URLSearchParams({\n      client_id: this.clientId,\n      redirect_uri: this.redirectUri,\n      response_type: this.responseType,\n      response_mode: 'query',\n      scope: this.scopes.join(' '),\n      state,\n      code_challenge: codeChallenge,\n      code_challenge_method: this.codeChallengeMethod\n    });\n    return `${this.authorizationEndpoint}?${params.toString()}`;\n  },\n\n  exchangeCodeForSession(account) {\n    return createSessionPayload({\n      name: account.name,\n      email: account.email,\n      provider: `${this.name} OAuth 2.0`,\n      providerId: this.id,\n      role: account.role,\n      scopes: this.scopes\n    });\n  }\n};\n"
  },
  {
    "path": "src/services/auth/linkedinAuth.js",
    "label": "LinkedIn OAuth 2.0 Module",
    "code": "/**\n * LinkedIn OAuth 2.0 Professional Identity Authorization Implementation\n * Endpoint: https://www.linkedin.com/oauth/v2/authorization\n */\nimport { generateStateParam, createSessionPayload } from './pkceUtils.js';\n\nexport const linkedinAuthProvider = {\n  id: 'linkedin',\n  name: 'LinkedIn',\n  tagline: 'Verify professional identity via LinkedIn OAuth 2.0',\n  authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',\n  tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',\n  clientId: '86nexuslinkedinclient',\n  redirectUri: 'https://app.nexusauth.dev/auth/callback/linkedin',\n  responseType: 'code',\n  accentHover: 'hover:border-blue-500/40 hover:bg-blue-500/5',\n  badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',\n  scopes: ['r_liteprofile', 'r_emailaddress'],\n  demoAccounts: [\n    { name: 'Alex Rivera \u2022 Staff UI Engineer', email: 'alex.rivera@linkedin.member', role: 'Verified Profile' }\n  ],\n\n  buildAuthorizeUrl() {\n    const state = generateStateParam('linkedin');\n    const params = new URLSearchParams({\n      response_type: this.responseType,\n      client_id: this.clientId,\n      redirect_uri: this.redirectUri,\n      state,\n      scope: this.scopes.join(' ')\n    });\n    return `${this.authorizationEndpoint}?${params.toString()}`;\n  },\n\n  exchangeCodeForSession(account) {\n    return createSessionPayload({\n      name: account.name,\n      email: account.email,\n      provider: `${this.name} OAuth 2.0`,\n      providerId: this.id,\n      role: account.role,\n      scopes: this.scopes\n    });\n  }\n};\n"
  },
  {
    "path": "src/services/auth/githubAuth.js",
    "label": "GitHub OAuth 2.0 Module",
    "code": "/**\n * GitHub Developer OAuth 2.0 Web Application Flow Implementation\n * Endpoint: https://github.com/login/oauth/authorize\n */\nimport { generateStateParam, createSessionPayload } from './pkceUtils.js';\n\nexport const githubAuthProvider = {\n  id: 'github',\n  name: 'GitHub',\n  tagline: 'Authenticate with your GitHub developer account',\n  authorizationEndpoint: 'https://github.com/login/oauth/authorize',\n  tokenEndpoint: 'https://github.com/login/oauth/access_token',\n  clientId: 'Iv1.9a8b7c6d5e4f3g2h',\n  redirectUri: 'https://app.nexusauth.dev/auth/callback/github',\n  accentHover: 'hover:border-purple-500/40 hover:bg-purple-500/5',\n  badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',\n  scopes: ['read:user', 'user:email'],\n  demoAccounts: [\n    { name: '@alexrivera-dev', email: 'alex@github-users.dev', role: 'Pro Developer' }\n  ],\n\n  buildAuthorizeUrl() {\n    const state = generateStateParam('github');\n    const params = new URLSearchParams({\n      client_id: this.clientId,\n      redirect_uri: this.redirectUri,\n      scope: this.scopes.join(' '),\n      state,\n      allow_signup: 'true'\n    });\n    return `${this.authorizationEndpoint}?${params.toString()}`;\n  },\n\n  exchangeCodeForSession(account) {\n    return createSessionPayload({\n      name: account.name,\n      email: account.email,\n      provider: `${this.name} OAuth 2.0`,\n      providerId: this.id,\n      role: account.role,\n      scopes: this.scopes\n    });\n  }\n};\n"
  },
  {
    "path": "src/services/auth/facebookAuth.js",
    "label": "Facebook Graph OAuth Module",
    "code": "/**\n * Facebook Login (Meta Graph API v19.0) OAuth 2.0 Implementation\n * Endpoint: https://www.facebook.com/v19.0/dialog/oauth\n */\nimport { generateStateParam, createSessionPayload } from './pkceUtils.js';\n\nexport const facebookAuthProvider = {\n  id: 'facebook',\n  name: 'Facebook',\n  tagline: 'Quick social login via Meta Graph API',\n  authorizationEndpoint: 'https://www.facebook.com/v19.0/dialog/oauth',\n  tokenEndpoint: 'https://graph.facebook.com/v19.0/oauth/access_token',\n  clientId: '1094827165432109',\n  redirectUri: 'https://app.nexusauth.dev/auth/callback/facebook',\n  responseType: 'code',\n  accentHover: 'hover:border-indigo-500/40 hover:bg-indigo-500/5',\n  badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',\n  scopes: ['public_profile', 'email'],\n  demoAccounts: [\n    { name: 'Alex Rivera', email: 'alex.social@meta.com', role: 'Meta Profile' }\n  ],\n\n  buildAuthorizeUrl() {\n    const state = generateStateParam('facebook');\n    const params = new URLSearchParams({\n      client_id: this.clientId,\n      redirect_uri: this.redirectUri,\n      state,\n      response_type: this.responseType,\n      scope: this.scopes.join(',')\n    });\n    return `${this.authorizationEndpoint}?${params.toString()}`;\n  },\n\n  exchangeCodeForSession(account) {\n    return createSessionPayload({\n      name: account.name,\n      email: account.email,\n      provider: `${this.name} OAuth 2.0`,\n      providerId: this.id,\n      role: account.role,\n      scopes: this.scopes\n    });\n  }\n};\n"
  },
  {
    "path": "src/services/auth/pkceUtils.js",
    "label": "Shared PKCE & State Utilities",
    "code": "/**\n * Shared OAuth 2.0 PKCE & CSRF State Utilities\n * Used across Google, Microsoft, LinkedIn, GitHub, and Facebook auth modules.\n */\n\nexport function generateStateParam(prefix = 'nx') {\n  const randomPart = Math.random().toString(36).substring(2, 12);\n  return `${prefix}_state_${Date.now().toString(36)}_${randomPart}`;\n}\n\nexport function generateCodeChallenge() {\n  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';\n  let result = '';\n  for (let i = 0; i < 43; i += 1) {\n    result += chars.charAt(Math.floor(Math.random() * chars.length));\n  }\n  return result;\n}\n\nexport function createSessionPayload({ name, email, provider, providerId, role, scopes = [] }) {\n  const randomSuffix = Math.random().toString(36).substring(2, 12);\n  return {\n    name,\n    email,\n    provider,\n    providerId,\n    role,\n    scopes,\n    token: `oauth2_${providerId}_${randomSuffix}`,\n    loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })\n  };\n}\n"
  },
  {
    "path": "src/services/auth/index.js",
    "label": "Unified Auth Provider Registry",
    "code": "/**\n * Central Authorization Barrel & Provider Registry\n * Exports each isolated authorization implementation module.\n */\nimport {\n  EMAIL_AUTH_CONFIG,\n  evaluatePasswordChecks,\n  authenticateWithEmail,\n  requestPasswordReset\n} from './emailPasswordAuth.js';\nimport { googleAuthProvider } from './googleAuth.js';\nimport { microsoftAuthProvider } from './microsoftAuth.js';\nimport { linkedinAuthProvider } from './linkedinAuth.js';\nimport { githubAuthProvider } from './githubAuth.js';\nimport { facebookAuthProvider } from './facebookAuth.js';\n\nexport const OAUTH_PROVIDERS = [\n  googleAuthProvider,\n  microsoftAuthProvider,\n  linkedinAuthProvider,\n  githubAuthProvider,\n  facebookAuthProvider\n];\n\nexport const AUTH_PROVIDERS_MAP = {\n  google: googleAuthProvider,\n  microsoft: microsoftAuthProvider,\n  linkedin: linkedinAuthProvider,\n  github: githubAuthProvider,\n  facebook: facebookAuthProvider\n};\n\nexport {\n  EMAIL_AUTH_CONFIG,\n  evaluatePasswordChecks,\n  authenticateWithEmail,\n  requestPasswordReset,\n  googleAuthProvider,\n  microsoftAuthProvider,\n  linkedinAuthProvider,\n  githubAuthProvider,\n  facebookAuthProvider\n};\n"
  }
];

const SHOWCASE_SLIDES = [
  {
    badge: 'Zero-Trust Auth Architecture',
    title: 'Seamless identity across every provider.',
    description:
      'Unified OAuth 2.0 & OIDC flows for Google, Microsoft, LinkedIn, GitHub, and Facebook alongside Argon2id email authentication.',
    metricLabel: 'Auth Handshake Latency',
    metricValue: '42ms p99'
  },
  {
    badge: 'Adaptive Micro-Interactions',
    title: 'Designed for clarity, speed, and conversion.',
    description:
      'Real-time entropy scoring, instant inline validation, keyboard-first navigation, and fluid state transitions built with React + Vite.',
    metricLabel: 'Accessibility Compliance',
    metricValue: 'WCAG AAA'
  },
  {
    badge: 'Enterprise Session Guard',
    title: 'Hardware-backed tokens & smart device trust.',
    description:
      'Automatic PKCE code verification, anomaly detection, and one-click multi-provider account linking out of the box.',
    metricLabel: 'Uptime SLA',
    metricValue: '99.99%'
  }
];

export default function App() {
  // UI & Theme State
  const [darkMode, setDarkMode] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [activeSlide, setActiveSlide] = useState(0);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [showArchModal, setShowArchModal] = useState(false);
  const [selectedArchFile, setSelectedArchFile] = useState(ARCHITECTURE_FILES[0]);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Interactive Field UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);

  // Modals & Notifications
  const [toast, setToast] = useState(null);
  const [oauthModalProvider, setOauthModalProvider] = useState(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Authenticated User Session State
  const [sessionUser, setSessionUser] = useState(null);
  const [connectedProviders, setConnectedProviders] = useState(['email']);

  // Mouse Parallax State for Showcase Panel
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Rotate showcase carousel automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Auto-dismiss toast notifications
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const triggerToast = (type, title, message) => {
    setToast({ type, title, message, id: Date.now() });
  };

  // Email typo suggestion helper
  const emailSuggestion = useMemo(() => {
    if (!email.includes('@')) return null;
    const [local, domain] = email.split('@');
    const typos = {
      'gmial.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'gmail.co': 'gmail.com',
      'outlok.com': 'outlook.com',
      'hotmial.com': 'hotmail.com',
      'yaho.com': 'yahoo.com'
    };
    if (domain && typos[domain.toLowerCase()]) {
      return `${local}@${typos[domain.toLowerCase()]}`;
    }
    return null;
  }, [email]);

  // Password strength rules
  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
  }, [password]);

  const passwordScore = useMemo(() => {
    if (!password) return 0;
    return Object.values(passwordChecks).filter(Boolean).length;
  }, [password, passwordChecks]);

  const passwordStrengthMeta = useMemo(() => {
    const levels = [
      { label: 'Enter a password', color: 'bg-slate-600', text: 'text-slate-400' },
      { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' },
      { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' },
      { label: 'Good', color: 'bg-sky-500', text: 'text-sky-400' },
      { label: 'Strong • High Entropy', color: 'bg-emerald-500', text: 'text-emerald-400' }
    ];
    return levels[passwordScore];
  }, [passwordScore]);

  // Field validation errors
  const errors = useMemo(() => {
    const errs = {};
    if (authMode === 'signup' && touched.fullName && fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name (at least 2 characters).';
    }
    if (touched.email) {
      if (!email.trim()) {
        errs.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        errs.email = 'Please enter a valid email address.';
      }
    }
    if (touched.password) {
      if (!password) {
        errs.password = 'Password is required.';
      } else if (authMode === 'signup' && passwordScore < 3) {
        errs.password = 'Please choose a stronger password (at least 3 criteria).';
      } else if (authMode === 'login' && password.length < 6) {
        errs.password = 'Password must be at least 6 characters.';
      }
    }
    if (authMode === 'signup' && touched.confirmPassword) {
      if (confirmPassword !== password) {
        errs.confirmPassword = 'Passwords do not match.';
      }
    }
    return errs;
  }, [authMode, touched, fullName, email, password, confirmPassword, passwordScore]);

  // Switch between Login and Signup smoothly
  const handleModeSwitch = (targetMode) => {
    if (targetMode === authMode) return;
    setAuthMode(targetMode);
    setTouched({});
    setFocusedField(null);
  };

  // Generate strong password helper
  const handleGeneratePassword = () => {
    const generated = 'Nx9#vL2!qP8@mK4z';
    setPassword(generated);
    setConfirmPassword(generated);
    setShowPassword(true);
    setTouched((prev) => ({ ...prev, password: true, confirmPassword: true }));
    triggerToast('info', 'Strong Password Generated', 'Auto-filled a 16-character high-entropy password.');
  };

  // Fill Demo Credentials helper
  const handleFillDemo = () => {
    if (authMode === 'signup') {
      setFullName('Alex Rivera');
    }
    setEmail('alex.rivera@nexus.dev');
    setPassword('NexusAuth#2026!');
    if (authMode === 'signup') {
      setConfirmPassword('NexusAuth#2026!');
      setAcceptTerms(true);
    }
    setTouched({});
    triggerToast('info', 'Demo Credentials Loaded', 'Click the submit button to test the authentication flow.');
  };

  // Submit Email/Password Form
  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = {
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true
    };
    setTouched(allTouched);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const isNameValid = authMode === 'login' || fullName.trim().length >= 2;
    const isPassValid = authMode === 'login' ? password.length >= 6 : passwordScore >= 3;
    const isConfirmValid = authMode === 'login' || confirmPassword === password;

    if (!isEmailValid || !isNameValid || !isPassValid || !isConfirmValid) {
      triggerToast('error', 'Validation Error', 'Please check the highlighted fields before continuing.');
      return;
    }

    if (authMode === 'signup' && !acceptTerms) {
      triggerToast('error', 'Terms Required', 'Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const displayName =
        authMode === 'signup'
          ? fullName.trim()
          : email
              .split('@')[0]
              .replace(/[._-]/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase());

      setSessionUser({
        name: displayName,
        email: email.trim(),
        provider: 'Email & Password',
        providerId: 'email',
        role: authMode === 'signup' ? 'New Workspace Member' : 'Verified Member',
        token: 'eyJhbGciOiJFZERTQSI...nx_' + Math.random().toString(36).substring(2, 10),
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setConnectedProviders(['email']);
      triggerToast(
        'success',
        authMode === 'signup' ? 'Account Created!' : 'Welcome Back!',
        `Signed in as ${email.trim()}`
      );
    }, 900);
  };

  // Trigger Third-Party OAuth Modal
  const handleOAuthClick = (provider) => {
    setOauthLoading(provider.id);
    setTimeout(() => {
      setOauthLoading(null);
      setOauthModalProvider(provider);
    }, 450);
  };

  // Complete Third-Party OAuth Login
  const handleConfirmOAuth = (provider, account) => {
    setOauthModalProvider(null);
    setSessionUser({
      name: account.name,
      email: account.email,
      provider: `${provider.name} OAuth 2.0`,
      providerId: provider.id,
      role: account.role,
      token: `oauth2_${provider.id}_` + Math.random().toString(36).substring(2, 12),
      loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setConnectedProviders((prev) => Array.from(new Set([...prev, provider.id])));
    triggerToast(
      'success',
      `Authenticated via ${provider.name}`,
      `Connected as ${account.email}`
    );
  };

  // Handle Password Reset
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      triggerToast('error', 'Invalid Email', 'Please enter a valid email address to receive a reset link.');
      return;
    }
    setResetSent(true);
    triggerToast('success', 'Recovery Email Sent', `Password reset instructions sent to ${resetEmail}`);
  };

  // Copy helper with fallback
  const copyText = (key, text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback ignored
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMousePos({ x, y });
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 font-sans selection:bg-indigo-500 selection:text-white ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Ambient Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 animate-pulse ${
            darkMode ? 'bg-indigo-600/20' : 'bg-indigo-400/20'
          }`}
        />
        <div
          className={`absolute top-1/3 -right-32 w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 ${
            darkMode ? 'bg-purple-600/15' : 'bg-purple-400/15'
          }`}
        />
        <div
          className={`absolute -bottom-32 left-1/3 w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 ${
            darkMode ? 'bg-cyan-600/15' : 'bg-cyan-400/15'
          }`}
        />
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-bounce">
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${
              darkMode
                ? 'bg-slate-900/95 border-slate-800 text-slate-100'
                : 'bg-white/95 border-slate-200 text-slate-900'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
            <div className="flex-1 text-xs">
              <p className="font-semibold text-sm">{toast.title}</p>
              <p className={darkMode ? 'text-slate-400 mt-0.5' : 'text-slate-600 mt-0.5'}>{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation / Utility Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Fingerprint className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-base">NexusAuth</span>
            <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              React + Vite
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowArchModal((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              darkMode
                ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/25'
                : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
            <span>Project & Style Files (13)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDevPanel((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Vite + ESLint Setup</span>
          </button>

          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className={`p-2 rounded-xl border transition-all ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800 text-amber-300 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Collapsible Vite + ESLint + npm Developer Drawer */}
      {showDevPanel && (
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-3">
          <div
            className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-xl transition-all ${
              darkMode
                ? 'bg-slate-900/90 border-slate-800 text-slate-200'
                : 'bg-white/95 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Stack Configuration • React 18 + Vite + ESLint (JavaScript / npm)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDevPanel(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div
                className={`p-3 rounded-xl border font-mono flex items-center justify-between ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <span className="truncate">npm create vite@latest auth-app -- --template react</span>
                <button
                  type="button"
                  onClick={() => copyText('cmd1', 'npm create vite@latest auth-app -- --template react')}
                  className="ml-2 p-1 rounded hover:bg-indigo-500/20 text-indigo-400"
                  title="Copy command"
                >
                  {copiedKey === 'cmd1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div
                className={`p-3 rounded-xl border font-mono flex items-center justify-between ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <span className="truncate">npm install && npm run lint</span>
                <button
                  type="button"
                  onClick={() => copyText('cmd2', 'npm install && npm run lint')}
                  className="ml-2 p-1 rounded hover:bg-indigo-500/20 text-indigo-400"
                  title="Copy command"
                >
                  {copiedKey === 'cmd2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div
                className={`p-3 rounded-xl border font-mono flex items-center justify-between ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <span className="truncate">npm run dev</span>
                <button
                  type="button"
                  onClick={() => copyText('cmd3', 'npm run dev')}
                  className="ml-2 p-1 rounded hover:bg-indigo-500/20 text-indigo-400"
                  title="Copy command"
                >
                  {copiedKey === 'cmd3' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex items-center justify-center">
        <div
          className={`w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border shadow-2xl transition-all duration-500 ${
            darkMode
              ? 'bg-slate-900/70 border-slate-800/90 shadow-indigo-950/30'
              : 'bg-white/90 border-slate-200 shadow-slate-300/60'
          } backdrop-blur-2xl`}
        >
          {/* LEFT PANEL: Animated Interactive Visual Showcase */}
          <div
            onMouseMove={handleMouseMove}
            className="lg:col-span-5 relative overflow-hidden p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 text-white"
          >
            {/* Interactive Parallax Grid & Decorative Rings */}
            <div
              className="absolute inset-0 opacity-25 pointer-events-none transition-transform duration-300 ease-out"
              style={{
                transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                backgroundImage:
                  'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.22) 1px, transparent 0)',
                backgroundSize: '28px 28px'
              }}
            />

            {/* Top Security Status Pill */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-medium text-indigo-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3" />
                <span>OAuth 2.0 + OIDC Active</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">v2.4.0</span>
            </div>

            {/* Center Interactive Floating Architecture Card */}
            <div className="relative z-10 my-8">
              <div
                className="p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xl shadow-2xl transition-transform duration-300 ease-out"
                style={{
                  transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                    {SHOWCASE_SLIDES[activeSlide].badge}
                  </span>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold leading-snug mb-2">
                  {SHOWCASE_SLIDES[activeSlide].title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                  {SHOWCASE_SLIDES[activeSlide].description}
                </p>

                {/* Live Provider Strip inside Showcase */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400">{SHOWCASE_SLIDES[activeSlide].metricLabel}</p>
                    <p className="text-sm font-bold text-emerald-300">{SHOWCASE_SLIDES[activeSlide].metricValue}</p>
                  </div>
                  <div className="flex items-center -space-x-1.5">
                    {OAUTH_PROVIDERS.map((p) => {
                      const Icon = BrandIcons[p.id];
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleOAuthClick(p)}
                          title={`Quick test ${p.name} login`}
                          className="w-8 h-8 rounded-full bg-slate-900/90 border border-white/20 flex items-center justify-center hover:scale-110 hover:z-10 transition-transform"
                        >
                          <Icon />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Carousel Selector Dots */}
              <div className="flex items-center gap-2 mt-4 justify-center lg:justify-start">
                {SHOWCASE_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.badge}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`View slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeSlide === idx ? 'w-8 bg-indigo-400' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Feature Highlights */}
            <div className="relative z-10 grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center sm:text-left">
              <div>
                <p className="text-xs font-bold text-white">5 Providers</p>
                <p className="text-[11px] text-slate-400">SSO Ready</p>
              </div>
              <div>
                <p className="text-xs font-bold text-white">PKCE + JWT</p>
                <p className="text-[11px] text-slate-400">Encrypted</p>
              </div>
              <div>
                <p className="text-xs font-bold text-white">Instant UI</p>
                <p className="text-[11px] text-slate-400">Zero Reload</p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Interactive Login / Signup / Session View */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            {sessionUser ? (
              /* AUTHENTICATED DASHBOARD PREVIEW */
              <div className="max-w-lg mx-auto w-full space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authenticated Session Active</span>
                  </div>
                  <span className="text-xs text-slate-400">Signed in at {sessionUser.loginTime}</span>
                </div>

                <div
                  className={`p-6 rounded-2xl border ${
                    darkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {sessionUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold truncate">{sessionUser.name}</h2>
                      <p className="text-xs text-slate-400 truncate">{sessionUser.email}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 font-medium">
                          {sessionUser.provider}
                        </span>
                        <span className="text-[11px] text-slate-400">• {sessionUser.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Session Token Box */}
                  <div className="mt-5 pt-4 border-t border-slate-800/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">Bearer Session Token</span>
                      <button
                        type="button"
                        onClick={() => copyText('token', sessionUser.token)}
                        className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        {copiedKey === 'token' ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy JWT
                          </>
                        )}
                      </button>
                    </div>
                    <div
                      className={`px-3 py-2 rounded-xl font-mono text-xs truncate border ${
                        darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      {sessionUser.token}
                    </div>
                  </div>
                </div>

                {/* Connected Third-Party Providers Manager */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Link Additional Third-Party OAuth Providers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {OAUTH_PROVIDERS.map((prov) => {
                      const Icon = BrandIcons[prov.id];
                      const isLinked = connectedProviders.includes(prov.id);
                      return (
                        <div
                          key={prov.id}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                            darkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon />
                            <span className="font-medium">{prov.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (isLinked) {
                                setConnectedProviders((prev) => prev.filter((id) => id !== prov.id));
                                triggerToast('info', `${prov.name} Unlinked`, `Removed ${prov.name} from linked accounts.`);
                              } else {
                                setConnectedProviders((prev) => [...prev, prov.id]);
                                triggerToast('success', `${prov.name} Linked`, `Connected ${prov.name} OAuth identity.`);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                              isLinked
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                            }`}
                          >
                            {isLinked ? 'Connected' : 'Connect'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSessionUser(null);
                      triggerToast('info', 'Signed Out', 'You have safely logged out of your session.');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Session</span>
                  </button>
                </div>
              </div>
            ) : (
              /* LOGIN / SIGNUP INTERACTIVE FORM VIEW */
              <div className="max-w-md mx-auto w-full">
                {/* Top Header & Quick Demo Fill */}
                <div className="flex items-start justify-between gap-2 mb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {authMode === 'login' ? 'Welcome back' : 'Create your account'}
                    </h1>
                    <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {authMode === 'login'
                        ? 'Enter your credentials or choose a third-party provider.'
                        : 'Start building in seconds with email or social SSO.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 hover:bg-indigo-500/20 transition-all"
                    title="Auto-fill sample email and password"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Demo Fill</span>
                  </button>
                </div>

                {/* Animated Segmented Mode Switcher (Sign In / Sign Up) */}
                <div
                  className={`relative grid grid-cols-2 p-1 rounded-2xl border mb-6 ${
                    darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className={`relative z-10 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
                      authMode === 'login'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : darkMode
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signup')}
                    className={`relative z-10 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
                      authMode === 'signup'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : darkMode
                        ? 'text-slate-400 hover:text-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* All 5 Third-Party OAuth Login Options */}
                <div className="mb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                    Instant Third-Party Single Sign-On
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {OAUTH_PROVIDERS.map((provider, index) => {
                      const IconComponent = BrandIcons[provider.id];
                      const isLoading = oauthLoading === provider.id;
                      const isLastOdd = index === OAUTH_PROVIDERS.length - 1;
                      return (
                        <button
                          key={provider.id}
                          type="button"
                          disabled={Boolean(oauthLoading)}
                          onClick={() => handleOAuthClick(provider)}
                          className={`group relative flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all duration-200 active:scale-95 ${
                            isLastOdd ? 'col-span-2 sm:col-span-1' : ''
                          } ${
                            darkMode
                              ? 'bg-slate-950/70 border-slate-800 text-slate-200'
                              : 'bg-white border-slate-200 text-slate-700 shadow-sm'
                          } ${provider.accentHover}`}
                        >
                          {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                          ) : (
                            <span className="transition-transform duration-200 group-hover:scale-110">
                              <IconComponent />
                            </span>
                          )}
                          <span>{provider.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-6">
                  <div className={`w-full border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`} />
                  <span
                    className={`px-3 text-[11px] font-medium uppercase tracking-wider whitespace-nowrap ${
                      darkMode ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'
                    }`}
                  >
                    or continue with email
                  </span>
                  <div className={`w-full border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`} />
                </div>

                {/* Email & Password Form */}
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Full Name Field (Sign Up Only) */}
                  {authMode === 'signup' && (
                    <div className="transition-all duration-300">
                      <label htmlFor="fullName" className="block text-xs font-semibold mb-1.5">
                        Full Name
                      </label>
                      <div
                        className={`flex items-center rounded-xl border px-3.5 py-2.5 transition-all ${
                          errors.fullName
                            ? 'border-rose-500/80 bg-rose-500/5'
                            : focusedField === 'fullName'
                            ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                            : darkMode
                            ? 'bg-slate-950/70 border-slate-800'
                            : 'bg-slate-50/80 border-slate-200'
                        }`}
                      >
                        <User
                          className={`w-4 h-4 mr-2.5 shrink-0 ${
                            focusedField === 'fullName' ? 'text-indigo-400' : 'text-slate-400'
                          }`}
                        />
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onFocus={() => setFocusedField('fullName')}
                          onBlur={() => {
                            setFocusedField(null);
                            setTouched((prev) => ({ ...prev, fullName: true }));
                          }}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Alex Rivera"
                          className="w-full bg-transparent text-sm focus:outline-none"
                        />
                        {fullName.trim().length >= 2 && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                      </div>
                      {errors.fullName && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email Address Field */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold mb-1.5">
                      Email Address
                    </label>
                    <div
                      className={`flex items-center rounded-xl border px-3.5 py-2.5 transition-all ${
                        errors.email
                          ? 'border-rose-500/80 bg-rose-500/5'
                          : focusedField === 'email'
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                          : darkMode
                          ? 'bg-slate-950/70 border-slate-800'
                          : 'bg-slate-50/80 border-slate-200'
                      }`}
                    >
                      <Mail
                        className={`w-4 h-4 mr-2.5 shrink-0 ${
                          focusedField === 'email' ? 'text-indigo-400' : 'text-slate-400'
                        }`}
                      />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => {
                          setFocusedField(null);
                          setTouched((prev) => ({ ...prev, email: true }));
                        }}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full bg-transparent text-sm focus:outline-none"
                      />
                      {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                    </div>

                    {/* Smart Domain Typo Suggestion */}
                    {emailSuggestion && (
                      <div className="mt-1.5 flex items-center justify-between text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        <span>Did you mean {emailSuggestion}?</span>
                        <button
                          type="button"
                          onClick={() => setEmail(emailSuggestion)}
                          className="font-bold underline ml-2 hover:text-white"
                        >
                          Apply fix
                        </button>
                      </div>
                    )}

                    {errors.email && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="password" className="text-xs font-semibold">
                        Password
                      </label>
                      {authMode === 'login' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setResetEmail(email);
                            setResetSent(false);
                            setForgotPasswordOpen(true);
                          }}
                          className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                        >
                          Forgot password?
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGeneratePassword}
                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
                        >
                          <KeyRound className="w-3 h-3" />
                          <span>Suggest strong password</span>
                        </button>
                      )}
                    </div>

                    <div
                      className={`flex items-center rounded-xl border px-3.5 py-2.5 transition-all ${
                        errors.password
                          ? 'border-rose-500/80 bg-rose-500/5'
                          : focusedField === 'password'
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                          : darkMode
                          ? 'bg-slate-950/70 border-slate-800'
                          : 'bg-slate-50/80 border-slate-200'
                      }`}
                    >
                      <Lock
                        className={`w-4 h-4 mr-2.5 shrink-0 ${
                          focusedField === 'password' ? 'text-indigo-400' : 'text-slate-400'
                        }`}
                      />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => {
                          setFocusedField(null);
                          setTouched((prev) => ({ ...prev, password: true }));
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={authMode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                        className="w-full bg-transparent text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-slate-400 hover:text-slate-200 ml-2 focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                      </p>
                    )}

                    {/* Animated Password Strength Meter (Sign Up Mode) */}
                    {authMode === 'signup' && (
                      <div className="mt-2.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Password strength</span>
                          <span className={`font-semibold ${passwordStrengthMeta.text}`}>
                            {passwordStrengthMeta.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[1, 2, 3, 4].map((bar) => (
                            <div
                              key={bar}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                passwordScore >= bar
                                  ? passwordStrengthMeta.color
                                  : darkMode
                                  ? 'bg-slate-800'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                          {[
                            { key: 'length', label: '8+ characters' },
                            { key: 'uppercase', label: 'Uppercase letter' },
                            { key: 'number', label: 'At least 1 number' },
                            { key: 'special', label: 'Special symbol (!@#)' }
                          ].map((rule) => (
                            <div
                              key={rule.key}
                              className={`flex items-center gap-1.5 ${
                                passwordChecks[rule.key] ? 'text-emerald-400' : 'text-slate-400'
                              }`}
                            >
                              <Check className="w-3 h-3 shrink-0" />
                              <span>{rule.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field (Sign Up Only) */}
                  {authMode === 'signup' && (
                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs font-semibold mb-1.5">
                        Confirm Password
                      </label>
                      <div
                        className={`flex items-center rounded-xl border px-3.5 py-2.5 transition-all ${
                          errors.confirmPassword
                            ? 'border-rose-500/80 bg-rose-500/5'
                            : focusedField === 'confirmPassword'
                            ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                            : darkMode
                            ? 'bg-slate-950/70 border-slate-800'
                            : 'bg-slate-50/80 border-slate-200'
                        }`}
                      >
                        <Lock
                          className={`w-4 h-4 mr-2.5 shrink-0 ${
                            focusedField === 'confirmPassword' ? 'text-indigo-400' : 'text-slate-400'
                          }`}
                        />
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => {
                            setFocusedField(null);
                            setTouched((prev) => ({ ...prev, confirmPassword: true }));
                          }}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your password"
                          className="w-full bg-transparent text-sm focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="text-slate-400 hover:text-slate-200 ml-2 focus:outline-none"
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Remember Me / Accept Terms Row */}
                  <div className="flex items-center justify-between pt-1">
                    {authMode === 'login' ? (
                      <label className="inline-flex items-center gap-2 cursor-pointer text-xs select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                          Keep me signed in for 30 days
                        </span>
                      </label>
                    ) : (
                      <label className="inline-flex items-start gap-2 cursor-pointer text-xs select-none">
                        <input
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                          I agree to the{' '}
                          <button
                            type="button"
                            onClick={() =>
                              triggerToast(
                                'info',
                                'Terms & Privacy Policy',
                                'Zero-tracking privacy architecture enabled for all accounts.'
                              )
                            }
                            className="text-indigo-400 underline hover:text-indigo-300"
                          >
                            Terms of Service & Privacy Policy
                          </button>
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white font-semibold py-3 px-4 text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-300 active:scale-[0.99] disabled:opacity-60"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{authMode === 'login' ? 'Verifying Credentials...' : 'Creating Workspace...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{authMode === 'login' ? 'Sign In with Email' : 'Create Free Account'}</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Bottom Toggle Link */}
                <p className={`text-center text-xs mt-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {authMode === 'login' ? "Don't have an account yet?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch(authMode === 'login' ? 'signup' : 'login')}
                    className="font-semibold text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline ml-1"
                  >
                    {authMode === 'login' ? 'Sign up now' : 'Sign in instead'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* INTERACTIVE THIRD-PARTY OAUTH CONSENT / ACCOUNT PICKER MODAL */}
      {oauthModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div
            className={`max-w-md w-full rounded-3xl border p-6 shadow-2xl transition-all ${
              darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-800/70 flex items-center justify-center">
                  {BrandIcons[oauthModalProvider.id]()}
                </div>
                <div>
                  <h3 className="text-base font-bold">Sign in with {oauthModalProvider.name}</h3>
                  <p className="text-xs text-slate-400">{oauthModalProvider.tagline}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOauthModalProvider(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs font-medium text-slate-400">Choose an account to continue to NexusAuth:</p>
              {oauthModalProvider.demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleConfirmOAuth(oauthModalProvider, acc)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                    darkMode
                      ? 'bg-slate-950/70 border-slate-800 hover:border-indigo-500/60 hover:bg-indigo-500/5'
                      : 'bg-slate-50 border-slate-200 hover:border-indigo-500'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs shrink-0">
                      {acc.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{acc.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{acc.email}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}

              <div
                className={`p-3 rounded-xl border text-[11px] space-y-1.5 ${
                  darkMode ? 'bg-slate-950/50 border-slate-800/80 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-300">Requested OAuth Scopes: </span>
                    {oauthModalProvider.scopes.join(', ')}
                  </div>
                </div>
                <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-indigo-400">Module: {oauthModalProvider.filePath}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const found = ARCHITECTURE_FILES.find((f) => f.path === oauthModalProvider.filePath);
                      if (found) setSelectedArchFile(found);
                      setOauthModalProvider(null);
                      setShowArchModal(true);
                    }}
                    className="underline hover:text-white"
                  >
                    Inspect File
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOauthModalProvider(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE SPLIT AUTHORIZATION ARCHITECTURE EXPLORER MODAL */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div
            className={`max-w-5xl w-full rounded-3xl border overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${
              darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/70">
              <div className="flex items-center gap-2.5">
                <FolderTree className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold">
                    Modular Project Architecture • Split Authorization Implementations
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Each authorization provider is isolated in its own dedicated module under src/services/auth/
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowArchModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
              {/* Left File Tree Sidebar */}
              <div
                className={`md:col-span-4 border-r overflow-y-auto p-3 space-y-1 ${
                  darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  nexus-auth-portal/src/services/auth/
                </p>
                {ARCHITECTURE_FILES.map((file) => {
                  const active = selectedArchFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      type="button"
                      onClick={() => setSelectedArchFile(file)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                        active
                          ? 'bg-indigo-600 text-white shadow-md'
                          : darkMode
                          ? 'text-slate-300 hover:bg-slate-800/70'
                          : 'text-slate-700 hover:bg-slate-200/70'
                      }`}
                    >
                      <FileCode2 className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-mono font-semibold truncate">{file.path.split('/').pop()}</p>
                        <p className={`text-[10px] truncate ${active ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {file.label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Code Viewer */}
              <div className="md:col-span-8 flex flex-col overflow-hidden">
                <div
                  className={`flex items-center justify-between px-4 py-2.5 border-b text-xs ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <span className="font-mono text-indigo-400 font-semibold">{selectedArchFile.path}</span>
                  <button
                    type="button"
                    onClick={() => copyText('arch_code', selectedArchFile.code)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 font-medium"
                  >
                    {copiedKey === 'arch_code' ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Module
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy File Code
                      </>
                    )}
                  </button>
                </div>
                <pre
                  className={`flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed ${
                    darkMode ? 'bg-slate-950/90 text-slate-200' : 'bg-slate-900 text-slate-100'
                  }`}
                >
                  <code>{selectedArchFile.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD RECOVERY MODAL */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div
            className={`max-w-md w-full rounded-3xl border p-6 shadow-2xl ${
              darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold">Reset Your Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSent ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed">
                  We sent a one-time recovery link to <span className="font-bold">{resetEmail}</span>. Check your inbox
                  or spam folder within the next 15 minutes.
                </div>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter the email address associated with your account and we will send you a magic recovery link.
                </p>
                <div>
                  <label htmlFor="resetEmail" className="block text-xs font-semibold mb-1.5">
                    Account Email
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@company.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-indigo-500 ${
                      darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}