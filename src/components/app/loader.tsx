import { Box, GlobalStyles } from '@mui/material'

import { LogoComponent } from '@/components/icons/logo'

export function AppLoader() {
  return (
    <Box sx={{ height: '100%' }}>
      <GlobalStyles
        styles={{
          'body': { padding: 0, margin: 0 },
          'html, body, body > main': { height: '100%' },
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(0.85)',
            },
            '70%': {
              transform: 'scale(1)',
            },
            '100%': {
              transform: 'scale(0.85)',
            },
          },
        }}
      />
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LogoComponent
          style={{
            fontSize: 128,
            transform: 'scale(1)',
            animation: 'pulse 2s infinite',
          }}
        />
      </div>
    </Box>
  )
}
