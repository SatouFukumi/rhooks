import { useEffect, useRef } from "react"

export function useTimeout(
  callback: () => any,
  ms: MilliSec
): F.RHook.UseTimeoutReturn {
  const timeoutIdRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    clearTimeout(timeoutIdRef.current)
    timeoutIdRef.current = setTimeout(callback, ms)

    return () => clearTimeout(timeoutIdRef.current)
  }, [ms, callback])

  return {
    reset() {
      clearTimeout(timeoutIdRef.current)
      timeoutIdRef.current = setTimeout(callback, ms)
    },
    clear() {
      clearTimeout(timeoutIdRef.current)
    },
  }
}
