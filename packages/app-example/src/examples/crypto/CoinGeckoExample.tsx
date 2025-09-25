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
  RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { repo, URPC } from "@unilab/urpc"
import { useApiKey } from "@/hooks/use-auth"
import Image from "next/image"

interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: string
  market_cap: string
  market_cap_rank: number | null
  fully_diluted_valuation: string
  total_volume: string
  high_24h: string
  low_24h: string
  price_change_24h: string
  price_change_percentage_24h: string
  market_cap_change_24h: string
  market_cap_change_percentage_24h: string
  circulating_supply: string
  total_supply: string
  max_supply: string
  ath: string
  ath_change_percentage: string
  ath_date: string
  atl: string
  atl_change_percentage: string
  atl_date: string
  last_updated: string
  sparkline_in_7d: string
  daily_volume_usd: string | null
  total_liquidity_usd: string | null
  price_change_percentage_24h_in_currency: string
  price_change_percentage_7d_in_currency: string
  price_change_percentage_30d_in_currency: string
}

export function CoinGeckoExample() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { apiKey } = useApiKey()

  const sourceId = "31385caa-1b00-4729-bac1-65a65753d634"
  const baseUrl = "https://quicksilver-alpha-preview.onrender.com"

  useEffect(() => {
    fetchCoinData()
  }, [])

  const fetchCoinData = async () => {
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
        entity: 'coingekoMarket',
        source: 'pg',
      }).findMany({
        limit: 10
      });

      setCoins((data as CoinData[]) || [])
    } catch (error) {
      console.error("Failed to fetch coin data:", error)
      toast({
        title: "Error",
        description: "Failed to load cryptocurrency data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredCoins = coins?.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(num)) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(num)
  }

  const formatNumber = (num: string | number) => {
    const value = typeof num === 'string' ? parseFloat(num) : num
    if (isNaN(value)) return '0'
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B'
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M'
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K'
    return value.toFixed(2)
  }

  const formatPercentage = (percentage: string | number) => {
    const num = typeof percentage === 'string' ? parseFloat(percentage) : percentage
    if (isNaN(num)) return <span className="text-gray-500">0.00%</span>
    return (
      <div className={`flex items-center gap-1 ${num >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {num >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(num).toFixed(2)}%
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-100">
              🚀 Crypto Exchange
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              Live cryptocurrency trading platform with real-time market data
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-b-2xl bg-slate-950">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search crypto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-400 rounded-lg"
              />
            </div>
            <Button
              onClick={fetchCoinData}
              disabled={loading}
              className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 rounded-lg"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {!loading && coins.length > 0 && (
            <div className="flex items-center gap-6 text-sm">
              <div className="text-slate-300">
                <span className="text-slate-400">Total:</span> {coins.length} coins
              </div>
              <div className="text-green-300">
                <span className="text-green-400">Gainers:</span> {coins.filter(coin => parseFloat(coin.price_change_percentage_24h) > 0).length}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Avg Price:</span> {formatPrice(coins.reduce((sum, coin) => sum + parseFloat(coin.current_price), 0) / coins.length)}
              </div>
            </div>
          )}
        </div>

        <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-sm rounded-xl">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-2 border-slate-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-400">Loading market data...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Asset</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">24h Change</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">24h High</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">24h Low</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">Market Cap</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-blue-200 uppercase tracking-wider">Volume</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-blue-200 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-500/10">
                    {filteredCoins.map((coin) => (
                      <tr key={coin.id} className="hover:bg-blue-900/20 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8">
                              <Image
                                src={coin.image}
                                alt={coin.name}
                                fill
                                className="rounded-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/api/placeholder/32/32"
                                }}
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-200">{coin.name}</div>
                              <div className="text-xs text-blue-300 uppercase">{coin.symbol}</div>
                            </div>
                            {coin.market_cap_rank && (
                              <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs">#{coin.market_cap_rank}</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="text-sm font-medium text-cyan-300">{formatPrice(coin.current_price)}</div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {formatPercentage(coin.price_change_percentage_24h)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="text-sm text-blue-200">{formatPrice(coin.high_24h)}</div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="text-sm text-blue-200">{formatPrice(coin.low_24h)}</div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="text-sm text-blue-200">${formatNumber(coin.market_cap)}</div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="text-sm text-blue-200">${formatNumber(coin.total_volume)}</div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500/30 text-blue-300 hover:bg-blue-600/20 rounded-lg"
                            onClick={() => window.open(`https://www.coingecko.com/en/coins/${coin.id}`, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredCoins.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-slate-400 mb-4">No cryptocurrencies found matching your search.</p>
                    <Button
                      onClick={() => setSearchTerm("")}
                      className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 rounded-lg"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}