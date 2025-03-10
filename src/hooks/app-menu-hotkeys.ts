import { useCallback, useEffect, useMemo } from 'react'

import { getAppMenuHotkeys } from '@/functions/app-menu-hotkeys'
import { useActiveElement } from '@/hooks/active-element'
import { UseAppMenuReturn } from '@/hooks/app-menu'

export function useAppMenuHotkeys(handlers: UseAppMenuReturn) {
  const { activeElement } = useActiveElement()

  const disableHotkeys = useMemo(() => {
    if (activeElement instanceof HTMLInputElement) {
      if (activeElement.type === 'text' || activeElement.type === 'number') return true
    }
    return false
  }, [activeElement])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disableHotkeys) return

    const { altKey, ctrlKey, shiftKey, key } = event

    const hotkeys = getAppMenuHotkeys()

    const hotkey = Object.keys(hotkeys).find((hotkey) => {
      const { alt, ctrl, keyCode, shift } = hotkeys[hotkey as keyof typeof hotkeys]

      return keyCode.toUpperCase() === key.toUpperCase()
        && altKey === alt
        && ctrlKey === ctrl
        && shiftKey === shift
    })

    switch (hotkey) {
      case 'app-menu:edit.copy': {
        handlers.handleEditCopy()
        break
      }
      case 'app-menu:edit.delete': {
        handlers.handleEditDelete()
        break
      }
      case 'app-menu:edit.duplicate': {
        handlers.handleEditDuplicate()
        break
      }
      case 'app-menu:edit.history.redo': {
        handlers.handleEditHistoryRedo()
        break
      }
      case 'app-menu:edit.history.undo': {
        handlers.handleEditHistoryUndo()
        break
      }
      case 'app-menu:edit.new': {
        handlers.handleEditNew()
        break
      }
      case 'app-menu:edit.paste': {
        handlers.handleEditPaste()
        break
      }
      case 'app-menu:edit.transform': {
        handlers.handleEditTransform()
        break
      }
      case 'app-menu:edit.visibility.all.hide': {
        handlers.handleEditVisibilityAllHide()
        break
      }
      case 'app-menu:edit.visibility.all.show': {
        handlers.handleEditVisibilityAllShow()
        break
      }
      case 'app-menu:edit.visibility': {
        handlers.handleEditVisibilityToggle()
        break
      }
      case 'app-menu:file.export': {
        handlers.handleFileNew()
        break
      }
      case 'app-menu:file.new': {
        handlers.handleFileNew()
        break
      }
      case 'app-menu:file.open': {
        const element = document.body.appendChild(document.createElement('input'))
        element.type = 'file'
        element.accept = '.woodcut'
        element.style.display = 'none'
        element.addEventListener('change', () => handlers.handleFileOpen(element))
        element.click()
        break
      }
      case 'app-menu:file.save': {
        handlers.handleFileSave()
        break
      }
      case 'app-menu:selection.find': {
        handlers.handleSelectionFind()
        break
      }
      case 'app-menu:selection.next': {
        handlers.handleSelectionNext()
        break
      }
      case 'app-menu:selection.previous': {
        handlers.handleSelectionPrevious()
        break
      }
      case 'app-menu:selection.select.all': {
        handlers.handleSelectionSelectAll()
        break
      }
      case 'app-menu:selection.select.none': {
        handlers.handleSelectionSelectNone()
        break
      }
      case 'app-menu:view.active.dimension': {
        handlers.handleViewActiveDimension()
        break
      }
      case 'app-menu:view.active.info': {
        handlers.handleViewActiveInfo()
        break
      }
      case 'app-menu:view.active.position': {
        handlers.handleViewActivePosition()
        break
      }
      case 'app-menu:view.active.rotation': {
        handlers.handleViewActiveRotation()
        break
      }
      case 'app-menu:view.active': {
        handlers.handleViewActive()
        break
      }
      case 'app-menu:view.camera': {
        handlers.handleViewCamera()
        break
      }
      case 'app-menu:view.drawer': {
        handlers.handleViewDrawer()
        break
      }
      case 'app-menu:view.focused': {
        handlers.handleViewFocused()
        break
      }
      case 'app-menu:view.grid': {
        handlers.handleViewGrid()
        break
      }
      case 'app-menu:view.ruler.points.a': {
        handlers.handleViewRulerPointA()
        break
      }
      case 'app-menu:view.ruler': {
        handlers.handleViewRuler()
        break
      }
      case 'app-menu:view.ruler.points.b': {
        handlers.handleViewRulerPointB()
        break
      }
      case 'app-menu:view.ruler.points.clear': {
        handlers.handleViewRulerPointClear()
        break
      }
      case 'app-menu:view.ruler.snap': {
        handlers.handleViewRulerSnap()
        break
      }
    }
  }, [disableHotkeys, handlers])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
