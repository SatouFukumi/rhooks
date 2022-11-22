import type RHook from "./types"
import { useCallback, useEffect, useState } from "react"

export function useAsyncEffect<T extends any>(
  callback: () => Promise<T>,
  deps: React.DependencyList = []
): RHook.UseAsyncEffectReturn<T> {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState()
  const [data, setData] = useState<T>()

  const callbackMemoized = useCallback(() => {
    setIsLoading(true)
    setError(undefined)
    setData(undefined)
    callback()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    callbackMemoized()
  }, [callbackMemoized])

  return { isLoading, error, data } as RHook.UseAsyncEffectReturn<T>
}
