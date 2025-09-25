"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  RefreshCw,
  Twitter,
  Newspaper,
  Coins
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { repo, URPC } from "@unilab/urpc"
import { useApiKey } from "@/hooks/use-auth"

interface DefillamaData {
  name: string
  slug: string
  tvl: {
    default: {
      tvl: number
      tvlPrevDay: number
      tvlPrevWeek: number
      tvlPrevMonth: number
    }
    staking: {
      tvl: number
      tvlPrevDay: number
      tvlPrevWeek: number
      tvlPrevMonth: number
    }
  }
  fees: {
    pf: number
    total1y: number
    total7d: number
    total24h: number
    total30d: number
    totalAllTime: number
    monthlyAverage1y: number
  }
  category: string
  twitter: string
  site: string
  description: string
  twitterData?: TwitterData[]
}

interface TwitterData {
  id: string
  fullText: string
  images: string[]
  createdAt: string
  user: {
    avatar: string
    restId: string
    name: string
    screenName: string
    description: string
  }
  likes: number
  retweets: number
  comments: number
  views: number
  requestedUser: string
  fetchedAt: string
}

interface NewsData {
  title: string
  description: string
  url: string
  publishedAt: string
  source: {
    name: string
  }
  author: string
}

export function DefiNewsExample() {
  const [defillamaData, setDefillamaData] = useState<DefillamaData[]>([])
  const [newsData, setNewsData] = useState<NewsData[]>([])
  const [loading, setLoading] = useState(true)
  const [newsLoading, setNewsLoading] = useState(false)
  const { toast } = useToast()
  const { apiKey } = useApiKey()

  const defillamaSourceId = "bd0ead62-1bab-4f67-b199-fe344356c79b"
  const twitterSourceId = "e2e0b5b6-770c-4d8d-9f40-eec1e3acbef3"
  const newsSourceId = "bfd2c375-5d8a-40f7-a08a-6a865cbbf1df"
  const baseUrl = "https://quicksilver-alpha-preview.onrender.com"

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchNewsData = async (protocols: DefillamaData[] = []) => {
    try {
      setNewsLoading(true)

      URPC.init({
        forceInit: true,
        baseUrl: `${baseUrl}/api/gateway/${newsSourceId}`,
        timeout: 60000,
        headers: {
          'x-api-key': apiKey!,
          'Content-Type': 'application/json'
        }
      });

      const allNews: NewsData[] = [];

      for (const protocol of protocols) {
        try {
          const newsResult = await repo({
            entity: 'search',
            source: 'gemini',
          }).findMany({
            limit: 5,
            where: {
              query: `${protocol.name} ${protocol.category} cryptocurrency news`
            }
          });

          const data = (newsResult as any)?.data || newsResult;

          if (data && Array.isArray(data)) {
            data.forEach((item: any) => {
              if (item.sources && Array.isArray(item.sources)) {
                item.sources.forEach((source: any, index: number) => {
                  allNews.push({
                    title: source.title || `${protocol.name} Update ${index + 1}`,
                    description: item.answer || source.snippet || 'No description available',
                    url: source.url || '',
                    publishedAt: item.timestamp || new Date().toISOString(),
                    source: {
                      name: 'Gemini Search'
                    },
                    author: 'Gemini AI'
                  });
                });
              } else {
                allNews.push({
                  title: `${protocol.name} News`,
                  description: item.answer || 'No description available',
                  url: item.sources?.[0]?.url || '',
                  publishedAt: item.timestamp || new Date().toISOString(),
                  source: {
                    name: 'Gemini Search'
                  },
                  author: 'Gemini AI'
                });
              }
            });
          }
        } catch (error) {
          console.error(`Failed to fetch news for ${protocol.name}:`, error)
        }
      }

      if (allNews.length === 0) {
        const generalNewsResult = await repo({
          entity: 'search',
          source: 'gemini',
        }).findMany({
          limit: 10,
          where: {
            query: "cryptocurrency"
          }
        });

        const data = (generalNewsResult as any)?.data || generalNewsResult;
        if (data && Array.isArray(data)) {
          data.forEach((item: any) => {
            if (item.sources && Array.isArray(item.sources)) {
              item.sources.forEach((source: any, index: number) => {
                allNews.push({
                  title: source.title || `Cryptocurrency Update ${index + 1}`,
                  description: item.answer || source.snippet || 'No description available',
                  url: source.url || '',
                  publishedAt: item.timestamp || new Date().toISOString(),
                  source: {
                    name: 'Gemini Search'
                  },
                  author: 'Gemini AI'
                });
              });
            }
          });
        }
      }

      setNewsData(allNews)
    } catch (error) {
      console.error("Failed to fetch news data:", error)
      toast({
        title: "News Loading Error",
        description: "Failed to load news data, but other data is still available",
        variant: "destructive"
      })
    } finally {
      setNewsLoading(false)
    }
  }

  const fetchAllData = async () => {
    try {
      setLoading(true)

      URPC.init({
        forceInit: true,
        baseUrl: `${baseUrl}/api/gateway/${defillamaSourceId}`,
        timeout: 60000,
        headers: {
          'x-api-key': apiKey!,
          'Content-Type': 'application/json'
        }
      });

      const defillamaResult = await repo({
        entity: 'defillamaview',
        source: 'pg',
      }).findMany({
        limit: 3
      });

      const defillamaProtocols = (defillamaResult as DefillamaData[]) || []

      const protocolsWithTwitter = await Promise.all(
        defillamaProtocols.map(async (protocol) => {
          try {
            URPC.init({
              forceInit: true,
              baseUrl: `${baseUrl}/api/gateway/${twitterSourceId}`,
              timeout: 60000,
              headers: {
                'x-api-key': apiKey!,
                'Content-Type': 'application/json'
              }
            });

            const twitterResult = await repo({
              entity: 'twittertweet',
              source: 'twitter',
            }).findMany({
              limit: 10,
              where: {
                requestedUser: protocol.twitter
              }
            });

            return {
              ...protocol,
              twitterData: (twitterResult as TwitterData[]) || []
            }
          } catch (error) {
            console.error(`Failed to fetch Twitter data for ${protocol.name}:`, error)
            return {
              ...protocol,
              twitterData: []
            }
          }
        })
      )

      setDefillamaData(protocolsWithTwitter)
      fetchNewsData(defillamaProtocols)

    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast({
        title: "Error",
        description: "Failed to load data from APIs",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatTVL = (tvl: number) => {
    if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`
    if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(2)}M`
    if (tvl >= 1e3) return `$${(tvl / 1e3).toFixed(2)}K`
    return `$${tvl.toFixed(2)}`
  }

  const formatPercentage = (current: number, previous: number) => {
    if (previous === 0) return <span className="text-gray-500">0.00%</span>
    const change = ((current - previous) / previous) * 100
    return (
      <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(change).toFixed(2)}%
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return 'N/A'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return num.toFixed(2)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-100">
              🚀 DeFi News Hub
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              Comprehensive DeFi protocols, social sentiment, and crypto news monitoring
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-end gap-4 mb-6">
          <Button
            onClick={fetchAllData}
            disabled={loading}
            className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 rounded-lg"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        <div className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="border-slate-700 bg-slate-900/60 backdrop-blur-sm animate-pulse rounded-2xl">
                    <CardContent className="p-6">
                      <div className="h-6 w-32 bg-slate-800 rounded mb-4" />
                      <div className="h-8 w-24 bg-slate-800 rounded mb-3" />
                      <div className="h-4 w-20 bg-slate-800 rounded mb-2" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-6 bg-slate-800 rounded" />
                        <div className="h-6 bg-slate-800 rounded" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {defillamaData.map((protocol) => (
                  <Card key={protocol.slug} className="border-slate-700 bg-slate-900/60 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-200 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-200">{protocol.name}</h3>
                          <p className="text-xs text-slate-400 font-mono">{protocol.slug}</p>
                        </div>
                        <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs">
                          {protocol.category}
                        </Badge>
                      </div>

                      <div className="mb-4">
                        <div className="text-2xl font-bold text-cyan-300 mb-1">
                          {formatTVL(protocol.tvl.default.tvl)}
                        </div>
                        <div className="text-sm">
                          {formatPercentage(protocol.tvl.default.tvl, protocol.tvl.default.tvlPrevDay)}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-300">24h Fees</span>
                          <span className="text-slate-200">${formatNumber(protocol.fees.total24h)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">7d Fees</span>
                          <span className="text-slate-200">${formatNumber(protocol.fees.total7d)}</span>
                        </div>
                      </div>

                      {protocol.twitterData && protocol.twitterData.length > 0 && (
                        <div className="mb-4 pt-4 border-t border-slate-600">
                          <div className="flex items-center gap-2 mb-3">
                            <Twitter className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-slate-300">Recent Tweets ({protocol.twitterData.length})</span>
                          </div>
                          <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                            {protocol.twitterData.map((tweet, index) => (
                              <div
                                key={tweet.id}
                                className="bg-slate-800/50 rounded-lg p-3 hover:bg-slate-700/50 cursor-pointer transition-colors"
                                onClick={() => window.open(`https://twitter.com/${tweet.user.screenName}/status/${tweet.id}`, '_blank')}
                              >
                                <div className="text-xs text-slate-400 mb-1">
                                  {formatDate(tweet.createdAt)}
                                </div>
                                <div className="text-sm text-slate-300 line-clamp-2 mb-2">
                                  {tweet.fullText}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span>❤️ {tweet.likes}</span>
                                  <span>🔄 {tweet.retweets}</span>
                                  <span>💬 {tweet.comments}</span>
                                  <span>👁️ {tweet.views}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-4 pt-4 border-t border-slate-600">
                        <div className="flex items-center gap-2 mb-3">
                          <Newspaper className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-slate-300">
                            Related News {newsLoading && <span className="text-xs text-slate-500">(Loading...)</span>}
                          </span>
                        </div>
                        {newsLoading ? (
                          <div className="space-y-2">
                            {[...Array(2)].map((_, i) => (
                              <div key={i} className="bg-slate-800/50 rounded-lg p-3 animate-pulse">
                                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                                <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                            {newsData
                              .filter(article =>
                                (article.title && article.title.toLowerCase().includes(protocol.name.toLowerCase())) ||
                                (article.description && article.description.toLowerCase().includes(protocol.name.toLowerCase())) ||
                                (article.title && article.title.toLowerCase().includes(protocol.slug.toLowerCase()))
                              )
                              .slice(0, 3)
                              .map((article, index) => (
                                <div
                                  key={article.url || index}
                                  className="bg-slate-800/50 rounded-lg p-3 hover:bg-slate-700/50 cursor-pointer transition-colors"
                                  onClick={() => window.open(article.url, '_blank')}
                                >
                                  <div className="text-xs text-slate-400 mb-1">
                                    {article.source.name} • {formatDate(article.publishedAt)}
                                  </div>
                                  <div className="text-sm text-slate-300 line-clamp-2 mb-2">
                                    {article.title}
                                  </div>
                                  <div className="text-xs text-slate-500 line-clamp-1">
                                    {article.description}
                                  </div>
                                </div>
                              ))}
                            {newsData.filter(article =>
                              (article.title && article.title.toLowerCase().includes(protocol.name.toLowerCase())) ||
                              (article.description && article.description.toLowerCase().includes(protocol.name.toLowerCase())) ||
                              (article.title && article.title.toLowerCase().includes(protocol.slug.toLowerCase()))
                            ).length === 0 && !newsLoading && (
                              <div className="text-xs text-slate-500 text-center py-2">
                                No related news found
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 rounded-lg"
                          onClick={() => window.open(protocol.site, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Website
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 rounded-lg"
                          onClick={() => window.open(`https://twitter.com/${protocol.twitter}`, '_blank')}
                        >
                          <Twitter className="h-3 w-3 mr-2" />
                          Twitter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
        </div>

        {!loading && defillamaData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">No DeFi protocols available.</div>
            <Button onClick={fetchAllData} className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200">
              Retry Loading
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}