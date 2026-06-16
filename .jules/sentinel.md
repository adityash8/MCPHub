## 2025-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** A dangerous React API `dangerouslySetInnerHTML` was used to embed the Google Tag Manager script in `app/layout.tsx`. While not an immediate XSS vulnerability because the inputs (like `gtmId`) came from environment variables, it's considered a security risk and an anti-pattern when embedding third-party scripts.
**Learning:** In Next.js applications, third-party inline scripts shouldn't be embedded via `dangerouslySetInnerHTML`. Instead, they should be managed via the `next/script` component.
**Prevention:** Always use `next/script` for injecting third-party or inline scripts and pass the inline script as static children or use the `src` prop.

## 2024-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** Found `dangerouslySetInnerHTML` injecting raw strings without escaping for variables.
**Learning:** In Next.js, use the `<Script>` component for injecting scripts instead of raw `<script dangerouslySetInnerHTML>`. Using `next/script` prevents XSS if env vars are malicious and allows automatic CSP nonce attachment.
**Prevention:** Avoid `dangerouslySetInnerHTML` for third-party scripts. Use `next/script` component with its `src` prop or static children instead.
