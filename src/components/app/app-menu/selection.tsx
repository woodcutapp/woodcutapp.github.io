import { Button, ButtonProps, Divider, Menu, MenuItem, MenuItemProps, MenuList, MenuListProps, MenuProps, Typography } from '@mui/material'
import { Project, ProjectState, RenderState } from '@woodcutapp/woodcutapp'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getAppMenuHotkeyLabel } from '@/functions/app-menu-hotkeys'
import { UseAppMenuReturn } from '@/hooks/app-menu'

interface AppMenuSelectionComponentProps extends Pick<UseAppMenuReturn, 'handleSelectionFind' | 'handleSelectionNext' | 'handleSelectionPrevious' | 'handleSelectionSelectAll' | 'handleSelectionSelectNone'> {
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

export function AppMenuSelectionComponent({ handleSelectionFind, handleSelectionNext, handleSelectionPrevious, handleSelectionSelectAll, handleSelectionSelectNone, ButtonProps, MenuItemProps, MenuListProps, MenuProps }: AppMenuSelectionComponentProps) {
  const { t } = useTranslation(['common', 'app-menu'])

  const buttonRef = useRef<HTMLButtonElement>(null)

  const [open, setOpen] = useState(false)

  const closeMenu = useCallback((fn?: () => void) => {
    setOpen(false)
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    if (fn) fn()
  }, [])

  return (
    <>
      <Button ref={buttonRef} {...ButtonProps} onClick={() => setOpen(true)}>
        <span>{t('app-menu:selection')}</span>
      </Button>
      <Menu {...MenuProps} open={open} anchorEl={buttonRef.current} onClose={() => closeMenu()}>
        <MenuList {...MenuListProps}>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleSelectionSelectAll)}>
            <Typography>{t('app-menu:selection.select.all')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:selection.select.all')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleSelectionSelectNone)}>
            <Typography>{t('app-menu:selection.select.none')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:selection.select.none')}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleSelectionFind)}>
            <Typography>{t('app-menu:selection.find')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:selection.find')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleSelectionPrevious)}>
            <Typography>{t('app-menu:selection.previous')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:selection.previous')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleSelectionNext)}>
            <Typography>{t('app-menu:selection.next')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:selection.next')}</Typography>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}
