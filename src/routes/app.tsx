import { createFileRoute } from '@tanstack/react-router'

import { AppComponent } from '@/components/app'
import { AppLoader } from '@/components/app/loader'

export const Route = createFileRoute('/app')({
  component: AppComponent,
  pendingComponent: AppLoader,
})
