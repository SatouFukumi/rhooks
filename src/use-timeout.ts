import { useEffect, useRef } from "react"
import type { UseTimeoutReturn } from "./types"
import type { MilliSec } from "./types"

export const useTimeout = (callback: () => any, ms: MilliSec): UseTimeoutReturn => {
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
