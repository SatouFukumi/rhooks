import type { MilliSec } from "./types"
import { useState } from "react"
import { useSynchronizedInterval } from "./use-interval"

export const useClock = (ms: MilliSec = 1000) => {
  const [now, setNow] = useState(new Date())

  useSynchronizedInterval(() => setNow(new Date()), ms)

  return now
}
