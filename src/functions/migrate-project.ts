import { assertIsBoard, assertIsNumber, assertIsProject, assertIsString, assertIsStringRecord, assertWithMessage, type Board, check, type Cut, type CutData, type CutGeometry, type Cutlist, type Face, type Project, type Wood } from '@woodcutapp/woodcutapp'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return isObject(value) ? value : null
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

function safeNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback
}

function assertString(value: unknown, name: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${name} is missing or invalid.`)
  }
  return value
}

function assertNumber(value: unknown, name: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new Error(`${name} is missing or invalid.`)
  }
  return value
}

function assertNumberTuple(value: unknown, length: number, name: string): number[] {
  if (!Array.isArray(value) || value.length !== length || !value.every(item => typeof item === 'number')) {
    throw new Error(`${name} is missing or invalid.`)
  }
  return value
}

function assertNumberTupleOrPair(value: unknown, name: string): [number, number] {
  if (Array.isArray(value) && value.length === 2 && value.every(item => typeof item === 'number')) {
    return value as [number, number]
  }
  if (typeof value === 'number') {
    return [value, value]
  }
  throw new Error(`${name} is missing or invalid.`)
}

function migrateMeasurement(value: unknown): 'imperial' | 'metric' {
  return value === 'metric' ? 'metric' : 'imperial'
}

function migrateFace(value: unknown): Face {
  return typeof value === 'string' ? (value as Face) : 'TOP'
}

function migrateWood(value: unknown): Wood {
  return typeof value === 'string' ? (value as Wood) : 'PINE_PONDEROSA'
}

function migrateVersion1Project(value: unknown): Project {
  assertWithMessage(value, assertIsStringRecord, 'Malformed project: Expected an object with string keys.')
  assertWithMessage(value.version, assertIsNumber, 'Project version is missing or invalid.')

  const untaggedBoards: Record<string, unknown>[] = []
  const taggedBoards: Record<string, unknown>[] = []

  if (Array.isArray(value.boards)) {
    for (const board of value.boards) {
      if (check(board, assertIsStringRecord) && check(board.tag, assertIsString)) {
        taggedBoards.push(board)
      }
      if (check(board, assertIsStringRecord) && !check(board.tag, assertIsString)) {
        untaggedBoards.push(board)
      }
    }
  }

  const components: Project['components'] = []

  if (untaggedBoards.length > 0) {
    components.push({
      boards: untaggedBoards.map(migrateBoardFromVersion1),
      bounds: [0, 0, 0],
      name: 'Untagged Boards',
      notes: '',
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      visible: true,
    })
  }

  if (Array.isArray(value.tags)) {
    for (const tagValue of value.tags) {
      if (!isObject(tagValue)) {
        continue
      }

      const tagId = assertString(tagValue.id, 'Tag ID')
      const tagLabel = isObject(tagValue) && typeof tagValue.label === 'string' ? tagValue.label : ''
      const tagVisible = typeof tagValue.visible === 'boolean' ? tagValue.visible : true

      const boards = taggedBoards
        .filter(board => isObject(board) && board.tag === tagId)
        .map(migrateBoardFromVersion1)

      components.push({
        boards,
        bounds: [0, 0, 0],
        name: tagLabel,
        notes: '',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        visible: tagVisible,
      })
    }
  }

  if (!isObject(value.config)) {
    throw new Error('Config is missing or invalid.')
  }

  return {
    components,
    cutlists: migrateCutlistsFromVersion1(value.cutlists),
    name: typeof value.name === 'string' ? value.name : '',
    notes: typeof value.notes === 'string' ? value.notes : '',
    settings: {
      bounds: assertNumber(value.config.bounds, 'Config bounds'),
      defaults: {
        board: null,
        component: null,
        cut: null,
      },
      measurement: migrateMeasurement(value.config.measurement),
      step: assertNumber(value.config.step, 'Config step'),
    },
    version: 0,
  }
}

function migrateBoardFromVersion1(value: unknown): Board {
  if (!isObject(value)) {
    throw new Error('Board is not an object.')
  }

  const migratedBoard = {
    bounds: assertNumberTuple(value.bounds, 3, 'Board bounds') as [number, number, number],
    cuts: Array.isArray(value.cuts) ? value.cuts.map(migrateCutFromVersion1) : [],
    name: typeof value.name === 'string' ? value.name : '',
    notes: typeof value.notes === 'string' ? value.notes : '',
    position: assertNumberTuple(value.position, 3, 'Board position') as [number, number, number],
    rotation: assertNumberTuple(value.rotation, 3, 'Board rotation') as [number, number, number],
    visible: typeof value.visible === 'boolean' ? value.visible : true,
    wood: migrateWood(value.wood),
  }

  assertIsBoard(migratedBoard)

  return migratedBoard
}

function migrateCutFromVersion1(value: unknown): Cut {
  if (!isObject(value)) {
    throw new Error('Cut is not an object.')
  }

  const data = value.data
  if (!isObject(data)) {
    throw new Error('Cut data is missing or invalid.')
  }

  return {
    name: typeof value.name === 'string' ? value.name : '',
    visible: true,
    face: migrateFace(data.face),
    data: migrateCutDataFromVersion1(data),
  }
}

function migrateCutDataFromVersion1(value: Record<string, unknown>): CutData {
  const type = typeof value.type === 'string' ? value.type : undefined

  switch (type) {
    case 'CHAMFER':
      return {
        type,
        options: migrateCutDataChamferFromVersion1(value),
      }
    case 'CUSTOM':
      return {
        type,
        options: migrateCutDataCustomFromVersion1(value),
      }
    case 'DADO':
      return {
        type,
        options: migrateCutDataDadoFromVersion1(value),
      }
    case 'DOVETAIL_PIN':
      return {
        type,
        options: migrateCutDataDovetailPinFromVersion1(value),
      }
    case 'DOVETAIL_TAIL':
      return {
        type,
        options: migrateCutDataDovetailTailFromVersion1(value),
      }
    case 'GROOVE':
      return {
        type,
        options: migrateCutDataGrooveFromVersion1(value),
      }
    case 'MITER':
      return {
        type,
        options: migrateCutDataMiterFromVersion1(value),
      }
    case 'MORTISE':
      return {
        type,
        options: migrateCutDataMortiseFromVersion1(value),
      }
    case 'MOULDING':
      return {
        type,
        options: migrateCutDataMouldingFromVersion1(value),
      }
    case 'ROUND':
      return {
        type,
        options: migrateCutDataRoundFromVersion1(value),
      }
    case 'TENON':
      return {
        type,
        options: migrateCutDataTenonFromVersion1(value),
      }
    case 'TONGUE':
      return {
        type,
        options: migrateCutDataTongueFromVersion1(value),
      }
    default:
      throw new Error(`Unknown cut type: ${String(type)}`)
  }
}

function getOptions(value: Record<string, unknown>) {
  const options = value.options
  if (!isObject(options)) {
    throw new Error('Cut options are missing or invalid.')
  }
  return options
}

function migrateCutDataChamferFromVersion1(value: Record<string, unknown>) {
  const options = getOptions(value)

  const migrateEdge = (name: string) => {
    const edge = options[name]
    if (!isObject(edge)) {
      return null
    }
    return {
      curved: typeof edge.curved === 'boolean' ? edge.curved : false,
      enabled: typeof edge.enabled === 'boolean' ? edge.enabled : false,
      height: assertNumber(edge.height, `${name} height`),
      width: assertNumber(edge.width, `${name} width`),
    }
  }

  return {
    bottom: migrateEdge('BOTTOM'),
    left: migrateEdge('LEFT'),
    right: migrateEdge('RIGHT'),
    top: migrateEdge('TOP'),
  }
}

function migrateCutDataCustomFromVersion1(value: Record<string, unknown>): CutGeometry {
  const options = getOptions(value)
  const geometryType = assertString(options.type, 'Custom geometry type')
  const args = options.args
  if (!isObject(args)) {
    throw new Error('Custom geometry args are missing or invalid.')
  }

  switch (geometryType) {
    case 'BOX':
      return {
        geometry: {
          type: 'BOX',
          args: {
            depth: assertNumber(args.depth, 'Custom box depth'),
            height: assertNumber(args.height, 'Custom box height'),
            width: assertNumber(args.width, 'Custom box width'),
          },
        },
        position: assertNumberTuple(options.position, 3, 'Custom position') as [number, number, number],
        rotation: assertNumberTuple(options.rotation, 3, 'Custom rotation') as [number, number, number],
      }
    case 'BUFFER':
      return {
        geometry: {
          type: 'BUFFER',
          args: {
            normals: assertNumberArray(args.normals, 'Custom buffer normals'),
            positions: assertNumberArray(args.positions, 'Custom buffer positions'),
            uvs: assertNumberArray(args.uvs, 'Custom buffer uvs'),
          },
        },
        position: assertNumberTuple(options.position, 3, 'Custom position') as [number, number, number],
        rotation: assertNumberTuple(options.rotation, 3, 'Custom rotation') as [number, number, number],
      }
    case 'CONE':
      return {
        geometry: {
          type: 'CONE',
          args: {
            height: assertNumber(args.height, 'Custom cone height'),
            radialSegments: assertNumber(args.radialSegments, 'Custom cone radial segments'),
            radius: assertNumber(args.radius, 'Custom cone radius'),
          },
        },
        position: assertNumberTuple(options.position, 3, 'Custom position') as [number, number, number],
        rotation: assertNumberTuple(options.rotation, 3, 'Custom rotation') as [number, number, number],
      }
    case 'CYLINDER':
      return {
        geometry: {
          type: 'CYLINDER',
          args: {
            height: assertNumber(args.height, 'Custom cylinder height'),
            radialSegments: assertNumber(args.radialSegments, 'Custom cylinder radial segments'),
            radiusBottom: assertNumber(args.radiusBottom, 'Custom cylinder radius bottom'),
            radiusTop: assertNumber(args.radiusTop, 'Custom cylinder radius top'),
          },
        },
        position: assertNumberTuple(options.position, 3, 'Custom position') as [number, number, number],
        rotation: assertNumberTuple(options.rotation, 3, 'Custom rotation') as [number, number, number],
      }
    case 'SPHERE':
      return {
        geometry: {
          type: 'SPHERE',
          args: {
            heightSegments: assertNumber(args.heightSegments, 'Custom sphere height segments'),
            radius: assertNumber(args.radius, 'Custom sphere radius'),
            widthSegments: assertNumber(args.widthSegments, 'Custom sphere width segments'),
          },
        },
        position: assertNumberTuple(options.position, 3, 'Custom position') as [number, number, number],
        rotation: assertNumberTuple(options.rotation, 3, 'Custom rotation') as [number, number, number],
      }
    default:
      throw new Error(`Unknown custom geometry type: ${geometryType}`)
  }
}

function assertNumberArray(value: unknown, name: string): number[] {
  if (!Array.isArray(value) || !value.every(item => typeof item === 'number')) {
    throw new Error(`${name} is missing or invalid.`)
  }
  return value
}

function migrateCutDataDadoFromVersion1(value: Record<string, unknown>) {
  const options = getOptions(value)

  return {
    depth: assertNumber(options.depth, 'Dado depth'),
    padding: assertNumberTupleOrPair(options.padding, 'Dado padding'),
    position: assertNumber(options.position, 'Dado position'),
    width: assertNumber(options.width, 'Dado width'),
  }
}

function migrateCutDataDovetailPinFromVersion1(value: Record<string, unknown>) {
  const options = getOptions(value)

  return {
    angle: assertNumber(options.angle, 'Dovetail pin angle'),
    depth: assertNumber(options.depth, 'Dovetail pin depth'),
    height: assertNumber(options.height, 'Dovetail pin height'),
    number: assertNumber(options.number, 'Dovetail pin number'),
    width: assertNumber(options.width, 'Dovetail pin width'),
  }
}

function migrateCutDataDovetailTailFromVersion1(value: Record<string, unknown>) {
  const options = getOptions(value)

  return {
    angle: assertNumber(options.angle, 'Dovetail tail angle'),
    depth: assertNumber(options.depth, 'Dovetail tail depth'),
    height: assertNumber(options.height, 'Dovetail tail height'),
    number: assertNumber(options.number, 'Dovetail tail number'),
    width: assertNumber(options.width, 'Dovetail tail width'),
  }
}

function migrateCutDataGrooveFromVersion1(value: Record<string, unknown>) {
  const options = getOptions(value)

  return {
    depth: assertNumber(options.depth, 'Groove depth'),
    length: assertNumber(options.length, 'Groove length'),
    position: assertNumberTuple(options.position, 2, 'Groove position') as [number, number],
    width: assertNumber(options.width, 'Groove width'),
  }
}

function migrateCutDataMiterFromVersion1(value: Record<string, unknown>) {
  const options = getOptions(value)

  const migrateEdge = (name: string) => {
    const edge = options[name]
    if (!isObject(edge)) {
      return null
    }
    return {
      angle: assertNumber(edge.angle, `${name} angle`),
      enabled: typeof edge.enabled === 'boolean' ? edge.enabled : false,
    }
  }

  return {
    top: migrateEdge('TOP'),
    bottom: migrateEdge('BOTTOM'),
    right: migrateEdge('RIGHT'),
    left: migrateEdge('LEFT'),
  }
}

function migrateCutDataMortiseFromVersion1(value: Record<string, unknown>) {
  const options = getOptions(value)

  return {
    depth: assertNumber(options.depth, 'Mortise depth'),
    height: assertNumber(options.height, 'Mortise height'),
    position: assertNumberTuple(options.position, 2, 'Mortise position') as [number, number],
    rounded: typeof options.rounded === 'boolean' ? options.rounded : false,
    width: assertNumber(options.width, 'Mortise width'),
  }
}

function migrateCutDataMouldingFromVersion1(value: Record<string, unknown>) {
  const options = getOptions(value)

  return {
    depth: assertNumber(options.depth, 'Moulding depth'),
    length: assertNumber(options.length, 'Moulding length'),
    position: assertNumber(options.position, 'Moulding position'),
    reverse: typeof options.reverse === 'boolean' ? options.reverse : false,
    type: assertString(options.type, 'Moulding type') as 'OGEE' | 'OGEE_ROMAN',
  }
}

function migrateCutDataRoundFromVersion1(value: Record<string, unknown>) {
  const options = getOptions(value)

  return {
    length: assertNumber(options.length, 'Round length'),
    padding: assertNumber(options.padding, 'Round padding'),
    rounded: assertNumber(options.rounded, 'Round rounded'),
  }
}

function migrateCutDataTenonFromVersion1(value: Record<string, unknown>) {
  const options = getOptions(value)

  if (!isObject(options.padding)) {
    throw new Error('Tenon padding is missing or invalid.')
  }

  return {
    length: assertNumber(options.length, 'Tenon length'),
    paddingX: assertNumberTuple(options.padding.x, 2, 'Tenon padding x') as [number, number],
    paddingY: assertNumberTuple(options.padding.y, 2, 'Tenon padding y') as [number, number],
    rounded: typeof options.rounded === 'boolean' ? options.rounded : false,
  }
}

function migrateCutDataTongueFromVersion1(value: Record<string, unknown>) {
  const options = getOptions(value)

  return {
    height: assertNumber(options.height, 'Tongue height'),
    position: assertNumber(options.position, 'Tongue position'),
    width: assertNumber(options.width, 'Tongue width'),
  }
}

function migrateStockFromVersion1(value: unknown) {
  if (!isObject(value)) {
    throw new Error('Stock is missing or invalid.')
  }

  return {
    id: typeof value.id === 'string' ? value.id : '',
    length: assertNumber(value.length, 'Stock length'),
    width: assertNumber(value.width, 'Stock width'),
    price: assertNumber(value.price, 'Stock price'),
    quantity: assertNumber(value.quantity, 'Stock quantity'),
  }
}

function migrateCutPieceFromVersion1(value: unknown) {
  if (!isObject(value)) {
    throw new Error('Cut piece is missing or invalid.')
  }

  return {
    boardIndex: 0,
    x: assertNumber(value.x, 'Cut piece x'),
    y: assertNumber(value.y, 'Cut piece y'),
    length: assertNumber(value.length, 'Cut piece length'),
    width: assertNumber(value.width, 'Cut piece width'),
  }
}

function migrateWastePieceFromVersion1(value: unknown) {
  if (!isObject(value)) {
    throw new Error('Waste piece is missing or invalid.')
  }

  return {
    x: assertNumber(value.x, 'Waste piece x'),
    y: assertNumber(value.y, 'Waste piece y'),
    length: assertNumber(value.length, 'Waste piece length'),
    width: assertNumber(value.width, 'Waste piece width'),
  }
}

function migrateCutlistBoardFromVersion1(value: unknown) {
  if (!isObject(value)) {
    throw new Error('Cutlist board is missing or invalid.')
  }

  return {
    length: assertNumber(value.length, 'Cutlist board length'),
    width: assertNumber(value.width, 'Cutlist board width'),
    cutPieces: Array.isArray(value.cut_pieces) ? value.cut_pieces.map(migrateCutPieceFromVersion1) : [],
    wastePieces: Array.isArray(value.waste_pieces) ? value.waste_pieces.map(migrateWastePieceFromVersion1) : [],
  }
}

function migrateCutlistBoardTypeFromVersion1(value: unknown) {
  if (!isObject(value)) {
    throw new Error('Cutlist board type is missing or invalid.')
  }

  return {
    type: migrateWood(value.type),
    thickness: assertNumber(value.thickness, 'Cutlist board type thickness'),
    value: assertString(value.value, 'Cutlist board type value'),
  }
}

function migrateCutlistOptionsFromVersion1(value: unknown) {
  if (!isObject(value)) {
    throw new Error('Cutlist options are missing or invalid.')
  }

  return {
    cutWidth: assertNumber(value.cutWidth, 'Cutlist option cut width'),
    padLength: assertNumber(value.padLength, 'Cutlist option pad length'),
    padWidth: assertNumber(value.padWidth, 'Cutlist option pad width'),
    seed: assertNumber(value.seed, 'Cutlist option seed'),
  }
}

function migrateCutlistFromVersion1(value: unknown): Cutlist {
  if (!isObject(value)) {
    throw new Error('Cutlist is not an object.')
  }

  const input = value.input
  if (!isObject(input)) {
    throw new Error('Cutlist input is missing or invalid.')
  }

  return {
    name: typeof value.name === 'string' ? value.name : '',
    boardType: migrateCutlistBoardTypeFromVersion1(value.boardType),
    // Since version 1 did not have a concept of components, we need to flatten all boards into a single component for cutlist generation. We can preserve the original tag information by encoding it in the board name.
    // The board format should be [[componentIndex, boardIndex], Board], but since we are flattening everything into a single component, the componentIndex will always be 0. The boardIndex will be the index of the board in the original input.boards array.
    input: {
      boards: Array.isArray(input.boards)
        ? input.boards.map((board, index) => {
            const migratedBoard = migrateBoardFromVersion1(board)
            if (isObject(board) && typeof board.tag === 'string') {
              migratedBoard.name = `${migratedBoard.name} [${board.tag}]`
            }
            return [[0, index], migratedBoard]
          })
        : [],
      stock: Array.isArray(input.stock) ? input.stock.map(migrateStockFromVersion1) : [],
    },
    output: Array.isArray(value.output) ? value.output.map(migrateCutlistBoardFromVersion1) : [],
    options: migrateCutlistOptionsFromVersion1(value.options),
  }
}

function migrateCutlistsFromVersion1(value: unknown): Project['cutlists'] {
  if (!Array.isArray(value)) {
    return []
  }

  const result: Project['cutlists'] = []
  for (const item of value) {
    try {
      const migrated = migrateCutlistFromVersion1(item)
      result.push(migrated)
    }
    catch {
      continue
    }
  }

  return result
}

export function migrateProject(value: unknown): Project {
  if (isObject(value) && value.version === 1) {
    const project = migrateVersion1Project(value)

    // eslint-disable-next-line no-console
    console.warn('Migrated version 1 project:', { input: value, output: project })

    assertIsProject(project)
    return project
  }

  // Normalize unknown project-like objects into a valid Project shape so
  // downstream `assertIsProject` checks do not throw when optional pieces
  // like `cutlists` are missing. Use helper accessors to avoid `as any`.
  if (isObject(value)) {
    const v = value
    const settings = asRecord(v.settings) ?? {}
    const defaults = asRecord(settings.defaults) ?? {}

    const normalized = {
      components: asArray<Record<string, unknown>>(v.components),
      cutlists: asArray<Record<string, unknown>>(v.cutlists),
      name: typeof v.name === 'string' ? v.name : '',
      notes: typeof v.notes === 'string' ? v.notes : '',
      settings: {
        bounds: safeNumber(settings.bounds, 0),
        defaults: {
          board: asRecord(defaults.board) ?? null,
          component: asRecord(defaults.component) ?? null,
          cut: asRecord(defaults.cut) ?? null,
        },
        measurement: settings.measurement === 'metric' ? 'metric' : 'imperial',
        step: safeNumber(settings.step, 1),
      },
      version: typeof v.version === 'number' ? v.version : 0,
    }

    // eslint-disable-next-line no-console
    console.warn('Migrated normalized project:', { input: value, output: normalized })

    assertIsProject(normalized)

    return normalized
  }

  // eslint-disable-next-line no-console
  console.warn('Non-migrated project:', value)

  assertIsProject(value)

  return value
}
