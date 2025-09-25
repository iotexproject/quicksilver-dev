import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'

// Import example components
import { CoinGeckoExample } from '../examples/crypto/CoinGeckoExample'
import { StockExample } from '../examples/finance/StockExample'
import { WeatherExample } from '../examples/weather/WeatherExample'
import { DefiNewsExample } from '../examples/data/DefiNewsExample'
import { PebbleExample } from '../examples/data/PebbleExample'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">
            Quicksilver App Examples
          </h1>
          <Badge>Interactive Demo</Badge>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚀 Welcome to Quicksilver
                <Badge>Live Examples</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                这是一个Quicksilver示例组件库，包含了各种数据网关集成示例。点击下面的按钮查看实际运行的组件。
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate('/crypto')}>💰 Crypto Examples</Button>
                <Button variant="secondary" onClick={() => navigate('/finance')}>📈 Finance Examples</Button>
                <Button variant="outline" onClick={() => navigate('/weather')}>🌤️ Weather Examples</Button>
                <Button variant="outline" onClick={() => navigate('/data')}>📊 Data Examples</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/crypto')}>
              <CardHeader>
                <CardTitle>💰 Crypto Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• CoinGecko Market Data</li>
                  <li>• Real-time Price Tracking</li>
                  <li>• Portfolio Management</li>
                </ul>
                <Button size="sm" className="mt-3">View Demo →</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/finance')}>
              <CardHeader>
                <CardTitle>📈 Finance Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Stock Market Data</li>
                  <li>• Trading Indicators</li>
                  <li>• Economic Analytics</li>
                </ul>
                <Button size="sm" className="mt-3">View Demo →</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/weather')}>
              <CardHeader>
                <CardTitle>🌤️ Weather Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Real-time Weather</li>
                  <li>• Weather Forecasts</li>
                  <li>• Climate Analytics</li>
                </ul>
                <Button size="sm" className="mt-3">View Demo →</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/data')}>
              <CardHeader>
                <CardTitle>📊 Data Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• DeFi News Feed</li>
                  <li>• IoT Data Streams</li>
                  <li>• Analytics Dashboard</li>
                </ul>
                <Button size="sm" className="mt-3">View Demo →</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExampleLayout({ children, title }: { children: React.ReactNode; title: string }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              ← Back to Home
            </Button>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <Badge variant="outline">Live Demo</Badge>
        </div>
      </nav>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/crypto"
          element={
            <ExampleLayout title="💰 Crypto Examples">
              <CoinGeckoExample />
            </ExampleLayout>
          }
        />
        <Route
          path="/finance"
          element={
            <ExampleLayout title="📈 Finance Examples">
              <StockExample />
            </ExampleLayout>
          }
        />
        <Route
          path="/weather"
          element={
            <ExampleLayout title="🌤️ Weather Examples">
              <WeatherExample />
            </ExampleLayout>
          }
        />
        <Route
          path="/data"
          element={
            <ExampleLayout title="📊 Data Examples">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">DeFi News</h2>
                  <DefiNewsExample />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">IoT Pebble Data</h2>
                  <PebbleExample />
                </div>
              </div>
            </ExampleLayout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App