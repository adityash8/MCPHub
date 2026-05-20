## 2024-05-20 - [XSS via javascript: URIs in React hrefs]
**Vulnerability:** External URLs passed to React `href` attributes (like `mcp.githubUrl`) could be exploited if they contain `javascript:` URIs, leading to Cross-Site Scripting (XSS).
**Learning:** React does not automatically sanitize `href` attributes for `javascript:` URIs. If an external data source or database is compromised or manipulated, it can inject malicious scripts through these links.
**Prevention:** Always use a utility function (like `sanitizeUrl`) to explicitly validate that external URLs use a safe protocol (e.g., `http:` or `https:`) before rendering them in `href` attributes.
