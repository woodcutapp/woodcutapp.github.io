import { GitHub, Reddit } from '@mui/icons-material'
import { Button, Container, Grid2, Stack, Typography } from '@mui/material'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { FeaturesComponent } from '@/components/features'
import { LogoComponent } from '@/components/icons/logo'
import { NavigationComponent } from '@/components/navigation'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { t } = useTranslation(['home'])
  return (
    <>
      <NavigationComponent />
      <Container component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Stack spacing={8}>
          <Grid2 container alignItems="center" spacing={4}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Stack spacing={4}>
                <Stack direction="row" spacing={2}>
                  <LogoComponent sx={{ height: 100 }} />
                  <Stack spacing={1}>
                    <Typography variant="h1">{t('home:app.name')}</Typography>
                    <Typography>{t('home:app.slogan')}</Typography>
                  </Stack>
                </Stack>
                <Typography>
                  {t('home:app.text')}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    color="primary"
                    component={Link}
                    size="large"
                    to="/app"
                    variant="contained"
                  >
                    {t('home:start')}
                  </Button>
                </Stack>
              </Stack>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <img src="/images/dresser.png" width="100%" />
            </Grid2>
          </Grid2>
          <Stack spacing={4} textAlign="center">
            <Typography variant="h2">{t('home:features')}</Typography>
            <FeaturesComponent />
          </Stack>
          <Stack spacing={4} textAlign="center">
            <Typography variant="h2">{t('home:help')}</Typography>
            <Typography>{t('home:help.text')}</Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                color="primary"
                endIcon={<GitHub />}
                href="https://github.com/woodcutapp/woodcutapp.github.io"
                size="large"
                target="_blank"
                variant="contained"
              >
                {'Github'}
              </Button>
              <Button
                color="primary"
                endIcon={<Reddit />}
                href="https://www.reddit.com/r/woodcut"
                size="large"
                target="_blank"
                variant="contained"
              >
                {'Reddit'}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </>
  )
}
