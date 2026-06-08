import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material'
import { createRootRoute, Outlet } from '@tanstack/react-router'

import { useEffectsAnalytics } from '@/hooks/analytics'
import { theme } from '@/theme'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  useEffectsAnalytics()
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        <Outlet />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
