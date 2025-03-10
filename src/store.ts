import { Component, Board, Cut, generateProject, Project } from '@woodcutapp/woodcutapp'
import { create, StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface State {
  alerts: { message: string, severity: string }[]
  clipboard: Component | Board | Cut | null
  find: boolean
  history: {
    items: Project[]
    current?: number
    syncing: boolean
  }
  project: Project
}

const defaultState: State = {
  alerts: [],
  clipboard: null,
  find: false,
  history: {
    items: [],
    current: undefined,
    syncing: false,
  },
  project: generateProject(),
}

const stateCreator: StateCreator<State, [['zustand/persist', unknown]], [], State> = () => (defaultState)

function partialize(state: State): Partial<State> {
  const persistedState: Partial<State> = {}

  persistedState.clipboard = state.clipboard
  // persistedState.history = state.history
  persistedState.project = state.project

  return persistedState
}

window.addEventListener('beforeunload', function () {
  sessionStorage.removeItem('__lock')
})

export const useAppStore = create<State>()(persist(stateCreator, {
  name: 'store',
  storage: createJSONStorage(() => {
    if (sessionStorage.getItem('__lock')) {
      sessionStorage.clear()
    }
    sessionStorage.setItem('__lock', '1')
    return sessionStorage
  }),
  partialize,
  version: 1,
}))

export function alertAdd(message: string, severity: string) {
  useAppStore.setState(state => ({ alerts: [...state.alerts, { message, severity }] }))
}

export function alertRemove(index: number) {
  useAppStore.setState(state => ({ alerts: state.alerts.filter((_, i) => i !== index) }))
}

export function clipboardSet(clipboard: Component | Board | Cut | null) {
  useAppStore.setState({ clipboard })
}

export function findSet(find: boolean) {
  useAppStore.setState({ find })
}

export function historyAdd(project: Project) {
  if (useAppStore.getState().history.syncing) {
    useAppStore.setState(state => ({ history: { ...state.history, syncing: false } }))
  }
  else {
    const history = useAppStore.getState().history
    const newItems = history.items.slice(0, history.current !== undefined ? history.current + 1 : history.items.length)

    useAppStore.setState({
      history: {
        items: [...newItems, project],
        current: newItems.length,
        syncing: false,
      },
    })
  }
}

export function historyRedo(): void {
  const history = useAppStore.getState().history

  if (history.current !== undefined && history.current < history.items.length - 1) {
    const next = history.items[history.current + 1]

    useAppStore.setState({
      history: {
        items: history.items,
        current: history.current + 1,
        syncing: true,
      },
      project: next,
    })
  }
}

export function historyUndo(): void {
  const history = useAppStore.getState().history

  if (history.current !== undefined && history.current > 0) {
    const previous = history.items[history.current - 1]

    useAppStore.setState({
      history: {
        items: history.items,
        current: history.current - 1,
        syncing: true,
      },
      project: previous,
    })
  }
}

export function projectSet(project: Project) {
  useAppStore.setState({ project })
}
