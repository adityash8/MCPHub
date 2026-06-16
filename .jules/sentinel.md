## 2025-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** A dangerous React API `dangerouslySetInnerHTML` was used to embed the Google Tag Manager script in `app/layout.tsx`. While not an immediate XSS vulnerability because the inputs (like `gtmId`) came from environment variables, it's considered a security risk and an anti-pattern when embedding third-party scripts.
**Learning:** In Next.js applications, third-party inline scripts shouldn't be embedded via `dangerouslySetInnerHTML`. Instead, they should be managed via the `next/script` component.
**Prevention:** Always use `next/script` for injecting third-party or inline scripts and pass the inline script as static children or use the `src` prop.

## 2024-05-13 - Prevent javascript: URI XSS in External Links
**Vulnerability:** A Cross-Site Scripting (XSS) vulnerability was found in `components/MCPDetailModal.tsx` where an external, untrusted URL (`mcp.githubUrl`) was placed directly into the `href` attribute of an `<a>` tag without validation. This allowed for the execution of arbitrary JavaScript if a user supplied a URL starting with `javascript:` (e.g., `javascript:alert(1)`).
**Learning:** React escapes text content to prevent XSS, but it does NOT validate the structure or protocol of URLs placed into attributes like `href`. Untrusted URLs coming from databases or APIs must always be sanitized to ensure they use a safe protocol.
**Prevention:** Implement a URL sanitization utility function that parses the URL and explicitly checks that its protocol is either `http:` or `https:`, returning a safe fallback (like `#`) otherwise. Always pass external links through this sanitizer before rendering them in an `href` attribute.
