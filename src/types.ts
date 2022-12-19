export type MilliSec = number

//
// useAsyncEffect
type UseAsyncEffectReturnSucceed<T> = {
  isLoading: false
  error: undefined
  data: T
}

type UseAsyncEffectReturnFailed = {
  isLoading: false
  error: Error
  data: undefined
}

type UseAsyncEffectReturnAwaiting = {
  isLoading: true
  error: undefined
  data: undefined
}

export type UseAsyncEffectReturn<T> =
  | UseAsyncEffectReturnAwaiting
  | UseAsyncEffectReturnFailed
  | UseAsyncEffectReturnSucceed<T>

//
// useFetch
export type UseFetchReturnSucceed<T> = UseAsyncEffectReturnSucceed<T>
export type UseFetchReturnFailed = UseAsyncEffectReturnFailed
export type UseFetchReturnAwaiting = UseAsyncEffectReturnAwaiting
export type UseFetchReturn<T> =
  | UseAsyncEffectReturnSucceed<T>
  | UseAsyncEffectReturnFailed
  | UseAsyncEffectReturnAwaiting

//
// useGeolocation
export type UseGeolocationParam = {
  options?: PositionOptions
  throttle?: MilliSec
}

type UseGeolocationReturnFunc = {
  clearWatch(): void
  startWatch(): void
}

type UseGeolocationReturnSucceed = UseGeolocationReturnFunc & {
  geoPosition: GeolocationPosition
  error: undefined
}

type UseGeolocationReturnFailed = UseGeolocationReturnFunc & {
  error: GeolocationPositionError
  geoPosition: undefined
}

export type UseGeolocationReturn =
  | UseGeolocationReturnFailed
  | UseGeolocationReturnSucceed

//
// useIntersectionObserver
export type UseIntersectionObserverParam<T extends HTMLElement> = {
  ref: React.RefObject<T>
  options?: IntersectionObserverInit
  onIntersect?(entry: IntersectionObserverEntry): any
}

//
// useMutationObserver
export type UseMutationObserverParam<T extends HTMLElement> = {
  ref: React.RefObject<T>
  options?: MutationObserverInit
  onMutate?(record: MutationRecord): any
}

//
// useResizeObserver
export type UseResizeObserverParam<T extends HTMLElement> = {
  ref: React.RefObject<T>
  throttle?: MilliSec
  options?: ResizeObserverOptions
  onResize?(entry: ResizeObserverEntry): any
}

//
// useStep
export type UseStepReturnFunc = {
  toNextStep(): void
  toPrevStep(): void
  nextStepIsAvailable: boolean
  prevStepIsAvailable: boolean
  setStep(value: React.SetStateAction<number>): void
  reset(): void
}

//
// useStorage
export type UseStorageReturn<T> = {
  value: T
  setValue(value: React.SetStateAction<T>): void
  removeValue(): void
}

//
// useTheme
export type UseThemeReturn<T> = {
  theme: T
  setTheme(theme: React.SetStateAction<T>): void
}

//
// useTimeout
export type UseTimeoutReturn = {
  reset(): void
  clear(): void
}
