import { Carpenter, Dashboard, ImportExport, SquareFoot, Transform } from '@mui/icons-material'
import { Grid2, List, ListItem, ListItemButton, ListItemIcon, ListItemProps, ListItemText, Paper, useColorScheme } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Feature = 'cutlist' | 'cuts' | 'export' | 'ruler' | 'transform'

export function FeaturesComponent() {
  const { t } = useTranslation(['feature'])
  const { mode } = useColorScheme()

  const [feature, setFeature] = useState<Feature>('cuts')

  const src = useMemo(() => {
    const suffix = mode === 'system' ? 'dark' : mode
    switch (feature) {
      case 'cutlist': return `/images/feature-cutlist-${suffix}.png`
      case 'cuts': return `/images/feature-cuts-${suffix}.png`
      case 'export': return `/images/feature-export.png`
      case 'ruler': return `/images/feature-ruler-${suffix}.png`
      case 'transform': return `/images/feature-transform-${suffix}.png`
    }
  }, [feature, mode])

  const ListItemProps: ListItemProps = useMemo(() => ({
    disableGutters: true,
    disablePadding: true,
    sx: {
      marginBottom: 1,
    },
  }), [])

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={{ xs: 12, md: 8 }}>
        <Paper elevation={4} sx={({ shape }) => ({ borderRadius: shape.borderRadius, overflow: 'hidden' })}>
          <img src={src} width="100%" style={{ display: 'block' }} />
        </Paper>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <List disablePadding>
          <ListItem {...ListItemProps}>
            <ListItemButton
              selected={feature === 'cuts'}
              sx={({ shadows, shape }) => ({ boxShadow: shadows[1], borderRadius: shape.borderRadius })}
              onClick={() => setFeature('cuts')}
            >
              <ListItemIcon>
                <Carpenter fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary={t('feature:cuts')}
                secondary={t('feature:cuts.description')}
              />
            </ListItemButton>
          </ListItem>
          <ListItem {...ListItemProps}>
            <ListItemButton
              selected={feature === 'transform'}
              sx={({ shadows, shape }) => ({ boxShadow: shadows[1], borderRadius: shape.borderRadius })}
              onClick={() => setFeature('transform')}
            >
              <ListItemIcon>
                <Transform fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary={t('feature:transform')}
                secondary={t('feature:transform.description')}
              />
            </ListItemButton>
          </ListItem>
          <ListItem {...ListItemProps}>
            <ListItemButton
              selected={feature === 'cutlist'}
              sx={({ shadows, shape }) => ({ boxShadow: shadows[1], borderRadius: shape.borderRadius })}
              onClick={() => setFeature('cutlist')}
            >
              <ListItemIcon>
                <Dashboard fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary={t('feature:cutlist')}
                secondary={t('feature:cutlist.description')}
              />
            </ListItemButton>
          </ListItem>
          <ListItem {...ListItemProps}>
            <ListItemButton
              selected={feature === 'ruler'}
              sx={({ shadows, shape }) => ({ boxShadow: shadows[1], borderRadius: shape.borderRadius })}
              onClick={() => setFeature('ruler')}
            >
              <ListItemIcon>
                <SquareFoot fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary={t('feature:ruler')}
                secondary={t('feature:ruler.description')}
              />
            </ListItemButton>
          </ListItem>
          <ListItem {...ListItemProps}>
            <ListItemButton
              selected={feature === 'export'}
              sx={({ shadows, shape }) => ({ boxShadow: shadows[1], borderRadius: shape.borderRadius })}
              onClick={() => setFeature('export')}
            >
              <ListItemIcon>
                <ImportExport fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary={t('feature:export')}
                secondary={t('feature:export.description')}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Grid2>
    </Grid2>
  )
}
