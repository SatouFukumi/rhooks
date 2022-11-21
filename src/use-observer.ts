import { useEffect, useState } from "react"
import { methods as _ } from "@fukumi/libraries"

export function useIntersectionObserver<T extends HTMLElement = HTMLElement>({
  ref,
  options,
  onIntersect,
}: F.RHook.UseIntersectionObserverParam<T>) {
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

export function useIntersectionObserverCallback<
  T extends HTMLElement = HTMLElement
>({ ref, options, onIntersect }: F.RHook.UseIntersectionObserverParam<T>) {
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

export function useMutationObserver<T extends HTMLElement = HTMLElement>({
  ref,
  onMutate,
  options = {},
}: F.RHook.UseMutationObserverParam<T>) {
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

export function useMutationObserverCallback<T extends HTMLElement = HTMLElement>({
  ref,
  onMutate,
  options = {},
}: F.RHook.UseMutationObserverParam<T>) {
  useEffect(() => {
    if (!ref.current) return

    const obs = new MutationObserver(([record]) => onMutate?.(record))
    obs.observe(ref.current, options)

    return obs.disconnect.bind(obs)
  }, [ref, onMutate, options])
}

export function useResizeObserver<T extends HTMLElement = HTMLElement>({
  ref,
  onResize,
  throttle = 0,
  options = {},
}: F.RHook.UseResizeObserverParam<T>) {
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
      _.throttled(([entry]: ResizeObserverEntry[]) => {
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

export function useResizeObserverCallback<T extends HTMLElement = HTMLElement>({
  ref,
  onResize,
  throttle = 0,
  options = {},
}: F.RHook.UseResizeObserverParam<T>) {
  useEffect(() => {
    if (!ref.current) return

    const obs = new ResizeObserver(
      _.throttled(([entry]: ResizeObserverEntry[]) => onResize?.(entry), throttle)
    )
    obs.observe(ref.current, options)

    return obs.disconnect.bind(obs)
  }, [ref, throttle, options, onResize])
}
