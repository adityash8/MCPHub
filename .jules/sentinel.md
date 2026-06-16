## 2025-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** A dangerous React API `dangerouslySetInnerHTML` was used to embed the Google Tag Manager script in `app/layout.tsx`. While not an immediate XSS vulnerability because the inputs (like `gtmId`) came from environment variables, it's considered a security risk and an anti-pattern when embedding third-party scripts.
**Learning:** In Next.js applications, third-party inline scripts shouldn't be embedded via `dangerouslySetInnerHTML`. Instead, they should be managed via the `next/script` component.
**Prevention:** Always use `next/script` for injecting third-party or inline scripts and pass the inline script as static children or use the `src` prop.

## 2024-05-16 - Prevent XSS in External Links
**Vulnerability:** External URLs (like `mcp.githubUrl`) were injected directly into React `href` attributes in `components/MCPDetailModal.tsx` without sanitization. If a URL string contained a payload like `javascript:alert(1)`, it could lead to Cross-Site Scripting (XSS).
**Learning:** React does not automatically sanitize `href` attributes against `javascript:` URIs. When dealing with dynamically populated external links, explicitly validating the protocol is essential to prevent malicious execution.
**Prevention:** Implement and enforce a `getSafeUrl` utility function that ensures URLs begin with safe protocols (`http:`, `https:`, or valid relative paths) before setting them in `href` properties.
