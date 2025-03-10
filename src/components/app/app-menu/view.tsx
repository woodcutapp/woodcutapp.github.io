import { ChevronRight } from '@mui/icons-material'
import { Button, ButtonProps, Menu, MenuItem, MenuItemProps, MenuList, MenuListProps, MenuProps, Typography, useColorScheme, useMediaQuery } from '@mui/material'
import { Project, projectGetActive, ProjectState, RenderState } from '@woodcutapp/woodcutapp'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getAppMenuHotkeyLabel } from '@/functions/app-menu-hotkeys'
import { UseAppMenuReturn } from '@/hooks/app-menu'

interface AppMenuViewComponentProps extends Pick<UseAppMenuReturn, 'handleViewActive' | 'handleViewActiveDimension' | 'handleViewActiveInfo' | 'handleViewActivePosition' | 'handleViewActiveRotation' | 'handleViewCamera' | 'handleViewDrawer' | 'handleViewFocused' | 'handleViewGrid' | 'handleViewGridAxis' | 'handleViewRuler' | 'handleViewRulerPointA' | 'handleViewRulerPointB' | 'handleViewRulerPointClear' | 'handleViewRulerSnap'> {
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

export function AppMenuViewComponent({ handleViewActive, handleViewActiveDimension, handleViewActiveInfo, handleViewActivePosition, handleViewActiveRotation, handleViewCamera, handleViewDrawer, handleViewFocused, handleViewGrid, handleViewGridAxis, handleViewRuler, handleViewRulerPointA, handleViewRulerPointB, handleViewRulerPointClear, handleViewRulerSnap, project, projectState, renderState, ButtonProps, MenuItemProps, MenuListProps, MenuProps }: AppMenuViewComponentProps) {
  const { t } = useTranslation(['app-menu'])

  const { mode, setMode } = useColorScheme()
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const [activeType] = projectGetActive(projectState.active)

  const buttonRef = useRef<HTMLButtonElement>(null)
  const activeMenuItemRef = useRef<HTMLLIElement>(null)
  const gridMenuItemRef = useRef<HTMLLIElement>(null)
  const gridXMenuItemRef = useRef<HTMLLIElement>(null)
  const gridYMenuItemRef = useRef<HTMLLIElement>(null)
  const gridZMenuItemRef = useRef<HTMLLIElement>(null)
  const rulerMenuItemRef = useRef<HTMLLIElement>(null)

  const [open, setOpen] = useState(false)
  const [activeMenuOpen, setActiveMenuOpen] = useState(false)
  const [gridMenuOpen, setGridMenuOpen] = useState(false)
  const [gridXMenuOpen, setGridXMenuOpen] = useState(false)
  const [gridYMenuOpen, setGridYMenuOpen] = useState(false)
  const [gridZMenuOpen, setGridZMenuOpen] = useState(false)
  const [rulerMenuOpen, setRulerMenuOpen] = useState(false)

  const rightMenuProps: Pick<MenuProps, 'anchorOrigin' & 'transformOrigin' & 'sx'> = {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    sx: {
      transform: 'translateX(0) translateY(-15px)',
    },
  }

  const closeMenu = useCallback((fn?: () => void) => {
    setOpen(false)
    setActiveMenuOpen(false)
    setGridMenuOpen(false)
    setGridXMenuOpen(false)
    setGridYMenuOpen(false)
    setGridZMenuOpen(false)
    setRulerMenuOpen(false)
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    if (fn) fn()
  }, [])

  useEffect(() => {
    if (mode === 'system') setMode(prefersDarkMode ? 'dark' : 'light')
  }, [mode, prefersDarkMode, setMode])

  return (
    <>
      <Button ref={buttonRef} {...ButtonProps} onClick={() => setOpen(true)}>
        <span>{t('app-menu:view')}</span>
      </Button>
      <Menu {...MenuProps} open={open} anchorEl={buttonRef.current} onClose={() => closeMenu()}>
        <MenuList {...MenuListProps}>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewCamera)}>
            <Typography>{t(renderState.camera[0] === 'orthographic' ? 'app-menu:view.camera.orthographic' : 'app-menu:view.camera.perspective')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.camera')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewFocused)}>
            <Typography>{t(projectState.focused ? 'app-menu:view.focused.disable' : 'app-menu:view.focused.enable')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.focused')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} ref={activeMenuItemRef} disabled={activeType === undefined} onClick={() => setActiveMenuOpen(true)}>
            <Typography>{t('app-menu:view.active')}</Typography>
            <ChevronRight />
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewDrawer)}>
            <Typography>{t(projectState.drawer[0] ? 'app-menu:view.drawer.disable' : 'app-menu:view.drawer.enable')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.drawer')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} ref={gridMenuItemRef} onClick={() => setGridMenuOpen(true)}>
            <Typography>{t(renderState.grid[0] ? 'app-menu:view.grid.enabled' : 'app-menu:view.grid.disabled')}</Typography>
            <ChevronRight />
          </MenuItem>
          <MenuItem {...MenuItemProps} ref={rulerMenuItemRef} onClick={() => setRulerMenuOpen(true)}>
            <Typography>{t(renderState.ruler[0] ? 'app-menu:view.ruler.enabled' : 'app-menu:view.ruler.disabled')}</Typography>
            <ChevronRight />
          </MenuItem>
          <MenuItem
            {...MenuItemProps}
            onClick={() => {
              closeMenu()
              setMode(mode === 'dark' ? 'light' : 'dark')
            }}
          >
            <Typography>{t(mode === 'dark' ? 'app-menu:mode.light' : 'app-menu:mode.dark')}</Typography>
          </MenuItem>
        </MenuList>
      </Menu>
      {activeMenuOpen && (
        <Menu open={activeMenuOpen} anchorEl={activeMenuItemRef.current} {...MenuProps} {...rightMenuProps} onClose={() => setActiveMenuOpen(false)}>
          <MenuList {...MenuListProps}>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewActive)}>
              <Typography>{t(projectState.active[0] ? 'app-menu:view.active.disable' : 'app-menu:view.active.enable')}</Typography>
              <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.active')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewActiveInfo)}>
              <Typography>{t('app-menu:view.active.info')}</Typography>
              <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.active.info')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewActiveDimension)}>
              <Typography>{t('app-menu:view.active.dimension')}</Typography>
              <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.active.dimension')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewActivePosition)}>
              <Typography>{t('app-menu:view.active.position')}</Typography>
              <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.active.position')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewActiveRotation)}>
              <Typography>{t('app-menu:view.active.rotation')}</Typography>
              <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.active.rotation')}</Typography>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      {gridMenuOpen && (
        <Menu
          open={gridMenuOpen}
          anchorEl={gridMenuItemRef.current}
          {...MenuProps}
          {...rightMenuProps}
          onClose={() => setGridMenuOpen(false)}
        >
          <MenuList {...MenuListProps}>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewGrid)}>
              <Typography>{t(renderState.grid[0] ? 'app-menu:view.grid.disable' : 'app-menu:view.grid.enable')}</Typography>
              <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.grid')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} ref={gridXMenuItemRef} onClick={() => setGridXMenuOpen(true)}>
              <Typography>{t('app-menu:view.grid.x')}</Typography>
              <ChevronRight />
            </MenuItem>
            <MenuItem {...MenuItemProps} ref={gridYMenuItemRef} onClick={() => setGridYMenuOpen(true)}>
              <Typography>{t('app-menu:view.grid.y')}</Typography>
              <ChevronRight />
            </MenuItem>
            <MenuItem {...MenuItemProps} ref={gridZMenuItemRef} onClick={() => setGridZMenuOpen(true)}>
              <Typography>{t('app-menu:view.grid.z')}</Typography>
              <ChevronRight />
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      {gridXMenuOpen && (
        <Menu
          open={gridXMenuOpen}
          anchorEl={gridXMenuItemRef.current}
          {...MenuProps}
          {...rightMenuProps}
          onClose={() => setGridXMenuOpen(false)}
          onMouseLeave={() => setGridXMenuOpen(false)}
        >
          <MenuList {...MenuListProps} onClick={() => closeMenu()}>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(2, 'none')}>
              <Typography>{t('app-menu:view.grid.axis.none')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(2, 'primary')}>
              <Typography>{t(project.settings.measurement === 'imperial' ? 'app-menu:view.grid.axis.primary.imperial' : 'app-menu:view.grid.axis.primary.metric')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(2, 'secondary')}>
              <Typography>{t(project.settings.measurement === 'imperial' ? 'app-menu:view.grid.axis.secondary.imperial' : 'app-menu:view.grid.axis.secondary.metric')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(2, 'tertiary')}>
              <Typography>{t(project.settings.measurement === 'imperial' ? 'app-menu:view.grid.axis.tertiary.imperial' : 'app-menu:view.grid.axis.tertiary.metric')}</Typography>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      {gridYMenuOpen && (
        <Menu
          open={gridYMenuOpen}
          anchorEl={gridYMenuItemRef.current}
          {...MenuProps}
          {...rightMenuProps}
          onClose={() => setGridYMenuOpen(false)}
          onMouseLeave={() => setGridYMenuOpen(false)}
        >
          <MenuList {...MenuListProps} onClick={() => closeMenu()}>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(3, 'none')}>
              <Typography>{t('app-menu:view.grid.axis.none')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(3, 'primary')}>
              <Typography>{t(project.settings.measurement === 'imperial' ? 'app-menu:view.grid.axis.primary.imperial' : 'app-menu:view.grid.axis.primary.metric')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(3, 'secondary')}>
              <Typography>{t(project.settings.measurement === 'imperial' ? 'app-menu:view.grid.axis.secondary.imperial' : 'app-menu:view.grid.axis.secondary.metric')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(3, 'tertiary')}>
              <Typography>{t(project.settings.measurement === 'imperial' ? 'app-menu:view.grid.axis.tertiary.imperial' : 'app-menu:view.grid.axis.tertiary.metric')}</Typography>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      {gridZMenuOpen && (
        <Menu
          open={gridZMenuOpen}
          anchorEl={gridZMenuItemRef.current}
          {...MenuProps}
          {...rightMenuProps}
          onClose={() => setGridZMenuOpen(false)}
          onMouseLeave={() => setGridZMenuOpen(false)}
        >
          <MenuList {...MenuListProps} onClick={() => closeMenu()}>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(4, 'none')}>
              <Typography>{t('app-menu:view.grid.axis.none')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(4, 'primary')}>
              <Typography>{t(project.settings.measurement === 'imperial' ? 'app-menu:view.grid.axis.primary.imperial' : 'app-menu:view.grid.axis.primary.metric')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(4, 'secondary')}>
              <Typography>{t(project.settings.measurement === 'imperial' ? 'app-menu:view.grid.axis.secondary.imperial' : 'app-menu:view.grid.axis.secondary.metric')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => handleViewGridAxis(4, 'tertiary')}>
              <Typography>{t(project.settings.measurement === 'imperial' ? 'app-menu:view.grid.axis.tertiary.imperial' : 'app-menu:view.grid.axis.tertiary.metric')}</Typography>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
      {rulerMenuOpen && (
        <Menu
          open={rulerMenuOpen}
          anchorEl={rulerMenuItemRef.current}
          {...MenuProps}
          {...rightMenuProps}
          onClose={() => setRulerMenuOpen(false)}
        >
          <MenuList {...MenuListProps}>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewRuler)}>
              <Typography>{t(renderState.ruler[0] ? 'app-menu:view.ruler.disable' : 'app-menu:view.ruler.enable')}</Typography>
              <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.ruler')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewRulerSnap)}>
              <Typography>{t(renderState.ruler[1] ? 'app-menu:view.ruler.snap.disable' : 'app-menu:view.ruler.snap.enable')}</Typography>
              <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.ruler.snap')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewRulerPointA)}>
              <Typography>{t('app-menu:view.ruler.point.a')}</Typography>
              <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.ruler.points.a')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewRulerPointB)}>
              <Typography>{t('app-menu:view.ruler.point.b')}</Typography>
              <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.ruler.points.b')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleViewRulerPointClear)}>
              <Typography>{t('app-menu:view.ruler.point.clear')}</Typography>
              <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:view.ruler.points.clear')}</Typography>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  )
}
