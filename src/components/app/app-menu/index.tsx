import { Home } from '@mui/icons-material'
import { AppBar, Box, Button, ButtonProps, IconButton, MenuItemProps, MenuListProps, MenuProps, Toolbar, Tooltip } from '@mui/material'
import { Link } from '@tanstack/react-router'
import { Project, ProjectState, RenderState } from '@woodcutapp/woodcutapp'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { AppMenuEditComponent } from '@/components/app/app-menu/edit'
import { AppMenuFileComponent } from '@/components/app/app-menu/file'
import { AppMenuSelectionComponent } from '@/components/app/app-menu/selection'
import { AppMenuViewComponent } from '@/components/app/app-menu/view'
import { LogoComponent } from '@/components/icons/logo'
import { useAppMenu } from '@/hooks/app-menu'
import { useAppMenuHotkeys } from '@/hooks/app-menu-hotkeys'

interface AppMenuComponentProps {
  exportProject: () => Promise<void>
  project: Project
  projectSet: (project: Project) => void
  projectState: ProjectState
  projectStateSet: (projectState: ProjectState) => void
  renderState: RenderState
  renderStateSet: (renderState: RenderState) => void
}

export function AppMenuComponent({ exportProject, project, projectSet, projectState, projectStateSet, renderState, renderStateSet }: AppMenuComponentProps) {
  const { t } = useTranslation(['app-menu'])

  const handlers = useAppMenu({
    exportProject,
    project,
    projectSet,
    projectState,
    projectStateSet,
    renderState,
    renderStateSet,
  })

  useAppMenuHotkeys(handlers)

  const ButtonProps: ButtonProps = useMemo(() => ({
    sx: {
      'color': 'primary.contrastText',
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '& span::first-letter': {
        'text-decoration': 'underline',
      },
    },
  }), [])

  const MenuProps: Omit<MenuProps, 'open'> = useMemo(() => ({
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    elevation: 0,
    transitionDuration: 0,
    transformOrigin: {
      vertical: 'top',
      horizontal: 'left',
    },
    PaperProps: {
      square: true,
      sx: ({ palette }) => ({
        borderColor: palette.divider,
        borderStyle: 'solid',
        borderWidth: 1,
        transform: 'translateY(6px)',
      }),
    },
  }), [])

  const MenuListProps: MenuListProps = useMemo(() => ({
    dense: true,
    sx: { p: 0 },
  }), [])

  const MenuItemProps: MenuItemProps = useMemo(() => ({
    sx: {
      minWidth: 256,
      display: 'flex',
      justifyContent: 'space-between',
    },
  }), [])

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar disableGutters variant="dense" sx={{ px: 1.5 }}>
        <LogoComponent sx={{ width: 40, height: 40 }} />
        <Box sx={{ flexGrow: 1 }}>
          <AppMenuFileComponent
            handleFileExportGtlf={handlers.handleFileExportGtlf}
            handleFileExportObj={handlers.handleFileExportObj}
            handleFileExportPly={handlers.handleFileExportPly}
            handleFileExportStl={handlers.handleFileExportStl}
            handleFileExportPng={handlers.handleFileExportPng}
            handleFileExportXlsx={handlers.handleFileExportXlsx}
            handleFileNew={handlers.handleFileNew}
            handleFileOpen={handlers.handleFileOpen}
            handleFileSave={handlers.handleFileSave}
            project={project}
            projectSet={projectSet}
            projectState={projectState}
            projectStateSet={projectStateSet}
            renderState={renderState}
            renderStateSet={renderStateSet}
            ButtonProps={ButtonProps}
            MenuItemProps={MenuItemProps}
            MenuListProps={MenuListProps}
            MenuProps={MenuProps}
          />
          <AppMenuEditComponent
            handleEditCopy={handlers.handleEditCopy}
            handleEditDelete={handlers.handleEditDelete}
            handleEditDuplicate={handlers.handleEditDuplicate}
            handleEditHistoryRedo={handlers.handleEditHistoryRedo}
            handleEditHistoryUndo={handlers.handleEditHistoryUndo}
            handleEditNew={handlers.handleEditNew}
            handleEditPaste={handlers.handleEditPaste}
            handleEditTransform={handlers.handleEditTransform}
            handleEditVisibilityAllHide={handlers.handleEditVisibilityAllHide}
            handleEditVisibilityAllShow={handlers.handleEditVisibilityAllShow}
            handleEditVisibilityToggle={handlers.handleEditVisibilityToggle}
            project={project}
            projectSet={projectSet}
            projectState={projectState}
            projectStateSet={projectStateSet}
            renderState={renderState}
            renderStateSet={renderStateSet}
            ButtonProps={ButtonProps}
            MenuItemProps={MenuItemProps}
            MenuListProps={MenuListProps}
            MenuProps={MenuProps}
          />
          <AppMenuSelectionComponent
            handleSelectionFind={handlers.handleSelectionFind}
            handleSelectionNext={handlers.handleSelectionNext}
            handleSelectionPrevious={handlers.handleSelectionPrevious}
            handleSelectionSelectAll={handlers.handleSelectionSelectAll}
            handleSelectionSelectNone={handlers.handleSelectionSelectNone}
            project={project}
            projectSet={projectSet}
            projectState={projectState}
            projectStateSet={projectStateSet}
            renderState={renderState}
            renderStateSet={renderStateSet}
            ButtonProps={ButtonProps}
            MenuItemProps={MenuItemProps}
            MenuListProps={MenuListProps}
            MenuProps={MenuProps}
          />
          <AppMenuViewComponent
            handleViewActive={handlers.handleViewActive}
            handleViewActiveDimension={handlers.handleViewActiveDimension}
            handleViewActiveInfo={handlers.handleViewActiveInfo}
            handleViewActivePosition={handlers.handleViewActivePosition}
            handleViewActiveRotation={handlers.handleViewActiveRotation}
            handleViewCamera={handlers.handleViewCamera}
            handleViewDrawer={handlers.handleViewDrawer}
            handleViewFocused={handlers.handleViewFocused}
            handleViewGrid={handlers.handleViewGrid}
            handleViewGridAxis={handlers.handleViewGridAxis}
            handleViewRuler={handlers.handleViewRuler}
            handleViewRulerPointA={handlers.handleViewRulerPointA}
            handleViewRulerPointB={handlers.handleViewRulerPointB}
            handleViewRulerPointClear={handlers.handleViewRulerPointClear}
            handleViewRulerSnap={handlers.handleViewRulerSnap}
            project={project}
            projectSet={projectSet}
            projectState={projectState}
            projectStateSet={projectStateSet}
            renderState={renderState}
            renderStateSet={renderStateSet}
            ButtonProps={ButtonProps}
            MenuItemProps={MenuItemProps}
            MenuListProps={MenuListProps}
            MenuProps={MenuProps}
          />
        </Box>
        <Button
          color="secondary"
          component={Link}
          to="/"
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
          variant="contained"
        >
          {t('app-menu:back')}
        </Button>
        <Tooltip title={t('app-menu:back')}>
          <IconButton
            color="inherit"
            component={Link}
            to="/"
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            <Home />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}
