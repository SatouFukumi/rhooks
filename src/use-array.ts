import { useState } from "react"

export function useArray<T extends unknown>(initialArray: T[]) {
  const [array, setArray] = useState(initialArray)

  return {
    array,

    set(value: React.SetStateAction<typeof initialArray>) {
      setArray(value)
    },

    push(item: T) {
      setArray((arr) => [...arr, item])
    },

    // this method should only be use to permanently filter the array
    filter(...args: Parameters<typeof array.filter>) {
      setArray((arr) => arr.filter(...args))
    },

    update(index: number, item: T) {
      setArray((arr) => [
        ...arr.slice(0, index),
        item,
        ...arr.slice(index + 1, arr.length),
      ])
    },

    remove(index: number) {
      setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)])
    },

    clear() {
      setArray((arr) => {
        arr.length = 0
        return arr
      })
    },
  }
}
