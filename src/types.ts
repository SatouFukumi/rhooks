declare global {
  type MilliSec = number

  namespace F {
    namespace RHook {
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

      type UseAsyncEffectReturn<T> =
        | UseAsyncEffectReturnAwaiting
        | UseAsyncEffectReturnFailed
        | UseAsyncEffectReturnSucceed<T>

      //
      // useFetch
      type UseFetchReturnSucceed<T> = UseAsyncEffectReturnSucceed<T>
      type UseFetchReturnFailed = UseAsyncEffectReturnFailed
      type UseFetchReturnAwaiting = UseAsyncEffectReturnAwaiting
      type UseFetchReturn<T> =
        | UseAsyncEffectReturnSucceed<T>
        | UseAsyncEffectReturnFailed
        | UseAsyncEffectReturnAwaiting

      //
      // useGeolocation
      interface UseGeolocationParam {
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

      type UseGeolocationReturn =
        | UseGeolocationReturnFailed
        | UseGeolocationReturnSucceed

      //
      // useIntersectionObserver
      interface UseIntersectionObserverParam<T extends HTMLElement> {
        ref: React.RefObject<T>
        options?: IntersectionObserverInit
        onIntersect?(entry: IntersectionObserverEntry): any
      }

      //
      // useMutationObserver
      interface UseMutationObserverParam<T extends HTMLElement> {
        ref: React.RefObject<T>
        options?: MutationObserverInit
        onMutate?(record: MutationRecord): any
      }

      //
      // useResizeObserver
      interface UseResizeObserverParam<T extends HTMLElement> {
        ref: React.RefObject<T>
        throttle?: MilliSec
        options?: ResizeObserverOptions
        onResize?(entry: ResizeObserverEntry): any
      }

      //
      // useStep
      interface UseStepReturnFunc {
        toNextStep(): void
        toPrevStep(): void
        nextStepIsAvailable: boolean
        prevStepIsAvailable: boolean
        setStep(value: React.SetStateAction<number>): void
        reset(): void
      }

      //
      // useStorage
      interface UseStorageReturn<T> {
        value: T
        setValue(value: React.SetStateAction<T>): void
        removeValue(): void
      }

      //
      // useTheme
      interface UseThemeReturn<T> {
        theme: T
        setTheme(theme: React.SetStateAction<T>): void
      }

      //
      // useTimeout
      interface UseTimeoutReturn {
        reset(): void
        clear(): void
      }
    }
  }
}

export default F
