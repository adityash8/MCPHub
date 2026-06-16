## 2025-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** A dangerous React API `dangerouslySetInnerHTML` was used to embed the Google Tag Manager script in `app/layout.tsx`. While not an immediate XSS vulnerability because the inputs (like `gtmId`) came from environment variables, it's considered a security risk and an anti-pattern when embedding third-party scripts.
**Learning:** In Next.js applications, third-party inline scripts shouldn't be embedded via `dangerouslySetInnerHTML`. Instead, they should be managed via the `next/script` component.
**Prevention:** Always use `next/script` for injecting third-party or inline scripts and pass the inline script as static children or use the `src` prop.

## 2024-05-20 - [React href XSS Vulnerability Prevention]
**Vulnerability:** Untrusted external URLs (like `githubUrl` which might come from a database or user input eventually) can be placed directly in an `a` tag `href` attribute. If the URL uses a `javascript:` scheme, clicking the link can execute arbitrary JS, resulting in Cross-Site Scripting (XSS).
**Learning:** React escapes text children to prevent XSS but does *not* automatically sanitize the contents of `href` attributes against `javascript:` URIs.
**Prevention:** Implement a strict URL sanitization utility function that validates the protocol against a strict allowlist (e.g., only `http:` and `https:`). Ensure all dynamic `href` bindings using data that might be user-provided are wrapped in this sanitizer function.
