# NexusAuth — Modular React + Vite Authentication Architecture

A clean, modular authentication portal built with **React 18**, **Vite**, **ESLint**, and **Tailwind CSS** where each authorization provider and stylesheet is isolated in its own module.

## Project Architecture

```text
nexus-auth-portal/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js             # Tailwind CSS theme, content paths & keyframes
├── postcss.config.js              # PostCSS pipeline (tailwindcss + autoprefixer)
├── eslint.config.js
└── src/
    ├── main.jsx
    ├── index.css                  # Tailwind directives & base layer reset
    ├── App.jsx
    ├── styles/
    │   ├── animations.css         # Keyframe animations & micro-interaction classes
    │   └── auth.css               # Glassmorphism, autofill fixes & custom scrollbars
    ├── components/
    │   └── icons/
    │       └── BrandIcons.jsx
    └── services/
        └── auth/
            ├── index.js               # Unified registry & barrel exports
            ├── pkceUtils.js           # Shared OAuth 2.0 PKCE & CSRF state helpers
            ├── emailPasswordAuth.js   # Email & Password (Argon2id + entropy + recovery)
            ├── googleAuth.js          # Google OAuth 2.0 / OIDC implementation
            ├── microsoftAuth.js       # Microsoft Entra ID / Azure AD v2.0 implementation
            ├── linkedinAuth.js        # LinkedIn OAuth 2.0 implementation
            ├── githubAuth.js          # GitHub OAuth 2.0 Web Flow implementation
            └── facebookAuth.js        # Facebook Meta Graph API v19.0 implementation
```

## Quick Start

```bash
npm install
npm run dev
```
