import { Button, ButtonProps, Divider, Menu, MenuItem, MenuItemProps, MenuList, MenuListProps, MenuProps, Typography } from '@mui/material'
import { boardGetCut, componentGetBoard, Project, projectGetActive, projectGetComponent, ProjectState, RenderState } from '@woodcutapp/woodcutapp'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getAppMenuHotkeyLabel } from '@/functions/app-menu-hotkeys'
import { UseAppMenuReturn } from '@/hooks/app-menu'

interface AppMenuEditComponentProps extends Pick<UseAppMenuReturn, 'handleEditCopy' | 'handleEditDelete' | 'handleEditDuplicate' | 'handleEditHistoryRedo' | 'handleEditHistoryUndo' | 'handleEditNew' | 'handleEditPaste' | 'handleEditTransform' | 'handleEditVisibilityAllHide' | 'handleEditVisibilityAllShow' | 'handleEditVisibilityToggle'> {
  project: Project
  projectSet: (project: Project) => void
  projectState: ProjectState
  projectStateSet: (projectState: ProjectState) => void
  renderState: RenderState
  renderStateSet: (renderState: RenderState) => void
  ButtonProps?: ButtonProps
  MenuItemProps?: MenuItemProps
  MenuListProps?: MenuListProps
  MenuProps?: Omit<MenuProps, 'open'>
}

export function AppMenuEditComponent({ handleEditCopy, handleEditDelete, handleEditDuplicate, handleEditHistoryRedo, handleEditHistoryUndo, handleEditNew, handleEditPaste, handleEditTransform, handleEditVisibilityAllHide, handleEditVisibilityAllShow, handleEditVisibilityToggle, project, projectState, ButtonProps, MenuItemProps, MenuListProps, MenuProps }: AppMenuEditComponentProps) {
  const { t } = useTranslation(['app-menu', 'common'])
  const [activeType, indexes] = projectGetActive(projectState.active)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [open, setOpen] = useState(false)

  const activeIsVisible = useMemo(() => {
    try {
      switch (activeType) {
        case 'component': {
          const component = projectGetComponent(project, ...indexes)
          return component.visible
        }
        case 'board': {
          const board = componentGetBoard(project, ...indexes)
          return board.visible
        }
        case 'cut': {
          const cut = boardGetCut(project, ...indexes)
          return cut.visible
        }
        default: return false
      }
    }
    catch {
      return false
    }
  }, [activeType, indexes, project])

  const menuItemNewLabel: string = useMemo(() => {
    switch (activeType) {
      case 'board': return t('app-menu:edit.new.cut')
      case 'component': return t('app-menu:edit.new.board')
      default: return t('app-menu:edit.new.component')
    }
  }, [activeType, t])

  const closeMenu = useCallback((fn?: () => void) => {
    setOpen(false)
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    if (fn) fn()
  }, [])

  return (
    <>
      <Button ref={buttonRef} {...ButtonProps} onClick={() => setOpen(true)}>
        <span>{t('app-menu:edit')}</span>
      </Button>
      <Menu {...MenuProps} open={open} anchorEl={buttonRef.current} onClose={() => closeMenu()}>
        <MenuList {...MenuListProps}>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleEditNew)}>
            <Typography>{menuItemNewLabel}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:edit.new')}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleEditHistoryUndo)}>
            <Typography>{t('app-menu:edit.history.undo')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:edit.history.undo')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleEditHistoryRedo)}>
            <Typography>{t('app-menu:edit.history.redo')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:edit.history.redo')}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleEditCopy)}>
            <Typography>{t('app-menu:edit.copy')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:edit.copy')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleEditDelete)}>
            <Typography>{t('app-menu:edit.delete')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:edit.delete')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleEditPaste)}>
            <Typography>{t('app-menu:edit.paste')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:edit.paste')}</Typography>
          </MenuItem>
          <MenuItem disabled={activeType === undefined} {...MenuItemProps} onClick={() => closeMenu(handleEditDuplicate)}>
            <Typography>{t('app-menu:edit.duplicate')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:edit.duplicate')}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem disabled={activeType === undefined} {...MenuItemProps} onClick={() => closeMenu(handleEditVisibilityToggle)}>
            <Typography>{t(activeIsVisible ? 'app-menu:edit.visibility.hide' : 'app-menu:edit.visibility.show')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:edit.visibility')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleEditVisibilityAllShow)}>
            <Typography>{t('app-menu:edit.visibility.all.show')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleEditVisibilityAllHide)}>
            <Typography>{t('app-menu:edit.visibility.all.hide')}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleEditTransform)}>
            <Typography>{t(projectState.transform ? 'app-menu:edit.transform.disable' : 'app-menu:edit.transform.enable')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:edit.transform')}</Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}
