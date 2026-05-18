## 2024-05-18 - [javascript: URI XSS in React href Attributes]
**Vulnerability:** Untrusted, external URLs (e.g., `mcp.githubUrl`) were passed directly into `href` attributes in React components without protocol validation.
**Learning:** Using variables directly in React `href` properties allows `javascript:` URIs to execute arbitrary scripts when clicked by users, completely bypassing basic XSS protections (like HTML encoding) that React normally provides.
**Prevention:** Always parse and explicitly allowlist secure protocols (`http:`, `https:`) before rendering untrusted URLs into `href` attributes using a dedicated sanitization function.
