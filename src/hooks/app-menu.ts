import { assertIsBoard, assertIsComponent, assertIsNonNullable, assertIsProject, assertIsString, boardAddCut, boardChange, boardGetCut, check, componentAddBoard, componentChange, componentGetBoard, cutChange, GridAxis, Project, projectAddComponent, projectGetActive, projectGetComponent, ProjectState, RenderState, useProjectAdd, useProjectRemove } from '@woodcutapp/woodcutapp'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { downloadFile } from '@/functions/util'
import { alertAdd, clipboardSet, findSet, historyRedo, historyUndo, useAppStore } from '@/store'

export interface UseAppMenuProps {
  exportProject: () => void
  project: Project
  projectSet: (project: Project) => void
  projectState: ProjectState
  projectStateSet: (projectState: ProjectState) => void
  renderState: RenderState
  renderStateSet: (renderState: RenderState) => void
}

export interface UseAppMenuReturn {
  handleEditCopy: () => void
  handleEditDelete: () => void
  handleEditDuplicate: () => void
  handleEditHistoryRedo: () => void
  handleEditHistoryUndo: () => void
  handleEditNew: () => void
  handleEditPaste: () => void
  handleEditTransform: () => void
  handleEditVisibilityAllHide: () => void
  handleEditVisibilityAllShow: () => void
  handleEditVisibilityToggle: () => void
  handleFileExportGtlf: () => void
  handleFileExportObj: () => void
  handleFileExportPly: () => void
  handleFileExportStl: () => void
  handleFileExportPng: () => void
  handleFileExportXlsx: () => void
  handleFileNew: () => void
  handleFileOpen: (input: HTMLInputElement | null) => void
  handleFileSave: () => void
  handleSelectionFind: () => void
  handleSelectionNext: () => void
  handleSelectionPrevious: () => void
  handleSelectionSelectAll: () => void
  handleSelectionSelectNone: () => void
  handleViewActive: () => void
  handleViewActiveDimension: () => void
  handleViewActiveInfo: () => void
  handleViewActivePosition: () => void
  handleViewActiveRotation: () => void
  handleViewCamera: () => void
  handleViewDrawer: () => void
  handleViewFocused: () => void
  handleViewGrid: () => void
  handleViewGridAxis: (axisIndex: 2 | 3 | 4, axis: GridAxis) => void
  handleViewRuler: () => void
  handleViewRulerPointA: () => void
  handleViewRulerPointB: () => void
  handleViewRulerPointClear: () => void
  handleViewRulerSnap: () => void
}

