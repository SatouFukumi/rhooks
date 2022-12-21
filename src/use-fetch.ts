import { useCallback, useEffect, useReducer, useRef } from "react"
import type { UseFetchReturn } from "./types"

export const useFetch = <T = unknown>(
  url?: string,
  options?: RequestInit
): UseFetchReturn<T> => {
  const cache = useRef<Map<string, T>>(new Map())
  const toCancelRequest = useRef<boolean>(false)

  const [state, dispatch] = useReducer(
    (
      state: UseFetchReturn<T>,
      action:
        | { type: "loading" }
        | { type: "fetched"; payload: T }
        | { type: "error"; payload: Error }
    ): UseFetchReturn<T> => {
      switch (action.type) {
        case "loading":
          return { isLoading: true, data: undefined, error: undefined }

        case "fetched":
          return {
            error: undefined,
            data: action.payload,
            isLoading: false,
          }

        case "error":
          return {
            data: undefined,
            error: action.payload,
            isLoading: false,
          }

        default:
          return state
      }
    },
    {
      isLoading: true,
      data: undefined,
      error: undefined,
    }
  )

  const fetchData = useCallback(async () => {
    // Do nothing if the url is not given
    if (!url) return

    toCancelRequest.current = false

    dispatch({ type: "loading" })

    // If a cache exists for this url, return it
    if (cache.current.has(url))
      return dispatch({ type: "fetched", payload: cache.current.get(url)! })

    try {
      const response = await fetch(url, options)

      if (!response.ok) throw new Error(response.statusText)

      const data = (await response.json()) as T
      cache.current.set(url, data)

      if (toCancelRequest.current) return

      dispatch({ type: "fetched", payload: data })
    } catch (error) {
      if (toCancelRequest.current) return

      dispatch({ type: "error", payload: error as Error })
    }
  }, [options, url])

  useEffect(() => {
    fetchData()

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    return () => {
      toCancelRequest.current = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return state
}
