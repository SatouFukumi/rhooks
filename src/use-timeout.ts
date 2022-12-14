import { useEffect, useRef } from "react"
import type { UseTimeoutReturn } from "./types"
import type { MilliSec } from "./types"

/**
 * 
 * @param       callback        I strongly recommend using a passed in `useCallback`, since if you are 
 * working with states in this callback, it'll block the render flow and u'll have to deal 
 * with a lot of debug
 * @param       ms 
 */
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
