# Contributing to inversify-utils-kit

## Setup

```bash
npm install
```

## Scripts

| Command | Description |
|---|---|
| `npm run build` | Compile TypeScript and resolve aliases |
| `npm run test` | Run test suite (Jasmine) |
| `npm run coverage` | Run tests with coverage report |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run prettier` | Check formatting |
| `npm run prettier:write` | Auto-format code |
| `npm run up` | Bump patch version |
| `npm run upload` | Build and publish to npm |

## Publishing

1. Set your npm token:

```bash
export NPM_AUTH_TOKEN=your-token-here
```

2. Bump version and publish:

```bash
npm run up
npm run upload
```

## Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint. Use gitmoji for visual context:

### Major (Breaking)

| Emoji | Code | Description |
|---|---|---|
| 💥 | `:boom:` | Breaking changes |

### Minor (Feature)

| Emoji | Code | Description |
|---|---|---|
| ✨ | `:sparkles:` | New features |

### Patch (Fix)

| Emoji | Code | Description |
|---|---|---|
| ⚡️ | `:zap:` | Performance improvements |
| 🐛 | `:bug:` | Bug fixes |
| 🚑️ | `:ambulance:` | Critical hotfix |
| 🔒️ | `:lock:` | Security fixes |
| ⬆️ | `:arrow_up:` | Dependency upgrades |
| ⬇️ | `:arrow_down:` | Dependency downgrades |
| 📌 | `:pushpin:` | Pin dependencies |
| ➕ | `:heavy_plus_sign:` | Add dependency |
| ➖ | `:heavy_minus_sign:` | Remove dependency |
| 🔧 | `:wrench:` | Configuration changes |
| ✏️ | `:pencil2:` | Typo fixes |
| 🏷️ | `:label:` | Type updates |
| ♻️ | `:recycle:` | Refactoring |
