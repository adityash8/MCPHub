## 2025-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** A dangerous React API `dangerouslySetInnerHTML` was used to embed the Google Tag Manager script in `app/layout.tsx`. While not an immediate XSS vulnerability because the inputs (like `gtmId`) came from environment variables, it's considered a security risk and an anti-pattern when embedding third-party scripts.
**Learning:** In Next.js applications, third-party inline scripts shouldn't be embedded via `dangerouslySetInnerHTML`. Instead, they should be managed via the `next/script` component.
**Prevention:** Always use `next/script` for injecting third-party or inline scripts and pass the inline script as static children or use the `src` prop.

## 2024-05-18 - Sanitize external URLs to prevent XSS
**Vulnerability:** External URLs in `href` attributes (like `githubUrl`) can be injected with `javascript:` payloads to execute arbitrary code (XSS).
**Learning:** React escapes content but does NOT automatically validate schemes in `href` properties. `javascript:` URIs are treated as valid strings but result in code execution when clicked.
**Prevention:** Always explicitly validate the protocol of external URLs (e.g., using `URL` API and allowing only `http:` and `https:`) before passing them to `href` attributes.
