export function roundFloat(number: number, decimal = 5): number {
  return parseFloat(number.toFixed(decimal))
}

export function roundToStep(number: number, step: number, decimal = 5): number {
  return parseFloat((Math.round(number / step) * step).toFixed(decimal))
}

export function rgbDarken([r, g, b]: [number, number, number], coefficient: number): [number, number, number] {
  return [r * coefficient, g * coefficient, b * coefficient]
}

export function rgbLighten([r, g, b]: [number, number, number], coefficient: number): [number, number, number] {
  return [r + (255 - r) * coefficient, g + (255 - g) * coefficient, b + (255 - b) * coefficient]
}

export function rgbRed([r, g, b]: [number, number, number], coefficient: number): [number, number, number] {
  return [r + (255 - r) * coefficient, g - g * coefficient, b - b * coefficient]
}

export function rgbGreen([r, g, b]: [number, number, number], coefficient: number): [number, number, number] {
  return [r - r * coefficient, g + (255 - g) * coefficient, b - b * coefficient]
}

export function rgbBlue([r, g, b]: [number, number, number], coefficient: number): [number, number, number] {
  return [r - r * coefficient, g - g * coefficient, b + (255 - b) * coefficient]
}

export function rgbToPercent([r, g, b]: [number, number, number]): [number, number, number] {
  return [roundFloat(r / 255), roundFloat(g / 255), roundFloat(b / 255)]
}

export function rgbToHexString([r, g, b]: [number, number, number]): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

export function parseValueAsNumber(value: string | number | number[]): number {
  const valueFloat = typeof value === 'string' ? parseFloat(value) : typeof value === 'number' ? value : value[0]
  return isNaN(valueFloat) ? 0 : valueFloat
}

export function nowInSecs(): number {
  return Math.floor(Date.now() / 1000)
}

export function buildUrl(url: string, params?: Record<string, string>): string {
  const value = new URL(url)
  value.search = new URLSearchParams(params).toString()
  return value.toString()
}

export function downloadFile(data: Blob | string, name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const url = data instanceof Blob ? URL.createObjectURL(data) : data
      const anchor = document.createElement('a')
      document.body.appendChild(anchor)
      anchor.href = url
      anchor.target = '_blank'
      anchor.download = name
      anchor.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(anchor)
      resolve()
    }
    catch (error) {
      reject(error)
    }
  })
}

export function notImplemented(): Promise<void> {
  throw Error('Not implemented')
}
