import React from 'react'

export interface AuthUser {
  id: string
  email?: string
  name?: string
}

export interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

export function useApiKey() {
  const [apiKey, setApiKey] = React.useState<string>('')

  return {
    apiKey,
    setApiKey,
    hasApiKey: !!apiKey
  }
}

export function useAuth(): AuthContextType {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const login = React.useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUser({ id: '1', email, name: email.split('@')[0] })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
  }, [])

  return {
    user,
    login,
    logout,
    isLoading
  }
}