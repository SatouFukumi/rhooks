import { useState } from "react"

export const useCounter = (initialValue?: number) => {
  const [count, setCount] = useState(initialValue || 0)

  return {
    count,
    increment() {
      setCount((c) => c + 1)
    },
    decrement() {
      setCount((c) => c - 1)
    },
    reset() {
      setCount(initialValue || 0)
    },
    setCount(value: React.SetStateAction<number>) {
      setCount(value)
    },
  }
}
