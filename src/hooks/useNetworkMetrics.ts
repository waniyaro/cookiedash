import { useState, useEffect, useCallback, useRef } from 'react'
import { useConnection } from '@solana/wallet-adapter-react'
import { fetchNetworkMetrics, type NetworkMetrics } from '../services/network'

export function useNetworkMetrics(pollIntervalMs = 3500) {
  const { connection } = useConnection()
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isLive, setIsLive] = useState<boolean>(false)
  const isMounted = useRef(true)

  const refresh = useCallback(async () => {
    try {
      const data = await fetchNetworkMetrics(connection)
      if (isMounted.current) {
        setMetrics(data)
        setError(null)
        setLoading(false)
        setIsLive(true)
      }
    } catch (err: unknown) {
      if (isMounted.current) {
        const errorMsg = err instanceof Error ? err.message : 'RPC Connection Error'
        setError(errorMsg)
        setIsLive(false)
        setLoading(false)
      }
    }
  }, [connection])

  useEffect(() => {
    isMounted.current = true
    refresh()

    const interval = setInterval(() => {
      refresh()
    }, pollIntervalMs)

    return () => {
      isMounted.current = false
      clearInterval(interval)
    }
  }, [refresh, pollIntervalMs])

  return {
    metrics,
    loading,
    error,
    refresh,
    isLive,
  }
}
