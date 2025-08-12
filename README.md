# SOFT-309-M6-2025

## Automated Test Cases

- **Login Tests**: Valid login, invalid login, performance glitch user login.
- **Inventory Tests**: Validate inventory title, add/remove items, check item names, checkout overview, complete/cancel order, validate total price.
- **API Tests**: Basic API endpoint validation (see `tests/API/basicAPI.spec.ts`).
- **Sauce Labs UI Tests**: Button and UI interaction tests.

## Justification of Applied Strategies

- **Page Object Model (POM)**: Used for maintainability and scalability. Each page (e.g., Login, Inventory) has its own class encapsulating selectors and actions.
**Environment Variables**: Credentials and test data are managed via `.creds.env` for local development. In CI, secrets are securely provided via GitHub Actions repository secrets, so `.creds.env` is not required or uploaded.
  - `.creds.env` - Environment variables for test credentials (local only, not uploaded to repo; in CI, use GitHub Actions secrets).
- `playwright.config.js` - Playwright configuration.
- `.creds.env` - Environment variables for test credentials.
