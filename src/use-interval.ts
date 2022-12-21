import type { MilliSec } from "./types"
import { useCallback, useEffect, useRef } from "react"

/**
 * 
 * @param       callback        I strongly recommend using a passed in `useCallback`, since if you are 
 * working with states in this callback, it'll block the render flow and u'll have to deal 
 * with a lot of debug
 * @param       ms 
 */
export const useInterval = (callback: () => any, ms: MilliSec) => {
  const intervalIdRef = useRef<NodeJS.Timer>()
  const toPlayRef = useRef<boolean>(true)
  const cb = useCallback(() => toPlayRef.current && callback(), [callback])

  useEffect(() => {
    intervalIdRef.current = setInterval(cb, ms)
    return () => clearInterval(intervalIdRef.current)
  }, [cb, ms])

  return {
    start() {
      toPlayRef.current = true
    },

    stop() {
      toPlayRef.current = false
    },
  }
}

class IntervalBucket {
  public interval: NodeJS.Timer
  public callbacks: (() => any)[] = []
  constructor(public ms: MilliSec) {
    this.interval = setInterval(() => this.callbacks.forEach((f) => f()), this.ms)
  }
}

const intervalBucketMap = new Map<MilliSec, IntervalBucket>()

const createIntervalBucket = (ms: MilliSec): IntervalBucket => {
  const bucket: IntervalBucket = new IntervalBucket(ms)
  intervalBucketMap.set(ms, bucket)
  return bucket
}

const getIntervalBucket = (ms: MilliSec): IntervalBucket => {
  return intervalBucketMap.has(ms)
    ? intervalBucketMap.get(ms)!
    : createIntervalBucket(ms)
}

const addCallbackToIntervalBucket = (ms: MilliSec, callback: () => any) => {
  const bucket = getIntervalBucket(ms)
  bucket.callbacks.push(callback)
}

const removeCallbackFromIntervalBucket = (ms: MilliSec, callback: () => any) => {
  const bucket = getIntervalBucket(ms)

  bucket.callbacks = bucket.callbacks.filter((c) => c !== callback)

  if (bucket.callbacks.length === 0) {
    clearInterval(bucket.interval)
    intervalBucketMap.delete(ms)
  }
}

/**
 * 
 * @param       callback        I strongly recommend using a passed in `useCallback`, since if you are 
 * working with states in this callback, it'll block the render flow and u'll have to deal 
 * with a lot of debug
 * @param       ms 
 */
export const useSynchronizedInterval = (callback: () => any, ms: MilliSec) => {
  const toPlayRef = useRef(true)
  const cb = useCallback(() => toPlayRef.current && callback(), [callback])
  
  useEffect(() => {
    addCallbackToIntervalBucket(ms, cb)
    return () => removeCallbackFromIntervalBucket(ms, cb)
  }, [cb, ms])

  return {
    start() {
      toPlayRef.current = true
    },
    stop() {
      toPlayRef.current = false
    },
  }
}
