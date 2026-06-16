## 2025-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** A dangerous React API `dangerouslySetInnerHTML` was used to embed the Google Tag Manager script in `app/layout.tsx`. While not an immediate XSS vulnerability because the inputs (like `gtmId`) came from environment variables, it's considered a security risk and an anti-pattern when embedding third-party scripts.
**Learning:** In Next.js applications, third-party inline scripts shouldn't be embedded via `dangerouslySetInnerHTML`. Instead, they should be managed via the `next/script` component.
**Prevention:** Always use `next/script` for injecting third-party or inline scripts and pass the inline script as static children or use the `src` prop.

## 2024-05-15 - React Anchor Tag XSS Protection Pattern
**Vulnerability:** External URLs passed directly to React anchor tag `href` attributes (like `githubUrl`) without validation are vulnerable to `javascript:` URI Cross-Site Scripting (XSS). An attacker could inject a malicious payload if the URL source becomes untrusted.
**Learning:** React escapes text children by default, but DOES NOT protect `href` attributes against `javascript:` URIs. Any URL from an external source or configuration (even ostensibly trusted ones like GitHub URLs in a local DB) must be treated as potentially unsafe to maintain defense-in-depth.
**Prevention:** Implement and enforce a standard `sanitizeUrl` utility that parses the input and explicitly allows only safe protocols (e.g., `http:`, `https:`), falling back to `#` for invalid or missing inputs. Always wrap untrusted URLs in this function before rendering them in anchor tags.
