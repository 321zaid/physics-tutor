// eslint-disable-next-line @typescript-eslint/no-explicit-any
let lenisInstance: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listeners: Array<(lenis: any) => void> = []

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setLenis(lenis: any) {
  lenisInstance = lenis
  listeners.forEach((fn) => fn(lenis))
  listeners.length = 0
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLenis(): any {
  return lenisInstance
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onLenisReady(fn: (lenis: any) => void) {
  if (lenisInstance) {
    fn(lenisInstance)
  } else {
    listeners.push(fn)
  }
}
