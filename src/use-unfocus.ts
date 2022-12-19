import { useRef } from "react"
import { useEventListener } from "./use-event-listener"

export const useUnfocus = <T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>,
  cb: (e: MouseEvent) => any
) => {
  useEventListener(
    "click",
    (e) => {
      if (
        ref.current === null
        || e.target === null
        || ref.current.contains(e.target as Node)
      )
        return
      cb(e)
    },
    useRef(document)
  )
}
