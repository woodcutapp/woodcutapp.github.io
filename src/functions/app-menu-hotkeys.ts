export type AppMenuHotkey =
  | 'app-menu:edit.copy'
  | 'app-menu:edit.delete'
  | 'app-menu:edit.duplicate'
  | 'app-menu:edit.history.redo'
  | 'app-menu:edit.history.undo'
  | 'app-menu:edit.new'
  | 'app-menu:edit.paste'
  | 'app-menu:edit.transform'
  | 'app-menu:edit.visibility'
  | 'app-menu:file.export'
  | 'app-menu:file.new'
  | 'app-menu:file.open'
  | 'app-menu:file.save'
  | 'app-menu:selection.find'
  | 'app-menu:selection.next'
  | 'app-menu:selection.previous'
  | 'app-menu:selection.select.all'
  | 'app-menu:selection.select.none'
  | 'app-menu:view.active.dimension'
  | 'app-menu:view.active.info'
  | 'app-menu:view.active.position'
  | 'app-menu:view.active.rotation'
  | 'app-menu:view.active'
  | 'app-menu:view.camera'
  | 'app-menu:view.drawer'
  | 'app-menu:view.focused'
  | 'app-menu:view.grid'
  | 'app-menu:view.ruler.points.a'
  | 'app-menu:view.ruler.points.b'
  | 'app-menu:view.ruler.points.clear'
  | 'app-menu:view.ruler.snap'
  | 'app-menu:view.ruler'

export function getAppMenuHotkeys(): Record<AppMenuHotkey, { alt: boolean, ctrl: boolean, keyCode: string, shift: boolean }> {
  return {
    ['app-menu:edit.copy']: { alt: false, ctrl: true, keyCode: 'C', shift: false },
    ['app-menu:edit.delete']: { alt: false, ctrl: false, keyCode: 'Delete', shift: false },
    ['app-menu:edit.duplicate']: { alt: false, ctrl: false, keyCode: 'D', shift: true },
    ['app-menu:edit.history.redo']: { alt: false, ctrl: true, keyCode: 'Z', shift: true },
    ['app-menu:edit.history.undo']: { alt: false, ctrl: true, keyCode: 'Z', shift: false },
    ['app-menu:edit.new']: { alt: false, ctrl: false, keyCode: 'N', shift: false },
    ['app-menu:edit.paste']: { alt: false, ctrl: true, keyCode: 'V', shift: false },
    ['app-menu:edit.transform']: { alt: false, ctrl: false, keyCode: 'T', shift: false },
    ['app-menu:edit.visibility']: { alt: false, ctrl: false, keyCode: 'H', shift: false },
    ['app-menu:file.export']: { alt: true, ctrl: false, keyCode: 'E', shift: false },
    ['app-menu:file.new']: { alt: true, ctrl: false, keyCode: 'N', shift: false },
    ['app-menu:file.open']: { alt: true, ctrl: false, keyCode: 'O', shift: false },
    ['app-menu:file.save']: { alt: true, ctrl: false, keyCode: 'S', shift: false },
    ['app-menu:selection.find']: { alt: true, ctrl: false, keyCode: '/', shift: false },
    ['app-menu:selection.next']: { alt: false, ctrl: false, keyCode: 'ArrowRight', shift: false },
    ['app-menu:selection.previous']: { alt: false, ctrl: false, keyCode: 'ArrowLeft', shift: false },
    ['app-menu:selection.select.all']: { alt: false, ctrl: true, keyCode: 'A', shift: false },
    ['app-menu:selection.select.none']: { alt: true, ctrl: true, keyCode: 'A', shift: false },
    ['app-menu:view.active.dimension']: { alt: false, ctrl: false, keyCode: '2', shift: false },
    ['app-menu:view.active.info']: { alt: false, ctrl: false, keyCode: '1', shift: false },
    ['app-menu:view.active.position']: { alt: false, ctrl: false, keyCode: '3', shift: false },
    ['app-menu:view.active.rotation']: { alt: false, ctrl: false, keyCode: '4', shift: false },
    ['app-menu:view.active']: { alt: false, ctrl: false, keyCode: '`', shift: false },
    ['app-menu:view.camera']: { alt: false, ctrl: false, keyCode: 'Q', shift: false },
    ['app-menu:view.drawer']: { alt: false, ctrl: false, keyCode: 'D', shift: false },
    ['app-menu:view.focused']: { alt: false, ctrl: false, keyCode: 'F', shift: false },
    ['app-menu:view.grid']: { alt: false, ctrl: false, keyCode: 'G', shift: false },
    ['app-menu:view.ruler.points.a']: { alt: false, ctrl: false, keyCode: 'A', shift: false },
    ['app-menu:view.ruler.points.b']: { alt: false, ctrl: false, keyCode: 'B', shift: false },
    ['app-menu:view.ruler.points.clear']: { alt: false, ctrl: false, keyCode: 'C', shift: false },
    ['app-menu:view.ruler.snap']: { alt: false, ctrl: false, keyCode: 'S', shift: false },
    ['app-menu:view.ruler']: { alt: false, ctrl: false, keyCode: 'R', shift: false },
  }
}

export function getAppMenuHotkeyLabel(hotkey: AppMenuHotkey): string {
  const hotkeys = getAppMenuHotkeys()
  const { alt, ctrl, keyCode, shift } = hotkeys[hotkey]
  let label = ''

  if (alt) {
    label += 'Alt+'
  }
  if (ctrl) {
    label += 'Ctrl+'
  }
  if (shift) {
    label += 'Shift+'
  }

  label += keyCode

  return label
}
