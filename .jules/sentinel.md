## 2025-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** A dangerous React API `dangerouslySetInnerHTML` was used to embed the Google Tag Manager script in `app/layout.tsx`. While not an immediate XSS vulnerability because the inputs (like `gtmId`) came from environment variables, it's considered a security risk and an anti-pattern when embedding third-party scripts.
**Learning:** In Next.js applications, third-party inline scripts shouldn't be embedded via `dangerouslySetInnerHTML`. Instead, they should be managed via the `next/script` component.
**Prevention:** Always use `next/script` for injecting third-party or inline scripts and pass the inline script as static children or use the `src` prop.

## 2024-05-18 - [javascript: URI XSS in React href Attributes]
**Vulnerability:** Untrusted, external URLs (e.g., `mcp.githubUrl`) were passed directly into `href` attributes in React components without protocol validation.
**Learning:** Using variables directly in React `href` properties allows `javascript:` URIs to execute arbitrary scripts when clicked by users, completely bypassing basic XSS protections (like HTML encoding) that React normally provides.
**Prevention:** Always parse and explicitly allowlist secure protocols (`http:`, `https:`) before rendering untrusted URLs into `href` attributes using a dedicated sanitization function.
