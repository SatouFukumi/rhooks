import type { MilliSec } from "./types"
import { useCallback, useEffect, useRef, useState } from "react"

export const useInterval = (callback: () => any, ms: MilliSec) => {
  const intervalIdRef = useRef<NodeJS.Timer>()
  const [play, setPlay] = useState(true)

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      if (play) callback()
    }, ms)

    return () => clearInterval(intervalIdRef.current)
  }, [callback, ms, play])

  return {
    start() {
      if (play) return
      setPlay(true)
    },

    stop() {
      if (!play) return
      setPlay(false)
    },
  }
}

class IntervalBucket {
  public interval: NodeJS.Timer
  public callbacks: (() => any)[] = []
  constructor(public ms: MilliSec) {
    this.interval = setTimeout(() => this.callbacks.forEach((f) => f()))
  }
}

const intervalBucketMap = new Map<MilliSec, IntervalBucket>()

const createIntervalBucket = (ms: MilliSec): IntervalBucket => {
  const bucket: IntervalBucket = new IntervalBucket(ms)
  intervalBucketMap.set(ms, bucket)
  return bucket
}

const getIntervalBucket = (ms: MilliSec): IntervalBucket => {
  const bucket = intervalBucketMap.get(ms)
  if (!bucket) return createIntervalBucket(ms)
  return bucket
}

const addToIntervalBucket = (ms: MilliSec, callback: () => any) => {
  const bucket = getIntervalBucket(ms)
  bucket.callbacks.push(callback)
}

const removeFromIntervalBucket = (ms: MilliSec, callback: () => any) => {
  const bucket = getIntervalBucket(ms)

  bucket.callbacks = bucket.callbacks.filter((c) => c !== callback)

  if (bucket.callbacks.length === 0) {
    clearInterval(bucket.interval)
    intervalBucketMap.delete(ms)
  }
}

export const useSynchronizedInterval = (callback: () => any, ms: MilliSec) => {
  const [play, setPlay] = useState(true)

  const cb = useCallback(() => play && callback(), [callback, play])

  useEffect(() => {
    addToIntervalBucket(ms, cb)
    return () => removeFromIntervalBucket(ms, cb)
  }, [cb, ms])

  return {
    start() {
      setPlay(true)
    },
    stop() {
      setPlay(false)
    },
  }
}
