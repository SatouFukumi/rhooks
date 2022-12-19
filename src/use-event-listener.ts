import { RefObject, useEffect, useRef } from "react"

type UseEventListener = {
  // MediaQueryList Event based useEventListener interface
  <K extends keyof MediaQueryListEventMap>(
    eventName: K,
    handler: (event: MediaQueryListEventMap[K]) => void,
    element: RefObject<MediaQueryList>,
    options?: boolean | AddEventListenerOptions
  ): void

  // Window Event based useEventListener interface
  <K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    element?: undefined,
    options?: boolean | AddEventListenerOptions
  ): void

  // Element Event based useEventListener interface
  <K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLDivElement>(
    eventName: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    element: RefObject<T>,
    options?: boolean | AddEventListenerOptions
  ): void

  // Document Event based useEventListener interface
  <K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (event: DocumentEventMap[K]) => void,
    element: RefObject<Document>,
    options?: boolean | AddEventListenerOptions
  ): void
}

export const useEventListener: UseEventListener = <
  TWindowEventKey extends keyof WindowEventMap,
  THTMLElementEventKey extends keyof HTMLElementEventMap,
  TMqlEventKey extends keyof MediaQueryListEventMap,
  TDocumentEventKey extends keyof DocumentEventMap,
  T extends HTMLElement | MediaQueryList | Window | Document | void = void
>(
  eventName:
    | TWindowEventKey
    | THTMLElementEventKey
    | TMqlEventKey
    | TDocumentEventKey,
  handler: (
    event:
      | WindowEventMap[TWindowEventKey]
      | HTMLElementEventMap[THTMLElementEventKey]
      | MediaQueryListEventMap[TMqlEventKey]
      | DocumentEventMap[TDocumentEventKey]
      | Event
  ) => void,
  element?: RefObject<T>,
  options?: boolean | AddEventListenerOptions
) => {
  // Create a ref that stores handler
  const savedHandler = useRef(handler)

  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current ?? window

    if (!(targetElement && targetElement.addEventListener)) return

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = (event) => savedHandler.current(event)

    targetElement.addEventListener(eventName, listener, options)

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener, options)
    }
  }, [eventName, element, options])
}
