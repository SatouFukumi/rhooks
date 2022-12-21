import { useCallback, useState } from "react"
import { useEventListener } from "./use-event-listener"
import SuperJSON from "superjson"
import type { UseStorageReturn } from "./types"

declare global {
  interface WindowEventMap {
    "local-storage": CustomEvent<{ key: string }>
    "session-storage": CustomEvent<{ key: string }>
  }
}

export const useLocalStorage = <T extends unknown>(
  key: string,
  initialValue?: T
): UseStorageReturn<T> => {
  const getValueFromStorage = useCallback(() => {
    // if window can not be accessed, return the `initialValue`
    if (typeof window === "undefined") return initialValue

    try {
      let item = localStorage.getItem(key)

      if (item === null) {
        localStorage.setItem(key, SuperJSON.stringify(initialValue))
        window.dispatchEvent(
          new CustomEvent<{ key: string }>("local-storage", { detail: { key } })
        )

        return initialValue
      }

      return SuperJSON.parse(item) as T
    } catch (error) {
      console.error(
        `Error reading localStorage key “${key}”, using "initialValue" : `,
        error
      )

      return initialValue
    }
  }, [initialValue, key])

  const [value, setValue] = useState<T | undefined>(getValueFromStorage)

  // take other components' storage modifications into account
  const handleStorageChange = useCallback(
    ({ detail }: WindowEventMap["local-storage"]) => {
      if (detail.key !== key) return

      setValue(getValueFromStorage)
    },
    [key, getValueFromStorage]
  )

  useEventListener("local-storage", handleStorageChange)

  return {
    value,

    setValue(sta) {
      const newValue
        = sta instanceof Function || typeof sta === "function" ? (sta as Function)(this.value) : sta
      localStorage.setItem(key, SuperJSON.stringify(newValue))
      window.dispatchEvent(
        new CustomEvent<{ key: string }>("local-storage", { detail: { key } })
      )
      setValue(newValue)
    },

    removeValue() {
      localStorage.removeItem(key)
      window.dispatchEvent(
        new CustomEvent<{ key: string }>("local-storage", { detail: { key } })
      )
      setValue(initialValue)
    },
  }
}

export const useSessionStorage = <T extends unknown>(
  key: string,
  initialValue?: T
): UseStorageReturn<T> => {
  const getValueFromStorage = useCallback(() => {
    // if window can not be accessed, return the `initialValue`
    if (typeof window === "undefined") return initialValue

    try {
      let item = sessionStorage.getItem(key)

      if (item === null) {
        sessionStorage.setItem(key, SuperJSON.stringify(initialValue))
        window.dispatchEvent(
          new CustomEvent<{ key: string }>("local-storage", { detail: { key } })
        )

        return initialValue
      }

      return SuperJSON.parse(item) as T
    } catch (error) {
      console.error(
        `Error reading sessionStorage key “${key}”, using "initialValue" : `,
        error
      )

      return initialValue
    }
  }, [initialValue, key])

  const [value, setValue] = useState<T | undefined>(getValueFromStorage)

  // take other components' storage modifications into account
  const handleStorageChange = useCallback(
    ({ detail }: WindowEventMap["session-storage"]) => {
      if (detail.key !== key) return

      setValue(getValueFromStorage)
    },
    [key, getValueFromStorage]
  )

  useEventListener("session-storage", handleStorageChange)

  return {
    value,

    setValue(sta) {
      const newValue = sta instanceof Function ? sta(this.value) : sta
      sessionStorage.setItem(key, SuperJSON.stringify(newValue))
      window.dispatchEvent(
        new CustomEvent<{ key: string }>("session-storage", { detail: { key } })
      )
      setValue(newValue)
    },

    removeValue() {
      sessionStorage.removeItem(key)
      window.dispatchEvent(
        new CustomEvent<{ key: string }>("session-storage", { detail: { key } })
      )
      setValue(initialValue)
    },
  }
}
