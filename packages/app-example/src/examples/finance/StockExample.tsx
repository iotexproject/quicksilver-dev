"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  TrendingDown,
  Search,
  ExternalLink,
  RefreshCw,
  Building2,
  Target
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { repo, URPC } from "@unilab/urpc"
import { useApiKey } from "@/hooks/use-auth"

interface StockData {
  ticker: string
  price: string
  open: string
  high: string
  low: string
  lastTradingTime: number
  previousClose: string
  marketCap: string
}

export function StockExample() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { apiKey } = useApiKey()

  const sourceId = "b59ca730-d697-4a9f-a375-29b22d2acd1a"
  const baseUrl = "https://quicksilver-alpha-preview.onrender.com"

  useEffect(() => {
    fetchStockData()
  }, [])

  const fetchStockData = async () => {
    try {
      setLoading(true)

      URPC.init({
        forceInit: true,
        baseUrl: `${baseUrl}/api/gateway/${sourceId}`,
        timeout: 60000,
        headers: {
          'x-api-key': apiKey!,
          'Content-Type': 'application/json'
        }
      });

      const data = await repo({
        entity: 'stockentity',
        source: 'yahoo',
      }).findMany({
        limit: 10,
        where: {
          "ticker": "AAPL"
        }
      });

      setStocks((data as StockData[]) || [])
    } catch (error) {
      console.error("Failed to fetch stock data:", error)
      toast({
        title: "Error",
        description: "Failed to load stock market data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredStocks = stocks?.filter(stock =>
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const formatPrice = (price: string) => {
    const num = parseFloat(price.replace('$', ''))
    if (isNaN(num)) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatNumber = (num: string | number) => {
    const value = typeof num === 'string' ? parseFloat(num) : num
    if (isNaN(value)) return '0'
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T'
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B'
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M'
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K'
    return value.toFixed(2)
  }

  const formatPercentage = (current: string, previous: string) => {
    const currentNum = parseFloat(current.replace('$', ''))
    const previousNum = parseFloat(previous)
    if (isNaN(currentNum) || isNaN(previousNum)) return <span className="text-gray-500">0.00%</span>

    const change = ((currentNum - previousNum) / previousNum) * 100
    return (
      <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(change).toFixed(2)}%
      </div>
    )
  }

  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleDateString()
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-100">
              📈 Trading Cards
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              Interactive stock market cards with real-time trading data
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-400 rounded-lg"
              />
            </div>
            <Button
              onClick={fetchStockData}
              disabled={loading}
              className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 rounded-lg"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {!loading && stocks.length > 0 && (
            <div className="flex items-center gap-6 text-sm">
              <div className="text-slate-300">
                <span className="text-slate-400">Market:</span> {stocks.length} stocks
              </div>
              <div className="text-green-300">
                <span className="text-green-400">Gainers:</span> {stocks.filter(stock => parseFloat(stock.price.replace('$', '')) > parseFloat(stock.previousClose)).length}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Avg Price:</span> {formatPrice((stocks.reduce((sum, stock) => sum + parseFloat(stock.price.replace('$', '')), 0) / stocks.length).toString())}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-orange-500/20 bg-slate-900/60 backdrop-blur-sm animate-pulse rounded-2xl shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-orange-900/50 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-orange-900/50 rounded" />
                      <div className="h-3 w-16 bg-orange-900/50 rounded" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 w-24 bg-orange-900/50 rounded" />
                    <div className="h-4 w-16 bg-orange-900/50 rounded" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-8 bg-orange-900/50 rounded" />
                      <div className="h-8 bg-orange-900/50 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStocks.map((stock) => (
              <Card key={stock.ticker} className="border-orange-500/20 bg-slate-900/60 backdrop-blur-sm hover:bg-orange-900/20 transition-all duration-200 rounded-2xl shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-200">{stock.ticker}</h3>
                        <p className="text-xs text-orange-300 font-mono">Stock Symbol</p>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs">NYSE</Badge>
                  </div>

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-orange-200 mb-1">
                      {formatPrice(stock.price)}
                    </div>
                    <div className="text-sm">
                      {formatPercentage(stock.price, stock.previousClose)}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-orange-200">Market Cap</span>
                      <span className="text-slate-200">${formatNumber(stock.marketCap)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-200">24h High</span>
                      <span className="text-slate-200">{formatPrice(stock.high)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-200">24h Low</span>
                      <span className="text-slate-200">{formatPrice(stock.low)}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-orange-500/30 text-orange-300 hover:bg-orange-600/20 rounded-lg"
                    onClick={() => window.open(`https://finance.yahoo.com/quote/${stock.ticker}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredStocks.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">No stocks found matching your search.</div>
            <Button onClick={() => setSearchTerm("")} className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200">
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}