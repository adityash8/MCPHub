## 2024-05-19 - [XSS in React via unvalidated href attributes]
**Vulnerability:** External, untrusted URLs rendered in React `href` attributes can execute arbitrary code if they use `javascript:` URIs (e.g., `href="javascript:alert(1)"`).
**Learning:** React escapes text content, but it does NOT validate or sanitize `href` attribute values by default. Unvalidated external URLs pose a Cross-Site Scripting (XSS) risk.
**Prevention:** Always sanitize external URLs before rendering them in `href` attributes by explicitly validating the protocol (e.g., allowing only `http:` and `https:`) and using a safe fallback for invalid URLs.
