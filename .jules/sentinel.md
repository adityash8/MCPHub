## 2024-05-11 - [Replaced dangerouslySetInnerHTML with next/script]
**Vulnerability:** Found `dangerouslySetInnerHTML` injecting raw strings without escaping for variables.
**Learning:** In Next.js, use the `<Script>` component for injecting scripts instead of raw `<script dangerouslySetInnerHTML>`. Using `next/script` prevents XSS if env vars are malicious and allows automatic CSP nonce attachment.
**Prevention:** Avoid `dangerouslySetInnerHTML` for third-party scripts. Use `next/script` component with its `src` prop or static children instead.
