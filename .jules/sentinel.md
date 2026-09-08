## 2025-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** A dangerous React API `dangerouslySetInnerHTML` was used to embed the Google Tag Manager script in `app/layout.tsx`. While not an immediate XSS vulnerability because the inputs (like `gtmId`) came from environment variables, it's considered a security risk and an anti-pattern when embedding third-party scripts.
**Learning:** In Next.js applications, third-party inline scripts shouldn't be embedded via `dangerouslySetInnerHTML`. Instead, they should be managed via the `next/script` component.
**Prevention:** Always use `next/script` for injecting third-party or inline scripts and pass the inline script as static children or use the `src` prop.

## 2024-05-24 - [React `href` XSS via `javascript:` URIs]
**Vulnerability:** External, user-provided, or unverified URLs used directly in `href` attributes in React components (like `<a>` tags) are vulnerable to Cross-Site Scripting (XSS) if the URL uses the `javascript:` protocol. React does not automatically sanitize `href` attributes against `javascript:` URIs.
**Learning:** Even seemingly safe fields like `githubUrl` from the data store must be sanitized before being used in an `href` to ensure that malicious payloads cannot be executed if the data source is compromised or manipulated.
**Prevention:** Always parse and validate the protocol of external URLs before rendering them in `href` attributes. Allow only safe protocols like `http:` and `https:`. Create and use a utility function like `sanitizeUrl` to enforce this validation consistently.