export function useAppMenu(props: UseAppMenuProps): UseAppMenuReturn {
  const clipboard = useAppStore(state => state.clipboard)
  const { t } = useTranslation(['common', 'app-menu'])

  const {
    exportProject,
    project,
    projectSet,
    projectState,
    projectStateSet,
    renderState,
    renderStateSet,
  } = props

  const [activeType, indexes] = projectGetActive(projectState.active)

  const add = useProjectAdd({ project, projectSet, projectState, projectStateSet })
  const remove = useProjectRemove({ project, projectSet, projectState, projectStateSet })

  const handleEditCopy = useCallback(() => {
    switch (activeType) {
      case 'component': {
        const component = projectGetComponent(project, ...indexes)
        clipboardSet(component)
        break
      }
      case 'board': {
        const board = componentGetBoard(project, ...indexes)
        clipboardSet(board)
        break
      }
      case 'cut': {
        const cut = boardGetCut(project, ...indexes)
        clipboardSet(cut)
        break
      }
    }
  }, [activeType, indexes, project])

  const handleEditDelete = useCallback(() => {
    if (projectState.selected[0].length > 0 || projectState.selected[1].length > 0 || projectState.selected[2].length > 0) {
      projectSet({
        ...project,
        components: project.components.filter((_, componentIndex) => !projectState.selected[0].includes(componentIndex)).map((component, componentIndex) => {
          return {
            ...component,
            boards: component.boards.filter((_, boardIndex) => !projectState.selected[1].some(([selectedComponentIndex, selectedBoardIndex]) => selectedComponentIndex === componentIndex && selectedBoardIndex === boardIndex)).map((board, boardIndex) => {
              return {
                ...board,
                cuts: board.cuts.filter((_, cutIndex) => !projectState.selected[2].some(([selectedComponentIndex, selectedBoardIndex, selectedCutIndex]) => selectedComponentIndex === componentIndex && selectedBoardIndex === boardIndex && selectedCutIndex === cutIndex)),
              }
            }),
          }
        }),
      })
      projectStateSet({
        ...projectState,
        selected: [[], [], []],
      })
    }
    else {
      switch (activeType) {
        case 'component': {
          remove(['component', ...indexes])
          projectStateSet({ ...projectState, active: [false, [null, null, null], null] })
          break
        }
        case 'board': {
          remove(['board', ...indexes])
          projectStateSet({ ...projectState, active: [false, [null, null, null], null] })
          break
        }
        case 'cut': {
          remove(['cut', ...indexes])
          projectStateSet({ ...projectState, active: [false, [null, null, null], null] })
          break
        }
      }
    }
  }, [activeType, indexes, project, projectSet, projectState, projectStateSet, remove])

  const handleEditDuplicate = useCallback(() => {
    switch (activeType) {
      case 'component': {
        const component = projectGetComponent(project, ...indexes)
        projectSet(projectAddComponent(project, {
          ...component,
          name: t('common:copy', { name: component.name }),
        }))
        break
      }
      case 'board': {
        const board = componentGetBoard(project, ...indexes)
        projectSet(componentAddBoard(project, indexes[0], {
          ...board,
          name: t('common:copy', { name: board.name }),
        }))
        break
      }
      case 'cut': {
        const cut = boardGetCut(project, ...indexes)
        projectSet(boardAddCut(project, indexes[0], indexes[1], {
          ...cut,
          name: t('common:copy', { name: cut.name }),
        }))
        break
      }
    }
  }, [activeType, indexes, project, projectSet, t])

  const handleEditHistoryRedo = useCallback(() => {
    projectStateSet({
      ...projectState,
      active: [
        projectState.active[0],
        [null, null, null],
        null,
      ],
      expanded: [
        [],
        [],
      ],
      selected: [[], [], []],
    })
    historyRedo()
  }, [projectState, projectStateSet])

  const handleEditHistoryUndo = useCallback(() => {
    projectStateSet({
      ...projectState,
      active: [
        projectState.active[0],
        [null, null, null],
        null,
      ],
      expanded: [
        [],
        [],
      ],
      selected: [[], [], []],
    })
    historyUndo()
  }, [projectState, projectStateSet])

  const handleEditNew = useCallback(() => {
    try {
      switch (activeType) {
        case 'board': {
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight

          const cutAddMenuEstimatedWidth = 100
          const cutAddMenuEstimatedHeight = 500

          const clientX = (viewportWidth / 2) - (cutAddMenuEstimatedWidth / 2)
          const clientY = (viewportHeight / 2) - (cutAddMenuEstimatedHeight / 2)

          projectStateSet({
            ...projectState,
            menu: [true, [clientX, clientY]],
          })
          break
        }
        case 'component': {
          if (typeof indexes[0] !== 'number') return
          add(['board', indexes[0]])
          break
        }
        default: {
          add(['component'])
          break
        }
      }
    }
    catch {
      add(['component'])
    }
  }, [activeType, add, indexes, projectState, projectStateSet])

  const handleEditPaste = useCallback(() => {
    if (clipboard === null) return
    if (check(clipboard, assertIsComponent)) {
      projectSet(projectAddComponent(project, {
        ...clipboard,
        name: t('common:copy', { name: clipboard.name }),
      }))
    }
    else if (check(clipboard, assertIsBoard)) {
      if (!activeType) return
      projectSet(componentAddBoard(project, indexes[0], {
        ...clipboard,
        name: t('common:copy', { name: clipboard.name }),
      }))
    }
    else {
      if (!activeType || activeType === 'component') return
      projectSet(boardAddCut(project, indexes[0], indexes[1], {
        ...clipboard,
        name: t('common:copy', { name: clipboard.name }),
      }))
    }
  }, [activeType, clipboard, indexes, project, projectSet, t])

  const handleEditTransform = useCallback(() => {
    projectStateSet({
      ...projectState,
      transform: !projectState.transform,
    })
  }, [projectState, projectStateSet])

  const handleEditVisibilityAllHide = useCallback(() => {
    projectSet(project.components.reduce((project, component, componentIndex) => {
      project.components[componentIndex].visible = false
      component.boards.forEach((board, boardIndex) => {
        project.components[componentIndex].boards[boardIndex].visible = false
        board.cuts.forEach((_, cutIndex) => {
          project.components[componentIndex].boards[boardIndex].cuts[cutIndex].visible = false
        })
      })
      return project
    }, { ...project }))
  }, [project, projectSet])

  const handleEditVisibilityAllShow = useCallback(() => {
    projectSet(project.components.reduce((project, component, componentIndex) => {
      project.components[componentIndex].visible = true
      component.boards.forEach((board, boardIndex) => {
        project.components[componentIndex].boards[boardIndex].visible = true
        board.cuts.forEach((_, cutIndex) => {
          project.components[componentIndex].boards[boardIndex].cuts[cutIndex].visible = true
        })
      })
      return project
    }, { ...project }))
  }, [project, projectSet])

  const handleEditVisibilityToggle = useCallback(() => {
    switch (activeType) {
      case 'component': {
        const component = projectGetComponent(project, ...indexes)
        projectSet(componentChange(project, ...indexes, {
          ...component,
          visible: !component.visible,
        }))
        break
      }
      case 'board': {
        const board = componentGetBoard(project, ...indexes)
        projectSet(boardChange(project, ...indexes, {
          ...board,
          visible: !board.visible,
        }))
        break
      }
      case 'cut': {
        const cut = boardGetCut(project, ...indexes)
        projectSet(cutChange(project, ...indexes, {
          ...cut,
          visible: !cut.visible,
        }))
        break
      }
    }
  }, [activeType, indexes, project, projectSet])

  const handleFileExportGtlf = useCallback(() => {
    try {
      renderStateSet({
        ...renderState,
        exporter: [
          'gtlf',
          null,
          null,
        ],
      })
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error.'
      alertAdd(message, 'error')
    }
  }, [renderState, renderStateSet])

  const handleFileExportObj = useCallback(() => {
    try {
      renderStateSet({
        ...renderState,
        exporter: [
          'obj',
          null,
          null,
        ],
      })
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error.'
      alertAdd(message, 'error')
    }
  }, [renderState, renderStateSet])

  const handleFileExportPly = useCallback(() => {
    try {
      renderStateSet({
        ...renderState,
        exporter: [
          'ply',
          null,
          null,
        ],
      })
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error.'
      alertAdd(message, 'error')
    }
  }, [renderState, renderStateSet])

  const handleFileExportStl = useCallback(() => {
    try {
      renderStateSet({
        ...renderState,
        exporter: [
          'stl',
          null,
          null,
        ],
      })
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error.'
      alertAdd(message, 'error')
    }
  }, [renderState, renderStateSet])

  const handleFileExportPng = useCallback(() => {
    try {
      renderStateSet({
        ...renderState,
        screenshot: [
          true,
          null,
        ],
      })
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error.'
      alertAdd(message, 'error')
    }
  }, [renderState, renderStateSet])

  const handleFileExportXlsx = useCallback(async () => {
    try {
      await exportProject()
      alertAdd('Exported project to XLSX', 'success')
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error.'
      alertAdd(message, 'error')
    }
  }, [exportProject])

  const handleFileNew = useCallback(() => {
    window.open('/app', '_blank')
  }, [])

  const handleFileOpen = useCallback((input: HTMLInputElement | null) => {
    try {
      assertIsNonNullable(input)
      assertIsNonNullable(input.files)

      const file = input.files[0]
      assertIsNonNullable(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        assertIsNonNullable(event.target)
        assertIsString(event.target.result)
        const project = JSON.parse(event.target.result)
        assertIsProject(project)
        projectSet(project)
        alertAdd(`Opened project: ${project.name}`, 'success')
      }

      reader.readAsText(file)
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error.'
      alertAdd(message, 'error')
    }
  }, [projectSet])

  const handleFileSave = useCallback(async () => {
    try {
      const data = JSON.stringify(project)
      const blob = new Blob([data], { type: 'application/json' })
      await downloadFile(blob, `${project.name}.woodcut`)
      alertAdd('Project saved', 'success')
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error.'
      alertAdd(message, 'error')
    }
  }, [project])

  const handleSelectionFind = useCallback(() => {
    findSet(true)
  }, [])

  const handleSelectionNext = useCallback(() => {
    switch (activeType) {
      case 'component': {
        const nextComponent = project.components[indexes[0] + 1]
        const nextBoard = project.components[indexes[0]].boards[0]
        if (nextBoard) {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [indexes[0], 0, null],
              projectState.active[2],
            ],
            expanded: [
              [...projectState.expanded[0].filter(componentIndex => componentIndex !== indexes[0]), indexes[0]],
              projectState.expanded[1],
            ],
          })
        }
        else if (nextComponent) {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [indexes[0] + 1, null, null],
              projectState.active[2],
            ],
          })
        }
        else {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [0, null, null],
              projectState.active[2],
            ],
          })
        }
        break
      }
      case 'board': {
        const nextComponent = project.components[indexes[0] + 1]
        const nextBoard = project.components[indexes[0]].boards[indexes[1] + 1]
        const nextCut = project.components[indexes[0]].boards[indexes[1]].cuts[0]
        if (nextCut) {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [indexes[0], indexes[1], 0],
              projectState.active[2],
            ],
            expanded: [
              [...projectState.expanded[0].filter(componentIndex => componentIndex !== indexes[0]), indexes[0]],
              [...projectState.expanded[1].filter(([componentIndex, boardIndex]) => componentIndex !== indexes[0] || boardIndex !== indexes[1]), [indexes[0], indexes[1]]],
            ],
          })
        }
        else if (nextBoard) {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [indexes[0], indexes[1] + 1, null],
              projectState.active[2],
            ],
            expanded: [
              [...projectState.expanded[0].filter(componentIndex => componentIndex !== indexes[0]), indexes[0]],
              projectState.expanded[1],
            ],
          })
        }
        else if (nextComponent) {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [indexes[0] + 1, null, null],
              projectState.active[2],
            ],
          })
        }
        else {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [0, null, null],
              projectState.active[2],
            ],
          })
        }
        break
      }
      case 'cut': {
        const nextComponent = project.components[indexes[0] + 1]
        const nextBoard = project.components[indexes[0]].boards[indexes[1] + 1]
        const nextCut = project.components[indexes[0]].boards[indexes[1]].cuts[indexes[2] + 1]
        if (nextCut) {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [indexes[0], indexes[1], indexes[2] + 1],
              projectState.active[2],
            ],
            expanded: [
              [...projectState.expanded[0].filter(componentIndex => componentIndex !== indexes[0]), indexes[0]],
              [...projectState.expanded[1].filter(([componentIndex, boardIndex]) => componentIndex !== indexes[0] || boardIndex !== indexes[1]), [indexes[0], indexes[1]]],
            ],
          })
        }
        else if (nextBoard) {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [indexes[0], indexes[1] + 1, null],
              projectState.active[2],
            ],
            expanded: [
              [...projectState.expanded[0].filter(componentIndex => componentIndex !== indexes[0]), indexes[0]],
              projectState.expanded[1],
            ],
          })
        }
        else if (nextComponent) {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [indexes[0] + 1, null, null],
              projectState.active[2],
            ],
          })
        }
        else {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [0, null, null],
              projectState.active[2],
            ],
          })
        }
        break
      }
      default: {
        projectStateSet({
          ...projectState,
          active: [
            projectState.active[0],
            [0, null, null],
            projectState.active[2],
          ],
        })
        break
      }
    }
  }, [activeType, indexes, project, projectState, projectStateSet])

  const handleSelectionPrevious = useCallback(() => {
    switch (activeType) {
      case 'component': {
        const previousComponentIndex = indexes[0] - 1
        const previousComponent = project.components[previousComponentIndex]
        if (previousComponent) {
          const previousBoardIndex = previousComponent.boards.length - 1
          const previousBoard = project.components[previousComponentIndex].boards[previousBoardIndex]
          if (previousBoard) {
            const previousCutIndex = previousBoard.cuts.length - 1
            const previousCut = project.components[previousComponentIndex].boards[previousBoardIndex].cuts[previousCutIndex]
            if (previousCut) {
              projectStateSet({
                ...projectState,
                active: [
                  projectState.active[0],
                  [previousComponentIndex, previousBoardIndex, previousCutIndex],
                  projectState.active[2],
                ],
                expanded: [
                  [...projectState.expanded[0].filter(componentIndex => componentIndex !== previousComponentIndex), previousComponentIndex],
                  [...projectState.expanded[1].filter(([componentIndex, boardIndex]) => componentIndex !== previousComponentIndex || boardIndex !== previousBoardIndex), [previousComponentIndex, previousBoardIndex]],
                ],
              })
            }
            else {
              projectStateSet({
                ...projectState,
                active: [
                  projectState.active[0],
                  [previousComponentIndex, previousBoardIndex, null],
                  projectState.active[2],
                ],
                expanded: [
                  [...projectState.expanded[0].filter(componentIndex => componentIndex !== previousComponentIndex), previousComponentIndex],
                  projectState.expanded[1],
                ],
              })
            }
          }
          else {
            projectStateSet({
              ...projectState,
              active: [
                projectState.active[0],
                [previousComponentIndex, null, null],
                projectState.active[2],
              ],
            })
          }
        }
        else {
          const previousBoard = project.components[project.components.length - 1].boards[project.components[project.components.length - 1].boards.length - 1]
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [project.components.length - 1, project.components[project.components.length - 1].boards.length - 1, previousBoard.cuts.length - 1],
              projectState.active[2],
            ],
            expanded: [
              [...projectState.expanded[0].filter(componentIndex => componentIndex !== project.components.length - 1), project.components.length - 1],
              [...projectState.expanded[1].filter(([componentIndex, boardIndex]) => componentIndex !== project.components.length - 1 || boardIndex !== project.components[project.components.length - 1].boards.length - 1), [project.components.length - 1, project.components[project.components.length - 1].boards.length - 1]],
            ],
          })
        }
        break
      }
      case 'board': {
        const previousBoardIndex = indexes[1] - 1
        const previousBoard = project.components[indexes[0]].boards[previousBoardIndex]
        if (previousBoard) {
          const previousCutIndex = previousBoard.cuts.length - 1
          const previousCut = project.components[indexes[0]].boards[previousBoardIndex].cuts[previousCutIndex]
          if (previousCut) {
            projectStateSet({
              ...projectState,
              active: [
                projectState.active[0],
                [indexes[0], previousBoardIndex, previousCutIndex],
                projectState.active[2],
              ],
              expanded: [
                [...projectState.expanded[0].filter(componentIndex => componentIndex !== indexes[0]), indexes[0]],
                [...projectState.expanded[1].filter(([componentIndex, boardIndex]) => componentIndex !== indexes[0] || boardIndex !== previousBoardIndex), [indexes[0], previousBoardIndex]],
              ],
            })
          }
          else {
            projectStateSet({
              ...projectState,
              active: [
                projectState.active[0],
                [indexes[0], previousBoardIndex, null],
                projectState.active[2],
              ],
              expanded: [
                [...projectState.expanded[0].filter(componentIndex => componentIndex !== indexes[0]), indexes[0]],
                projectState.expanded[1],
              ],
            })
          }
        }
        else {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [indexes[0], null, null],
              projectState.active[2],
            ],
          })
        }
        break
      }
      case 'cut': {
        const previousCutIndex = indexes[2] - 1
        const previousCut = project.components[indexes[0]].boards[indexes[1]].cuts[previousCutIndex]
        if (previousCut) {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [indexes[0], indexes[1], previousCutIndex],
              projectState.active[2],
            ],
            expanded: [
              [...projectState.expanded[0].filter(componentIndex => componentIndex !== indexes[0]), indexes[0]],
              [...projectState.expanded[1].filter(([componentIndex, boardIndex]) => componentIndex !== indexes[0] || boardIndex !== indexes[1]), [indexes[0], indexes[1]]],
            ],
          })
        }
        else {
          projectStateSet({
            ...projectState,
            active: [
              projectState.active[0],
              [indexes[0], indexes[1], null],
              projectState.active[2],
            ],
          })
        }
        break
      }
      default: {
        const previousComponent = project.components[project.components.length - 1]
        const previousBoard = project.components[project.components.length - 1].boards[previousComponent.boards.length - 1]
        projectStateSet({
          ...projectState,
          active: [
            projectState.active[0],
            [project.components.length - 1, previousComponent.boards.length - 1, previousBoard.cuts.length - 1],
            projectState.active[2],
          ],
        })
        break
      }
    }
  }, [activeType, indexes, project.components, projectState, projectStateSet])

  const handleSelectionSelectAll = useCallback(() => {
    const selectedComponents: number[] = []
    const selectedBoards: [number, number][] = []
    const selectedCuts: [number, number, number][] = []
    for (const [componentIndex, component] of project.components.entries()) {
      selectedComponents.push(componentIndex)
      for (const [boardIndex, board] of component.boards.entries()) {
        selectedBoards.push([componentIndex, boardIndex])
        for (const [cutIndex] of board.cuts.entries()) {
          selectedCuts.push([componentIndex, boardIndex, cutIndex])
        }
      }
    }

    projectStateSet({
      ...projectState,
      selected: [selectedComponents, selectedBoards, selectedCuts],
    })
  }, [project.components, projectState, projectStateSet])

  const handleSelectionSelectNone = useCallback(() => {
    projectStateSet({
      ...projectState,
      selected: [[], [], []],
    })
  }, [projectState, projectStateSet])

  const handleViewActive = useCallback(() => {
    projectStateSet({
      ...projectState,
      active: [
        !projectState.active[0],
        projectState.active[1],
        projectState.active[2] || 0,
      ],
    })
  }, [projectState, projectStateSet])

  const handleViewActiveDimension = useCallback(() => {
    projectStateSet({
      ...projectState,
      active: [
        true,
        projectState.active[1],
        1,
      ],
    })
  }, [projectState, projectStateSet])

  const handleViewActiveInfo = useCallback(() => {
    projectStateSet({
      ...projectState,
      active: [
        true,
        projectState.active[1],
        0,
      ],
    })
  }, [projectState, projectStateSet])

  const handleViewActivePosition = useCallback(() => {
    projectStateSet({
      ...projectState,
      active: [
        true,
        projectState.active[1],
        2,
      ],
    })
  }, [projectState, projectStateSet])

  const handleViewActiveRotation = useCallback(() => {
    projectStateSet({
      ...projectState,
      active: [
        true,
        projectState.active[1],
        3,
      ],
    })
  }, [projectState, projectStateSet])

  const handleViewCamera = useCallback(() => {
    const currentCamera = renderState.camera[0]
    renderStateSet({
      ...renderState,
      camera: [
        currentCamera === 'orthographic' ? 'perspective' : 'orthographic',
        renderState.camera[1],
      ],
    })
  }, [renderState, renderStateSet])

  const handleViewDrawer = useCallback(() => {
    projectStateSet({
      ...projectState,
      drawer: [
        !projectState.drawer[0],
        projectState.drawer[0] === false ? projectState.drawer[1] : null,
      ],
    })
  }, [projectState, projectStateSet])

  const handleViewFocused = useCallback(() => {
    projectStateSet({
      ...projectState,
      focused: !projectState.focused,
    })
    alertAdd(t(!projectState.focused ? 'app-menu:view.focused.enabled' : 'app-menu:view.focused.disabled'), 'info')
  }, [projectState, projectStateSet, t])

  const handleViewGrid = useCallback(() => {
    renderStateSet({
      ...renderState,
      grid: [
        !renderState.grid[0],
        renderState.grid[1],
        renderState.grid[2],
        renderState.grid[3],
        renderState.grid[4],
      ],
    })
  }, [renderState, renderStateSet])

  const handleViewGridAxis = useCallback((axisIndex: 2 | 3 | 4, axis: GridAxis) => {
    const grid: RenderState['grid'] = [...renderState.grid]
    grid[axisIndex] = axis

    renderStateSet({
      ...renderState,
      grid,
    })
  }, [renderState, renderStateSet])

  const handleViewRuler = useCallback(() => {
    renderStateSet({
      ...renderState,
      ruler: [
        !renderState.ruler[0],
        renderState.ruler[1],
        renderState.ruler[2],
        renderState.ruler[3],
        renderState.ruler[3],
      ],
    })
  }, [renderState, renderStateSet])

  const handleViewRulerSnap = useCallback(() => {
    renderStateSet({
      ...renderState,
      ruler: [
        renderState.ruler[0],
        !renderState.ruler[1],
        renderState.ruler[2],
        renderState.ruler[3],
        renderState.ruler[4],
      ],
    })
  }, [renderState, renderStateSet])

  const handleViewRulerPointA = useCallback(() => {
    renderStateSet({
      ...renderState,
      ruler: [
        renderState.ruler[0],
        renderState.ruler[1],
        renderState.ruler[2],
        renderState.ruler[2],
        renderState.ruler[4],
      ],
    })
  }, [renderState, renderStateSet])

  const handleViewRulerPointB = useCallback(() => {
    renderStateSet({
      ...renderState,
      ruler: [
        renderState.ruler[0],
        renderState.ruler[1],
        renderState.ruler[2],
        renderState.ruler[3],
        renderState.ruler[2],
      ],
    })
  }, [renderState, renderStateSet])

  const handleViewRulerPointClear = useCallback(() => {
    renderStateSet({
      ...renderState,
      ruler: [
        renderState.ruler[0],
        renderState.ruler[1],
        renderState.ruler[2],
        null,
        null,
      ],
    })
  }, [renderState, renderStateSet])

  return {
    handleEditCopy,
    handleEditDelete,
    handleEditDuplicate,
    handleEditHistoryRedo,
    handleEditHistoryUndo,
    handleEditNew,
    handleEditPaste,
    handleEditTransform,
    handleEditVisibilityAllHide,
    handleEditVisibilityAllShow,
    handleEditVisibilityToggle,
    handleFileExportGtlf,
    handleFileExportObj,
    handleFileExportPly,
    handleFileExportStl,
    handleFileExportPng,
    handleFileExportXlsx,
    handleFileNew,
    handleFileOpen,
    handleFileSave,
    handleSelectionFind,
    handleSelectionNext,
    handleSelectionPrevious,
    handleSelectionSelectAll,
    handleSelectionSelectNone,
    handleViewActive,
    handleViewActiveDimension,
    handleViewActiveInfo,
    handleViewActivePosition,
    handleViewActiveRotation,
    handleViewCamera,
    handleViewDrawer,
    handleViewFocused,
    handleViewGrid,
    handleViewGridAxis,
    handleViewRuler,
    handleViewRulerPointA,
    handleViewRulerPointB,
    handleViewRulerPointClear,
    handleViewRulerSnap,
  }
}
