import { useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'

export const useEffectsAnalytics = () => {
  const { pathname } = useLocation()

  const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)

  useEffect(() => {
    if (isLocalhost) return
    gtag('set', 'page', pathname)
    gtag('event', 'page_view')
  }, [isLocalhost, pathname])
}
