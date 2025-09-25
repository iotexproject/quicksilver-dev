# Quicksilver App Examples

A collection of open-source React components showcasing data gateway integrations with various APIs and services using the Quicksilver platform.

## Overview

This package provides ready-to-use React components that demonstrate how to integrate with different data sources through the Quicksilver data gateway. Each example is optimized for production use and includes modern UI components with Tailwind CSS styling.

## Available Examples

### 🚀 Crypto Examples
- **CoinGeckoExample**: Live cryptocurrency trading platform with real-time market data

### 📈 Finance Examples
- **StockExample**: Interactive stock market cards with real-time trading data

### 🌤️ Weather Examples
- **WeatherExample**: Global weather monitoring with interactive city grid layout

### 📊 Data Examples
- **DefiNewsExample**: Comprehensive DeFi protocols with social sentiment and crypto news monitoring
- **PebbleExample**: Advanced IoT device monitoring and management platform

## Installation

```bash
npm install @quicksilver/app-examples
```

## Usage

Import the components you need:

```tsx
import { CoinGeckoExample, StockExample, WeatherExample } from '@quicksilver/app-examples'

// Components are ready to use with pre-configured data sources
function App() {
  return (
    <div>
      <CoinGeckoExample />
      <StockExample />
      <WeatherExample />
    </div>
  )
}
```

## Requirements

- React 18+
- Next.js 14+
- @unilab/urpc package
- Tailwind CSS configured
- Lucide React icons

## Features

- **Production Ready**: Optimized components with proper error handling and loading states
- **Type Safe**: Full TypeScript support with proper type definitions
- **Modern UI**: Beautiful interfaces built with Tailwind CSS and Lucide icons
- **Real-time Data**: Live data updates through URPC protocol connecting to public Quicksilver API
- **Responsive Design**: Mobile-first responsive layouts
- **Zero Configuration**: Pre-configured with live data sources - just import and use
- **Open Source**: MIT licensed for commercial and personal use

## Component Features

Each example component includes:
- ✅ Real-time data fetching via URPC
- ✅ Loading states and error handling
- ✅ Search and filtering capabilities
- ✅ Responsive grid layouts
- ✅ Interactive data visualization
- ✅ External link integrations
- ❌ No AI chat widgets (removed for open-source distribution)
- ❌ No code examples (streamlined for production use)

## Development

```bash
# Clone the repository
git clone https://github.com/quicksilver/quicksilver-dev.git
cd quicksilver-dev/packages/app-example

# Install dependencies
npm install

# Build the package
npm run build

# Watch for changes
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Quicksilver Team