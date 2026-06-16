## 2025-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** A dangerous React API `dangerouslySetInnerHTML` was used to embed the Google Tag Manager script in `app/layout.tsx`. While not an immediate XSS vulnerability because the inputs (like `gtmId`) came from environment variables, it's considered a security risk and an anti-pattern when embedding third-party scripts.
**Learning:** In Next.js applications, third-party inline scripts shouldn't be embedded via `dangerouslySetInnerHTML`. Instead, they should be managed via the `next/script` component.
**Prevention:** Always use `next/script` for injecting third-party or inline scripts and pass the inline script as static children or use the `src` prop.

## 2024-05-20 - [XSS via javascript: URIs in React hrefs]
**Vulnerability:** External URLs passed to React `href` attributes (like `mcp.githubUrl`) could be exploited if they contain `javascript:` URIs, leading to Cross-Site Scripting (XSS).
**Learning:** React does not automatically sanitize `href` attributes for `javascript:` URIs. If an external data source or database is compromised or manipulated, it can inject malicious scripts through these links.
**Prevention:** Always use a utility function (like `sanitizeUrl`) to explicitly validate that external URLs use a safe protocol (e.g., `http:` or `https:`) before rendering them in `href` attributes.
