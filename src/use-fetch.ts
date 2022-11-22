import type RHook from "./types"
import { useEffect, useReducer, useRef } from "react"

export function useFetch<T = unknown>(
  url?: string,
  options?: RequestInit
): RHook.UseFetchReturn<T> {
  const cache = useRef<{ [url: string]: T }>({})
  const cancelRequest = useRef<boolean>(false)

  const [state, dispatch] = useReducer(
    (
      state: RHook.UseFetchReturn<T>,
      action:
        | { type: "loading" }
        | { type: "fetched"; payload: T }
        | { type: "error"; payload: Error }
    ): RHook.UseFetchReturn<T> => {
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

  useEffect(() => {
    // Do nothing if the url is not given
    if (!url) return

    cancelRequest.current = false

    const fetchData = async () => {
      dispatch({ type: "loading" })

      // If a cache exists for this url, return it
      if (cache.current[url]) {
        dispatch({ type: "fetched", payload: cache.current[url] })

        return
      }

      try {
        const response = await fetch(url, options)

        if (!response.ok) {
          throw new Error(response.statusText)
        }

        const data = (await response.json()) as T
        cache.current[url] = data

        if (cancelRequest.current) return

        dispatch({ type: "fetched", payload: data })
      } catch (error) {
        if (cancelRequest.current) return

        dispatch({ type: "error", payload: error as Error })
      }
    }

    fetchData()

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    return () => {
      cancelRequest.current = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return state
}
