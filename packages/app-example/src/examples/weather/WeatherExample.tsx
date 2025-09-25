"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Cloud,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Search,
  ExternalLink,
  RefreshCw,
  Eye,
  CloudSnow
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { repo, URPC } from "@unilab/urpc"
import { useApiKey } from "@/hooks/use-auth"

interface WeatherData {
  latitude: number
  longitude: number
  temperature: number
  humidity: number
  wind_speed: number
  weather_code: number
  timezone: string
  update_time: string
  cityName?: string
}

export function WeatherExample() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const { apiKey } = useApiKey()

  const sourceId = "6b512c9b-e96e-48fe-8d64-81f63fa6fc63"
  const baseUrl = "https://quicksilver-alpha-preview.onrender.com"

  const cities = [
    { name: "New York", lat: 40.7128, lng: -74.0060 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Sydney", lat: -33.8688, lng: 151.2093 },
    { name: "Berlin", lat: 52.5200, lng: 13.4050 },
    { name: "Moscow", lat: 55.7558, lng: 37.6173 },
    { name: "Beijing", lat: 39.9042, lng: 116.4074 },
    { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
    { name: "Cape Town", lat: -33.9249, lng: 18.4241 }
  ]

  useEffect(() => {
    fetchWeatherData()
  }, [])

  const fetchWeatherData = async () => {
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

      const weatherPromises = cities.map(async (city) => {
        try {
          const data = await repo({
            entity: 'weatherEntity',
            source: 'open-meteo',
          }).findMany({
            limit: 1,
            where: {
              latitude: city.lat,
              longitude: city.lng
            }
          });

          return data && data.length > 0 ? { ...data[0], cityName: city.name } : null
        } catch (error) {
          console.error(`Failed to fetch weather for ${city.name}:`, error)
          return null
        }
      })

      const results = await Promise.all(weatherPromises)
      const validData = results.filter(result => result !== null)

      setWeatherData(validData as WeatherData[])
    } catch (error) {
      console.error("Failed to fetch weather data:", error)
      toast({
        title: "Error",
        description: "Failed to load weather data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredWeather = weatherData?.filter(weather =>
    `${weather.latitude},${weather.longitude}`.includes(searchTerm) ||
    weather.timezone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (weather.cityName && weather.cityName.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  const formatTemperature = (temp: number) => {
    return `${temp.toFixed(1)}°C`
  }

  const formatHumidity = (humidity: number) => {
    return `${humidity}%`
  }

  const formatWindSpeed = (speed: number) => {
    return `${speed.toFixed(1)} km/h`
  }

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  const getWeatherIcon = (code: number) => {
    switch (code) {
      case 0: return <Sun className="h-6 w-6 text-yellow-400" />
      case 1: return <Sun className="h-6 w-6 text-yellow-300" />
      case 2: return <Cloud className="h-6 w-6 text-gray-400" />
      case 3: return <Cloud className="h-6 w-6 text-gray-500" />
      case 45: return <Cloud className="h-6 w-6 text-gray-400" />
      case 48: return <CloudSnow className="h-6 w-6 text-blue-300" />
      case 51: return <CloudRain className="h-6 w-6 text-blue-400" />
      case 53: return <CloudRain className="h-6 w-6 text-blue-500" />
      case 55: return <CloudRain className="h-6 w-6 text-blue-600" />
      case 61: return <CloudRain className="h-6 w-6 text-blue-500" />
      case 63: return <CloudRain className="h-6 w-6 text-blue-600" />
      case 65: return <CloudRain className="h-6 w-6 text-blue-700" />
      case 71: return <Snowflake className="h-6 w-6 text-blue-200" />
      case 73: return <Snowflake className="h-6 w-6 text-blue-300" />
      case 75: return <Snowflake className="h-6 w-6 text-blue-400" />
      default: return <Cloud className="h-6 w-6 text-gray-400" />
    }
  }

  const getWeatherDescription = (code: number) => {
    switch (code) {
      case 0: return "Clear sky"
      case 1: return "Mainly clear"
      case 2: return "Partly cloudy"
      case 3: return "Overcast"
      case 45: return "Fog"
      case 48: return "Depositing rime fog"
      case 51: return "Light drizzle"
      case 53: return "Moderate drizzle"
      case 55: return "Dense drizzle"
      case 61: return "Slight rain"
      case 63: return "Moderate rain"
      case 65: return "Heavy rain"
      case 71: return "Slight snow fall"
      case 73: return "Moderate snow fall"
      case 75: return "Heavy snow fall"
      default: return "Unknown"
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-100">
              🌤️ Weather Grid
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
              Global weather monitoring with interactive city grid layout
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
                placeholder="Search cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-400 rounded-lg"
              />
            </div>
            <Button
              onClick={fetchWeatherData}
              disabled={loading}
              className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200 rounded-lg"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {!loading && weatherData.length > 0 && (
            <div className="flex items-center gap-6 text-sm">
              <div className="text-slate-300">
                <span className="text-slate-400">Cities:</span> {weatherData.length}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Avg Temp:</span> {formatTemperature(weatherData.reduce((sum, w) => sum + w.temperature, 0) / weatherData.length)}
              </div>
              <div className="text-slate-300">
                <span className="text-slate-400">Avg Humidity:</span> {formatHumidity(Math.round(weatherData.reduce((sum, w) => sum + w.humidity, 0) / weatherData.length))}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(10)].map((_, i) => (
              <Card key={i} className="border-slate-700 bg-slate-900/50 backdrop-blur-sm animate-pulse rounded-2xl">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 bg-slate-800 rounded-full mx-auto mb-4" />
                  <div className="h-8 w-24 bg-slate-800 rounded mx-auto mb-3" />
                  <div className="h-6 w-20 bg-slate-800 rounded mx-auto mb-2" />
                  <div className="h-4 w-32 bg-slate-800 rounded mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWeather.map((weather, index) => (
              <Card
                key={`${weather.latitude}-${weather.longitude}-${index}`}
                className="border-slate-700 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50 transition-all duration-300 hover:scale-105 group cursor-pointer rounded-2xl"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-sm text-slate-400 mb-2">
                    {weather.cityName || weather.timezone}
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 bg-slate-700 rounded-full flex items-center justify-center shadow-lg">
                      {getWeatherIcon(weather.weather_code)}
                    </div>
                  </div>

                  <div className="text-4xl font-light text-slate-100 mb-2">
                    {formatTemperature(weather.temperature)}
                  </div>

                  <div className="text-lg text-slate-300 mb-4 capitalize">
                    {getWeatherDescription(weather.weather_code)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300">{formatHumidity(weather.humidity)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Wind className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-300">{formatWindSpeed(weather.wind_speed)}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 mt-4 font-mono">
                    {formatCoordinates(weather.latitude, weather.longitude)}
                  </div>

                  <div
                    className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(`https://www.google.com/maps?q=${weather.latitude},${weather.longitude}`, '_blank')}
                  >
                    <div className="text-xs text-slate-400 hover:text-slate-300 cursor-pointer">
                      📍 View on Map
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredWeather.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">No weather data found matching your search.</div>
            <Button onClick={() => setSearchTerm("")} className="bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200">
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}