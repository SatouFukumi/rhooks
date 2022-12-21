import { useState } from "react"

export const useCounter = (initialValue?: number) => {
  const [count, setCount] = useState(initialValue || 0)

  return {
    count,
    increase() {
      setCount((c) => c + 1)
    },
    decrease() {
      setCount((c) => c - 1)
    },
    reset() {
      setCount(initialValue || 0)
    },
    set(value: React.SetStateAction<number>) {
      setCount(value)
    },
  }
}
