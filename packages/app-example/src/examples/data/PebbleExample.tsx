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
  BarChart3,
  DollarSign,
  Activity,
  Calendar,
  Zap,
  Star,
  MapPin,
  Thermometer,
  Droplets,
  Eye,
  Battery,
  Wifi,
  Cpu
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { repo, URPC } from "@unilab/urpc"
import { useApiKey } from "@/hooks/use-auth"

interface PebbleData {
  id: string
  imei: string
  operator: string
  snr: string
  vbat: string
  gas_resistance: string
  temperature: string
  temperature2: string
  pressure: string
  humidity: string
  light: string
  gyroscope: string
  accelerometer: string
  latitude: string
  longitude: string
  signature: string
  timestamp: string
  created_at: string
  updated_at: string
}

export function PebbleExample() {
  const [pebbles, setPebbles] = useState<PebbleData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { apiKey } = useApiKey()

  const sourceId = "58022b57-3f3a-4534-b762-26c188a95ec8"
  const baseUrl = "https://quicksilver-alpha-preview.onrender.com"

  useEffect(() => {
    fetchPebbleData()
  }, [])

  const fetchPebbleData = async () => {
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
        entity: 'deviceRecord',
        source: 'pg',
      }).findMany({
        limit: 10
      });

      setPebbles((data as PebbleData[]) || [])
    } catch (error) {
      console.error("Failed to fetch pebble data:", error)
      toast({
        title: "Error",
        description: "Failed to load pebble device data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPebbles = pebbles?.filter(pebble =>
    pebble.imei.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pebble.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const formatNumber = (num: string | number) => {
    const value = typeof num === 'string' ? parseFloat(num) : num
    if (isNaN(value)) return '0'
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B'
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M'
    if (value >= 1e3) return (value / 1e3).toFixed(2) + 'K'
    return value.toFixed(2)
  }

  const formatTemperature = (temp: string) => {
    const value = parseFloat(temp)
    if (isNaN(value)) return 'N/A'
    return `${value.toFixed(2)}°C`
  }

  const formatPressure = (pressure: string) => {
    const value = parseFloat(pressure)
    if (isNaN(value)) return 'N/A'
    return `${value.toFixed(2)} hPa`
  }

  const formatHumidity = (humidity: string) => {
    const value = parseFloat(humidity)
    if (isNaN(value)) return 'N/A'
    return `${value.toFixed(2)}%`
  }

  const formatLight = (light: string) => {
    const value = parseFloat(light)
    if (isNaN(value)) return 'N/A'
    return `${value.toFixed(2)} lux`
  }

  const formatBattery = (vbat: string) => {
    const value = parseFloat(vbat)
    if (isNaN(value)) return 'N/A'
    return `${value.toFixed(2)}V`
  }

  const formatSNR = (snr: string) => {
    const value = parseFloat(snr)
    if (isNaN(value)) return 'N/A'
    return `${value.toFixed(2)} dB`
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString()
    } catch {
      return 'N/A'
    }
  }

  const formatCoordinates = (lat: string, lng: string) => {
    const latVal = parseFloat(lat)
    const lngVal = parseFloat(lng)
    if (isNaN(latVal) || isNaN(lngVal)) return 'N/A'
    return `${latVal.toFixed(6)}, ${lngVal.toFixed(6)}`
  }

  const parseArray = (str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      return []
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-100">
              📊 IoT Control Center
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              Advanced IoT device monitoring and management platform
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
            <Input
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/80 border-purple-500/30 text-slate-200 placeholder:text-purple-300/60 rounded-lg focus:border-purple-400/50"
            />
          </div>
          <Button
            onClick={fetchPebbleData}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-purple-500/50 text-white rounded-lg shadow-lg"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-purple-500/20 bg-slate-900/60 backdrop-blur-sm animate-pulse rounded-2xl shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 bg-purple-900/50 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-purple-900/50 rounded" />
                      <div className="h-3 w-16 bg-purple-900/50 rounded" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 w-24 bg-purple-900/50 rounded" />
                    <div className="h-4 w-16 bg-purple-900/50 rounded" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-8 bg-purple-900/50 rounded" />
                      <div className="h-8 bg-purple-900/50 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPebbles.map((pebble) => (
              <Card key={pebble.id} className="border-purple-500/20 bg-slate-900/60 backdrop-blur-sm hover:bg-purple-900/20 transition-all duration-200 rounded-2xl shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                        <Cpu className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-200">Device {pebble.imei.slice(-6)}</h3>
                        <p className="text-xs text-purple-300 font-mono">{pebble.imei}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs ${pebble.operator ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'}`}>
                      {pebble.operator || 'Unknown'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                      <div className="text-xl font-bold text-purple-200">{formatBattery(pebble.vbat)}</div>
                      <div className="text-xs text-purple-300">Battery</div>
                    </div>
                    <div className="text-center p-3 bg-purple-900/30 rounded-lg">
                      <div className="text-xl font-bold text-purple-200">{formatTemperature(pebble.temperature)}</div>
                      <div className="text-xs text-purple-300">Temp</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-200">Humidity</span>
                      <span className="text-slate-200">{formatHumidity(pebble.humidity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200">Signal</span>
                      <span className="text-slate-200">{formatSNR(pebble.snr)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-purple-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-purple-200">Location</span>
                    </div>
                    <div className="text-xs text-purple-300 font-mono">
                      {formatCoordinates(pebble.latitude, pebble.longitude)}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-600/20 rounded-lg"
                      onClick={() => window.open(`https://www.google.com/maps?q=${pebble.latitude},${pebble.longitude}`, '_blank')}
                    >
                      <MapPin className="h-3 w-3 mr-2" />
                      View Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredPebbles.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">No pebble devices found matching your search.</div>
            <Button onClick={() => setSearchTerm("")} className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200">
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}