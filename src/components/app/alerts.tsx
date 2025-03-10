import { Alert, Snackbar } from '@mui/material'
import { useCallback, useMemo } from 'react'

import { alertRemove, useAppStore } from '@/store'

export function AlertsComponent() {
  const alerts = useAppStore(state => state.alerts)

  const topAlert = useMemo(() => alerts[0], [alerts])
  const severity = useMemo(() => {
    switch (topAlert?.severity) {
      case 'error': return 'error'
      case 'info': return 'info'
      case 'success': return 'success'
      case 'warning': return 'warning'
      default: return 'info'
    }
  }, [topAlert])

  const handleClose = useCallback(() => {
    alertRemove(0)
  }, [])

  if (!topAlert) return null

  return (
    <Snackbar
      open={Boolean(topAlert)}
      autoHideDuration={1000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {topAlert.message}
      </Alert>
    </Snackbar>
  )
}
