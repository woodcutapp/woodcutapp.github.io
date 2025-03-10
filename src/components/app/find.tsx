import { Button, Card, CardActionArea, CardContent, CardHeader, Dialog, DialogActions, DialogContent, Stack, TextField } from '@mui/material'
import { boardGetCut, BoardSummary, componentGetBoard, ComponentSummary, CutSummary, Project, projectGetComponent, ProjectState, RenderState } from '@woodcutapp/woodcutapp'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { findSet, useAppStore } from '@/store'

type Result = ['component', [number]] | ['board', [number, number]] | ['cut', [number, number, number]]

export interface FindComponentProps {
  project: Project
  projectSet: (project: Project) => void
  projectState: ProjectState
  projectStateSet: (projectState: ProjectState) => void
  renderState: RenderState
  renderStateSet: (renderState: RenderState) => void
}

export function FindComponent({ project, projectState, projectStateSet }: FindComponentProps) {
  const find = useAppStore(state => state.find)

  const { t } = useTranslation(['common'])

  const [text, setText] = useState('')
  const [results, setResults] = useState<Result[]>([])

  const handleClose = useCallback(() => {
    findSet(false)
    setText('')
    setResults([])
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  }, [])

  const handleFind = useCallback(() => {
    const results: Result[] = []

    for (const [componentIndex, component] of project.components.entries()) {
      if (component.name.toLowerCase().includes(text.toLowerCase())) {
        results.push(['component', [componentIndex]])
      }
      for (const [boardIndex, board] of component.boards.entries()) {
        if (board.name.toLowerCase().includes(text.toLowerCase())) {
          results.push(['board', [componentIndex, boardIndex]])
        }
        for (const [cutIndex, cut] of board.cuts.entries()) {
          if (cut.name.toLowerCase().includes(text.toLowerCase())) {
            results.push(['cut', [componentIndex, boardIndex, cutIndex]])
          }
        }
      }
    }

    setResults(results)
  }, [project.components, text])

  const handleSelect = useCallback(([type, indexes]: Result) => {
    switch (type) {
      case 'component': {
        projectStateSet({
          ...projectState,
          active: [
            true,
            [indexes[0], null, null],
            projectState.active[2] || 0,
          ],
        })
        break
      }
      case 'board': {
        projectStateSet({
          ...projectState,
          active: [
            true,
            [indexes[0], indexes[1], null],
            projectState.active[2] || 0,
          ],
          expanded: [
            [...projectState.expanded[0].filter(componentIndex => componentIndex !== indexes[0]), indexes[0]],
            projectState.expanded[1],
          ],
        })
        break
      }
      case 'cut': {
        projectStateSet({
          ...projectState,
          active: [
            true,
            [indexes[0], indexes[1], indexes[2]],
            projectState.active[2] || 0,
          ],
          expanded: [
            [...projectState.expanded[0].filter(componentIndex => componentIndex !== indexes[0]), indexes[0]],
            [...projectState.expanded[1].filter(([componentIndex, boardIndex]) => componentIndex !== indexes[0] || boardIndex !== indexes[1]), [indexes[0], indexes[1]]],
          ],
        })
        break
      }
    }
    findSet(false)
    setText('')
    setResults([])
  }, [projectState, projectStateSet])

  return (
    <Dialog
      open={find}
      maxWidth={'sm'}
      fullWidth
      disableRestoreFocus
      onClose={handleClose}
    >
      <DialogContent>
        <Stack spacing={1}>
          <TextField
            autoFocus
            fullWidth
            label={t('common:find')}
            value={text}
            variant={'outlined'}
            onChange={e => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFind()
              }
            }}
          />
          {results.map(([type, indexes]) => {
            switch (type) {
              case 'component': {
                const component = projectGetComponent(project, indexes[0])
                return (
                  <Card key={`${indexes[0]}`} variant={'outlined'}>
                    <CardActionArea onClick={() => handleSelect([type, indexes])}>
                      <CardHeader title={`${component.name}`} />
                      <CardContent sx={{ pt: 0 }}>
                        <ComponentSummary
                          componentIndex={indexes[0]}
                          project={project}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                )
              }
              case 'board': {
                const component = projectGetComponent(project, indexes[0])
                const board = componentGetBoard(project, indexes[0], indexes[1])
                return (
                  <Card key={`${indexes[0]}-${indexes[1]}`} variant={'outlined'}>
                    <CardActionArea onClick={() => handleSelect([type, indexes])}>
                      <CardHeader title={`${component.name} > ${board.name}`} />
                      <CardContent sx={{ pt: 0 }}>
                        <BoardSummary
                          boardIndex={indexes[1]}
                          componentIndex={indexes[0]}
                          project={project}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                )
              }
              case 'cut': {
                const component = projectGetComponent(project, indexes[0])
                const board = componentGetBoard(project, indexes[0], indexes[1])
                const cut = boardGetCut(project, ...indexes)
                return (
                  <Card key={`${indexes[0]}-${indexes[1]}-${indexes[2]}`} variant={'outlined'}>
                    <CardActionArea onClick={() => handleSelect([type, indexes])}>
                      <CardHeader title={`${component.name} > ${board.name} > ${cut.name}`} />
                      <CardContent>
                        <CutSummary
                          cutIndex={indexes[2]}
                          boardIndex={indexes[1]}
                          componentIndex={indexes[0]}
                          project={project}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                )
              }
              default: {
                return null
              }
            }
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {t('common:cancel')}
        </Button>
        <Button variant="contained" onClick={handleFind}>
          {t('common:find')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
