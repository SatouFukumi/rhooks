import type RHook from "./types"
import { methods as _ } from "@fukumi/libraries"
import { useCallback, useEffect, useRef, useState } from "react"

export function useGeolocation({
  options = {},
  throttle = 1000,
}: RHook.UseGeolocationParam = {}): RHook.UseGeolocationReturn {
  const [geoPosition, setGeoPosition] = useState<GeolocationPosition>()
  const [error, setError] = useState<GeolocationPositionError>()

  const stopRef = useRef(false)
  const watchIdRef = useRef<number>(-1)
  const watchingRef = useRef<boolean>(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const positionSetter = useCallback(_.throttle(setGeoPosition, throttle), [])

  useEffect(() => {
    if (stopRef.current) return
    if (!!geoPosition) stopRef.current = true

    navigator.geolocation.getCurrentPosition(setGeoPosition, setError, options)

    return () => {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchingRef.current = false
    }
  }, [geoPosition, options])

  return {
    geoPosition,

    error,

    startWatch() {
      if (watchingRef.current) return

      watchIdRef.current = navigator.geolocation.watchPosition(
        positionSetter,
        setError,
        options
      )
    },

    clearWatch() {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchingRef.current = false
    },
  } as any
}
