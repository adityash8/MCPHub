## 2024-05-16 - Prevent XSS in External Links
**Vulnerability:** External URLs (like `mcp.githubUrl`) were injected directly into React `href` attributes in `components/MCPDetailModal.tsx` without sanitization. If a URL string contained a payload like `javascript:alert(1)`, it could lead to Cross-Site Scripting (XSS).
**Learning:** React does not automatically sanitize `href` attributes against `javascript:` URIs. When dealing with dynamically populated external links, explicitly validating the protocol is essential to prevent malicious execution.
**Prevention:** Implement and enforce a `getSafeUrl` utility function that ensures URLs begin with safe protocols (`http:`, `https:`, or valid relative paths) before setting them in `href` properties.
