# Melony Monorepo

A Turbopack-powered monorepo for the Melony React library - building AI-powered conversational interfaces with agents, flows, and tools.

## 🏗️ Monorepo Structure

```
melony/
├── packages/
│   └── melony-core/          # Core React library
├── apps/
│   └── example/              # Interactive demo app
├── docs/                     # Documentation site
├── turbo.json               # Turbopack configuration
└── pnpm-workspace.yaml      # Workspace configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- pnpm >= 8

### Installation
```bash
pnpm install
```

### Development
```bash
# Start all development servers
pnpm dev

# Start specific app
pnpm --filter melony-example dev
pnpm --filter melony-docs dev
```

### Building
```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @melony/core build
```

## 📦 Packages

### `@melony/core`
The main React library for progressive UI rendering from AI responses.

**Features:**
- ⚡ Zero latency progressive rendering
- 🎯 Smart partial JSON parsing
- 🛡️ Full Zod schema integration
- 📝 Built-in markdown support

**Usage:**
```tsx
import { MelonyCard } from "@melony/core";
import { zodSchemaToPrompt } from "@melony/core/zod";

<MelonyCard
  text={streamingAIResponse}
  components={{
    "weather-card": WeatherCard,
  }}
/>
```

### `melony-example`
Interactive Next.js demo application showcasing Melony capabilities.

**Features:**
- Live component rendering
- Multiple component examples
- Real-time JSON parsing demo
- System prompt generation

### `melony-docs`
Documentation site built with Next.js.

**Features:**
- Complete API documentation
- Interactive examples
- Live component demos
- Usage guides

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm build` | Build all packages |
| `pnpm clean` | Clean all build artifacts |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm lint` | Run linting |

## 🔧 Workspace Commands

| Command | Description |
|---------|-------------|
| `pnpm --filter @melony/core <cmd>` | Run command in core package |
| `pnpm --filter melony-example <cmd>` | Run command in example app |
| `pnpm --filter melony-docs <cmd>` | Run command in docs site |

## 📚 Learn More

- [Core Library Documentation](./packages/melony-core/README.md)
- [Interactive Demo](./apps/example)
- [Documentation Site](./docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [GitHub](https://github.com/ddaras/melony)
- [NPM](https://www.npmjs.com/package/melony)
- [Report Issues](https://github.com/ddaras/melony/issues)