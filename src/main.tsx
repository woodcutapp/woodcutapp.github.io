import '@/i18n'

import { RouterProvider, createHashHistory, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { routeTree } from '@/routeTree.gen'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const router = createRouter({
  history: createHashHistory(),
  routeTree,
  defaultPreload: 'intent',
})

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

root.render((
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
))
