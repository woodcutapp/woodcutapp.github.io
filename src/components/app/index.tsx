import { Stack, useTheme } from '@mui/material'
import { calculate_cutlist, export_cutlist, export_project } from '@woodcutapp/wasm'
import { assertIsBoard, assertIsCutlist, check, cutlistChange, generateProjectState, generateRenderState, getWoodImage, ProjectComponent, projectGetCutlist, type ProjectState, type RenderState } from '@woodcutapp/woodcutapp'
import { useCallback, useEffect, useState } from 'react'

import { AlertsComponent } from '@/components/app/alerts'
import { AppMenuComponent } from '@/components/app/app-menu'
import { FindComponent } from '@/components/app/find'
import { downloadFile } from '@/functions/util'
import { historyAdd, projectSet, useAppStore } from '@/store'

export function AppComponent() {
  const project = useAppStore(state => state.project)

  const { palette } = useTheme()

  const [projectState, projectStateSet] = useState<ProjectState>(generateProjectState())
  const [renderState, renderStateSet] = useState<RenderState>({
    ...generateRenderState(),
    viewcube: [true, false, palette.primary.main, palette.primary.contrastText, 'bottom', 50, 50, 1],
  })

  const calculateCutlist = useCallback(async (cutlistIndex: number) => {
    try {
      const cutlist = projectGetCutlist(project, cutlistIndex)

      if (cutlist.input.stock.length === 0) throw Error('No cutlist found.')
      if (cutlist.input.stock.length === 0) throw Error('No stock found.')
      if (cutlist.input.boards.length === 0) throw Error('No boards found.')

      cutlist.options.seed = Math.floor(Math.random() * 1000000)

      // eslint-disable-next-line no-console
      console.log('Calculating cutlist with options:', cutlist)

      const result: unknown = await calculate_cutlist(cutlist)
      if (check(result, assertIsCutlist)) projectSet(cutlistChange(project, cutlistIndex, result))
      else if (check(result, assertIsBoard)) throw Error(`Unable to fit board: ${result.name}`)
      else if (result instanceof Error) throw result
      else throw Error('Unknown error.')
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      alert(`Error: ${message}`)
    }
  }, [project])

  const exportCutlist = useCallback(async (cutlistIndex: number) => {
    const cutlist = projectGetCutlist(project, cutlistIndex)

    if (cutlist.output.length === 0) throw Error('No cutlist found.')

    const woodImage = getWoodImage(cutlist.boardType.type)
    const image = await fetch(woodImage).then(response => response.arrayBuffer())
    const result = export_cutlist(cutlist, project.settings.measurement, new Uint8Array(image)) as Uint8Array<ArrayBuffer>

    const blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    void downloadFile(blob, `${cutlist.name}.xlsx`)
  }, [project])

  const exportProject = useCallback(async () => {
    const images: Uint8Array[] = []

    for (const cutlist of project.cutlists) {
      const woodImage = getWoodImage(cutlist.boardType.type)
      const image = await fetch(woodImage).then(response => response.arrayBuffer())
      images.push(new Uint8Array(image))
    }

    const result = export_project(project, images) as Uint8Array<ArrayBuffer>
    const blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    await downloadFile(blob, `${project.name}.xlsx`)
  }, [project])

  useEffect(() => {
    if (project.settings.bounds !== renderState.bounds) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      renderStateSet({ ...renderState, bounds: project.settings.bounds })
    }
  }, [project, renderState])

  useEffect(() => {
    if (project.settings.measurement !== renderState.grid[1]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      renderStateSet({
        ...renderState,
        grid: [
          renderState.grid[0],
          project.settings.measurement,
          renderState.grid[2],
          renderState.grid[3],
          renderState.grid[4],
        ],
      })
    }
  }, [project, renderState])

  useEffect(() => {
    const position: [number, number, number] = [0, -(project.settings.bounds * 2), (project.settings.bounds / 2)]
    // eslint-disable-next-line react-hooks/set-state-in-effect
    renderStateSet(state => ({
      ...state,
      camera: [
        state.camera[0],
        position,
      ],
      controls: [
        state.controls[0],
        state.controls[1],
        state.controls[2],
        state.controls[3],
        position,
        state.controls[5],
      ],
    }))
  }, [project.settings.bounds])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    renderStateSet(state => ({
      ...state,
      viewcube: [
        state.viewcube[0],
        state.viewcube[1],
        palette.primary.main,
        palette.primary.contrastText,
        state.viewcube[4],
        state.viewcube[5],
        state.viewcube[6],
        state.viewcube[7],
      ],
    }))
  }, [palette.primary.contrastText, palette.primary.main])

  useEffect(() => {
    historyAdd(project)
  }, [project])

  return (
    <Stack sx={{ height: '100%' }}>
      <AppMenuComponent
        exportProject={exportProject}
        project={project}
        projectSet={projectSet}
        projectState={projectState}
        projectStateSet={projectStateSet}
        renderState={renderState}
        renderStateSet={renderStateSet}
      />
      <ProjectComponent
        calculateCutlist={calculateCutlist}
        exportCutlist={exportCutlist}
        project={project}
        projectSet={projectSet}
        projectState={projectState}
        projectStateSet={projectStateSet}
        renderState={renderState}
        renderStateSet={renderStateSet}
      />
      <FindComponent
        project={project}
        projectSet={projectSet}
        projectState={projectState}
        projectStateSet={projectStateSet}
        renderState={renderState}
        renderStateSet={renderStateSet}
      />
      <AlertsComponent />
    </Stack>
  )
}
