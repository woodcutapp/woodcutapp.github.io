import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material'
import { Outlet, createRootRoute } from '@tanstack/react-router'

import { theme } from '@/theme'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        <Outlet />
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
