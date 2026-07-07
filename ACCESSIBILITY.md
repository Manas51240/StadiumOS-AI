# WCAG 2.2 AA Accessibility Specifications

StadiumOS AI is designed and audited to comply with the Web Content Accessibility Guidelines (WCAG) 2.2 AA standards.

---

## ♿ Standard Compliance Details

### 1. Keyboard Navigability (Success Criterion 2.1.1)
- **Interactive SVG Map**: Maps coordinate nodes to keyboard tab-stops (`tabIndex={0}`). Activates selected route endpoints on `Space` or `Enter` keys.
- **Header Actions**: Toggle controls are fully navigable via standard keyboard focus rings.

### 2. Skip Navigation (Success Criterion 2.4.1)
- Exposes a skip-link utility at the top of the body:
  `[Skip to Main Content](file:///e:/Challenge%204/frontend/src/app/layout.tsx#L14)`
  Bypasses navigation headers, placing focus directly on the main content landmark.

### 3. Screen Reader Live Announcements (Success Criterion 4.1.3)
- An invisible live announcement region (`aria-live="polite"`) reads calculated routes, security status changes, and AI messages aloud dynamically.

### 4. Reduced Motion Settings (Success Criterion 2.3.3)
- Global CSS configures `@media (prefers-reduced-motion: reduce)` to disable visual scale hover shifts, translations, and skeletal animations.
