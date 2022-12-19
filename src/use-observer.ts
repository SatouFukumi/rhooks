import type {
  UseIntersectionObserverParam,
  UseMutationObserverParam,
  UseResizeObserverParam,
} from "./types"
import { useEffect, useState } from "react"
import { throttled } from "@fukumi/libraries"

export const useIntersectionObserver = <T extends HTMLElement = HTMLElement>({
  ref,
  options,
  onIntersect,
}: UseIntersectionObserverParam<T>) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry)
      onIntersect?.(entry)
    }, options)

    observer.observe(ref.current)

    return observer.disconnect.bind(observer)
  }, [ref, options, onIntersect])

  return entry!
}

export const useIntersectionObserverCallback = <
  T extends HTMLElement = HTMLElement
>({
  ref,
  options,
  onIntersect,
}: UseIntersectionObserverParam<T>) => {
  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => onIntersect?.(entry),
      options
    )

    observer.observe(ref.current)

    return observer.disconnect.bind(observer)
  }, [ref, options, onIntersect])
}

export const useMutationObserver = <T extends HTMLElement = HTMLElement>({
  ref,
  onMutate,
  options = {},
}: UseMutationObserverParam<T>) => {
  const [record, setRecord] = useState<MutationRecord>()

  useEffect(() => {
    if (!ref.current) return

    const obs = new MutationObserver(([record]) => {
      setRecord(record)
      onMutate?.(record)
    })
    obs.observe(ref.current, options)

    return obs.disconnect.bind(obs)
  }, [ref, onMutate, options])

  return record!
}

export const useMutationObserverCallback = <T extends HTMLElement = HTMLElement>({
  ref,
  onMutate,
  options = {},
}: UseMutationObserverParam<T>) => {
  useEffect(() => {
    if (!ref.current) return

    const obs = new MutationObserver(([record]) => onMutate?.(record))
    obs.observe(ref.current, options)

    return obs.disconnect.bind(obs)
  }, [ref, onMutate, options])
}

export const useResizeObserver = <T extends HTMLElement = HTMLElement>({
  ref,
  onResize,
  throttle = 0,
  options = {},
}: UseResizeObserverParam<T>) => {
  type Pixel = 1
  type Pixels = number
  type Px = Pixel | Pixels

  const [size, setSize] = useState<{ width: Px; height: Px }>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    if (!ref.current) return

    const obs = new ResizeObserver(
      throttled(([entry]: ResizeObserverEntry[]) => {
        setSize({
          width: entry.borderBoxSize[0].inlineSize,
          height: entry.borderBoxSize[0].blockSize,
        })

        onResize?.(entry)
      }, throttle)
    )
    obs.observe(ref.current, options)

    return obs.disconnect.bind(obs)
  }, [ref, throttle, options, onResize, setSize])

  return size
}

export const useResizeObserverCallback = <T extends HTMLElement = HTMLElement>({
  ref,
  onResize,
  throttle = 0,
  options = {},
}: UseResizeObserverParam<T>) => {
  useEffect(() => {
    if (!ref.current) return

    const obs = new ResizeObserver(
      throttled(([entry]: ResizeObserverEntry[]) => onResize?.(entry), throttle)
    )
    obs.observe(ref.current, options)

    return obs.disconnect.bind(obs)
  }, [ref, throttle, options, onResize])
}
