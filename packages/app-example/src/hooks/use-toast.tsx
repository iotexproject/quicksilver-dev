import React from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'destructive'
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface ToastProps {
  toast: (props: Omit<Toast, 'id'>) => void
}

export function useToast(): ToastProps {
  const toast = React.useCallback((props: Omit<Toast, 'id'>) => {
    // Simple console implementation for now
    console.log('Toast:', props.title || props.description)
  }, [])

  return { toast }
}