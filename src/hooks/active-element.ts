import { useEffect, useState } from 'react'

export const useActiveElement = () => {
  const [listenersReady, setListenersReady] = useState(false) /** Useful when working with autoFocus */
  const [activeElement, setActiveElement] = useState<EventTarget | null>(document.activeElement)

  useEffect(() => {
    const onFocus = (event: FocusEvent) => setActiveElement(event.target)
    const onBlur = () => setActiveElement(null)

    window.addEventListener('focus', onFocus, true)
    window.addEventListener('blur', onBlur, true)

    setListenersReady(true)

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  return {
    activeElement,
    listenersReady,
  }
}
