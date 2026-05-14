## 2024-05-18 - Sanitize external URLs to prevent XSS
**Vulnerability:** External URLs in `href` attributes (like `githubUrl`) can be injected with `javascript:` payloads to execute arbitrary code (XSS).
**Learning:** React escapes content but does NOT automatically validate schemes in `href` properties. `javascript:` URIs are treated as valid strings but result in code execution when clicked.
**Prevention:** Always explicitly validate the protocol of external URLs (e.g., using `URL` API and allowing only `http:` and `https:`) before passing them to `href` attributes.
