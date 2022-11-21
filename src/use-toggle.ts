import { useState } from "react"

export function useToggle(initial: boolean = false) {
  const [value, setValue] = useState(initial)

  return [
    value,
    (sta?: React.SetStateAction<boolean>) =>
      setValue((currVal) => {
        if (typeof sta === "function") return sta(currVal)
        if (typeof sta === "boolean") return sta
        return !currVal
      }),
  ] as const
}
