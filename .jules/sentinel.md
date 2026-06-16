## 2025-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** A dangerous React API `dangerouslySetInnerHTML` was used to embed the Google Tag Manager script in `app/layout.tsx`. While not an immediate XSS vulnerability because the inputs (like `gtmId`) came from environment variables, it's considered a security risk and an anti-pattern when embedding third-party scripts.
**Learning:** In Next.js applications, third-party inline scripts shouldn't be embedded via `dangerouslySetInnerHTML`. Instead, they should be managed via the `next/script` component.
**Prevention:** Always use `next/script` for injecting third-party or inline scripts and pass the inline script as static children or use the `src` prop.

## 2024-05-19 - [XSS in React via unvalidated href attributes]
**Vulnerability:** External, untrusted URLs rendered in React `href` attributes can execute arbitrary code if they use `javascript:` URIs (e.g., `href="javascript:alert(1)"`).
**Learning:** React escapes text content, but it does NOT validate or sanitize `href` attribute values by default. Unvalidated external URLs pose a Cross-Site Scripting (XSS) risk.
**Prevention:** Always sanitize external URLs before rendering them in `href` attributes by explicitly validating the protocol (e.g., allowing only `http:` and `https:`) and using a safe fallback for invalid URLs.
