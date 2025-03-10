import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, Button, ButtonBase, ButtonProps, Container, IconButton, Menu, MenuItem, MenuItemProps, Stack, Toolbar, Typography } from '@mui/material'
import { Link, linkOptions } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LogoComponent } from '@/components/icons/logo'

const options = linkOptions([
  {
    to: '/app',
    label: 'navigation:app' as unknown as TemplateStringsArray,
    activeOptions: { exact: true },
  },
])

export function NavigationComponent() {
  const { t } = useTranslation(['common', 'navigation'])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const buttons: (ButtonProps & { label: string })[] = useMemo(() => options.map(o => ({
    ...o,
    component: Link,
    color: o.to.toString() === '/app' ? 'secondary' : 'inherit',
    label: t(o.label),
    to: o.to,
    sx: {
      marginLeft: o.to.toString() === '/app' ? 'auto !important' : undefined,
    },
    variant: o.to.toString() === '/app' ? 'contained' : undefined,
  })), [t])

  const links: (MenuItemProps & { label: string })[] = useMemo(() => options.map(o => ({
    ...o,
    component: Link,
    label: t(o.label),
    to: o.to,
    onClick: () => setAnchorEl(null),
  })), [t])

  return (
    <AppBar position="static" elevation={0}>
      <Container>
        <Toolbar disableGutters variant="dense">
          <ButtonBase component={Link} to="/" sx={{ mr: 2, borderRadius: '100%' }}>
            <LogoComponent sx={{ width: 40, height: 40 }} />
            <Typography variant="h6" component="div" noWrap minWidth={150} ml={2}>
              {t('app')}
            </Typography>
          </ButtonBase>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={event => setAnchorEl(event.currentTarget)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {links.map(({ label, ...o }, i) => (
                <MenuItem key={i} {...o}>
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Stack alignItems="center" direction="row" display={{ xs: 'none', md: 'flex' }} justifyContent="flex-start" ml={4} spacing={2} width="100%">
            {buttons.map(({ label, ...o }, i) => (
              <Button key={i} {...o}>
                {label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
