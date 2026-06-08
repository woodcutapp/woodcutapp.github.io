import '@/i18n'

import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router'
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

const rootElement = document.getElementById('root')
if (rootElement) {
  const root = createRoot(rootElement)

  root.render((
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  ))
}
else {
  throw Error('Unable to find root element')
}
