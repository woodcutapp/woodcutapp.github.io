import { ChevronRight } from '@mui/icons-material'
import { Button, ButtonProps, Menu, MenuItem, MenuItemProps, MenuList, MenuListProps, MenuProps, Typography } from '@mui/material'
import { Project, ProjectState, RenderState } from '@woodcutapp/woodcutapp'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getAppMenuHotkeyLabel } from '@/functions/app-menu-hotkeys'
import { downloadFile } from '@/functions/util'
import { UseAppMenuReturn } from '@/hooks/app-menu'

interface AppMenuFileComponentProps extends Pick<UseAppMenuReturn, 'handleFileExportGtlf' | 'handleFileExportObj' | 'handleFileExportPly' | 'handleFileExportStl' | 'handleFileExportPng' | 'handleFileExportXlsx' | 'handleFileNew' | 'handleFileOpen' | 'handleFileSave'> {
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

export function AppMenuFileComponent({ handleFileExportObj, handleFileExportPly, handleFileExportStl, handleFileExportPng, handleFileExportXlsx, handleFileNew, handleFileOpen, handleFileSave, project, renderState, renderStateSet, ButtonProps, MenuItemProps, MenuListProps, MenuProps }: AppMenuFileComponentProps) {
  const { t } = useTranslation(['common', 'app-menu'])

  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const exportMenuItemRef = useRef<HTMLLIElement>(null)

  const [open, setOpen] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)

  const rightMenuProps: Pick<MenuProps, 'anchorOrigin' & 'transformOrigin' & 'sx'> = {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'right',
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
  }

  const closeMenu = useCallback((fn?: () => void) => {
    setOpen(false)
    setExportMenuOpen(false)
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    if (fn) fn()
  }, [])

  const handleExportArrayBuffer = useCallback(async (data: RenderState['exporter'][2]) => {
    if (!data || !(data[1] instanceof ArrayBuffer)) return
    const [exportType, arrayBuffer] = data
    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' })
    await downloadFile(blob, `${project.name}.${exportType}`)
  }, [project.name])

  const handleExportString = useCallback(async (data: RenderState['exporter'][1]) => {
    if (!data) return
    const [exportType, string] = data
    const blob = new Blob([string], { type: 'application/octet-stream' })
    await downloadFile(blob, `${project.name}.${exportType}`)
  }, [project.name])

  const handleExportScreenshot = useCallback(async (data: RenderState['screenshot'][1]) => {
    if (!data) return
    await downloadFile(data, `${project.name}.png`)
  }, [project.name])

  useEffect(() => {
    if (renderState.exporter[1]) {
      renderStateSet({ ...renderState, exporter: [null, null, null] })
      handleExportString(renderState.exporter[1])
    }
  }, [handleExportString, renderState, renderStateSet])

  useEffect(() => {
    if (renderState.exporter[2]) {
      renderStateSet({ ...renderState, exporter: [null, null, null] })
      handleExportArrayBuffer(renderState.exporter[2])
    }
  }, [handleExportArrayBuffer, project.name, renderState, renderStateSet])

  useEffect(() => {
    if (renderState.screenshot[1]) {
      renderStateSet({ ...renderState, screenshot: [false, null] })
      handleExportScreenshot(renderState.screenshot[1])
    }
  }, [handleExportScreenshot, renderState, renderStateSet])

  return (
    <>
      <Button ref={buttonRef} {...ButtonProps} onClick={() => setOpen(true)}>
        <span>{t('app-menu:file')}</span>
      </Button>
      <Menu {...MenuProps} open={open} anchorEl={buttonRef.current} onClose={() => closeMenu()}>
        <MenuList {...MenuListProps}>
          <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleFileNew)}>
            <Typography>{t('app-menu:file.new')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:file.new')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => inputRef.current?.click()}>
            <input
              ref={inputRef}
              accept=".woodcut"
              type="file"
              style={{ display: 'none' }}
              onChange={() => {
                closeMenu()
                handleFileOpen(inputRef.current)
              }}
            />
            <Typography>{t('app-menu:file.open')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:file.open')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} ref={exportMenuItemRef} onClick={() => closeMenu(handleFileSave)}>
            <Typography>{t('app-menu:file.save')}</Typography>
            <Typography ml={1} color="gray">{getAppMenuHotkeyLabel('app-menu:file.save')}</Typography>
          </MenuItem>
          <MenuItem {...MenuItemProps} onClick={() => setExportMenuOpen(true)}>
            <Typography>{t('app-menu:file.export')}</Typography>
            <ChevronRight />
          </MenuItem>
        </MenuList>
      </Menu>
      {exportMenuOpen && (
        <Menu open={exportMenuOpen} anchorEl={exportMenuItemRef.current} {...MenuProps} {...rightMenuProps} onClose={() => setExportMenuOpen(false)}>
          <MenuList {...MenuListProps}>
            <MenuItem disabled={project.cutlists.length === 0} {...MenuItemProps} onClick={() => closeMenu(handleFileExportXlsx)}>
              <Typography>{t('app-menu:file.export.xslx')}</Typography>
            </MenuItem>
            <MenuItem {...MenuItemProps} onClick={() => closeMenu(handleFileExportPng)}>
              <Typography>{t('app-menu:file.export.png')}</Typography>
            </MenuItem>
            {/* <MenuItem disabled={Boolean(renderState.exporter[0])} {...MenuItemProps} onClick={() => closeMenu(handleFileExportGtlf)}>
              <Typography>{t('app-menu:file.export.gtlf')}</Typography>
            </MenuItem> */}
            <MenuItem disabled={Boolean(renderState.exporter[0])} {...MenuItemProps} onClick={() => closeMenu(handleFileExportObj)}>
              <Typography>{t('app-menu:file.export.obj')}</Typography>
            </MenuItem>
            <MenuItem disabled={Boolean(renderState.exporter[0])} {...MenuItemProps} onClick={() => closeMenu(handleFileExportPly)}>
              <Typography>{t('app-menu:file.export.ply')}</Typography>
            </MenuItem>
            <MenuItem disabled={Boolean(renderState.exporter[0])} {...MenuItemProps} onClick={() => closeMenu(handleFileExportStl)}>
              <Typography>{t('app-menu:file.export.stl')}</Typography>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  )
}
