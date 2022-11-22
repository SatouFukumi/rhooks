export type MilliSec = number

export namespace RHook {
  //
  // useAsyncEffect
  interface UseAsyncEffectReturnSucceed<T> {
    isLoading: false
    error: undefined
    data: T
  }

  interface UseAsyncEffectReturnFailed {
    isLoading: false
    error: Error
    data: undefined
  }

  interface UseAsyncEffectReturnAwaiting {
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
  type UseFetchReturnSucceed<T> = UseAsyncEffectReturnSucceed<T>
  type UseFetchReturnFailed = UseAsyncEffectReturnFailed
  type UseFetchReturnAwaiting = UseAsyncEffectReturnAwaiting
  export type UseFetchReturn<T> =
    | UseAsyncEffectReturnSucceed<T>
    | UseAsyncEffectReturnFailed
    | UseAsyncEffectReturnAwaiting

  //
  // useGeolocation
  export interface UseGeolocationParam {
    options?: PositionOptions
    throttle?: MilliSec
  }

  interface UseGeolocationReturnFunc {
    clearWatch(): void
    startWatch(): void
  }

  interface UseGeolocationReturnSucceed extends UseGeolocationReturnFunc {
    geoPosition: GeolocationPosition
    error: undefined
  }

  interface UseGeolocationReturnFailed extends UseGeolocationReturnFunc {
    error: GeolocationPositionError
    geoPosition: undefined
  }

  export type UseGeolocationReturn =
    | UseGeolocationReturnFailed
    | UseGeolocationReturnSucceed

  //
  // useIntersectionObserver
  export interface UseIntersectionObserverParam<T extends HTMLElement> {
    ref: React.RefObject<T>
    options?: IntersectionObserverInit
    onIntersect?(entry: IntersectionObserverEntry): any
  }

  //
  // useMutationObserver
  export interface UseMutationObserverParam<T extends HTMLElement> {
    ref: React.RefObject<T>
    options?: MutationObserverInit
    onMutate?(record: MutationRecord): any
  }

  //
  // useResizeObserver
  export interface UseResizeObserverParam<T extends HTMLElement> {
    ref: React.RefObject<T>
    throttle?: MilliSec
    options?: ResizeObserverOptions
    onResize?(entry: ResizeObserverEntry): any
  }

  //
  // useStep
  export interface UseStepReturnFunc {
    toNextStep(): void
    toPrevStep(): void
    nextStepIsAvailable: boolean
    prevStepIsAvailable: boolean
    setStep(value: React.SetStateAction<number>): void
    reset(): void
  }

  //
  // useStorage
  export interface UseStorageReturn<T> {
    value: T
    setValue(value: React.SetStateAction<T>): void
    removeValue(): void
  }

  //
  // useTheme
  export interface UseThemeReturn<T> {
    theme: T
    setTheme(theme: React.SetStateAction<T>): void
  }

  //
  // useTimeout
  export interface UseTimeoutReturn {
    reset(): void
    clear(): void
  }
}

export default RHook
