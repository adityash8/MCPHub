
## 2024-05-20 - [React href XSS Vulnerability Prevention]
**Vulnerability:** Untrusted external URLs (like `githubUrl` which might come from a database or user input eventually) can be placed directly in an `a` tag `href` attribute. If the URL uses a `javascript:` scheme, clicking the link can execute arbitrary JS, resulting in Cross-Site Scripting (XSS).
**Learning:** React escapes text children to prevent XSS but does *not* automatically sanitize the contents of `href` attributes against `javascript:` URIs.
**Prevention:** Implement a strict URL sanitization utility function that validates the protocol against a strict allowlist (e.g., only `http:` and `https:`). Ensure all dynamic `href` bindings using data that might be user-provided are wrapped in this sanitizer function.
