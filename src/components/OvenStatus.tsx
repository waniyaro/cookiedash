import React, { useState, useEffect } from 'react'
import { RefreshCw, Cpu, Layers, ShieldCheck, ExternalLink, Activity } from 'lucide-react'
import type { NetworkMetrics } from '../services/network'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

interface OvenStatusProps {
  metrics: NetworkMetrics | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export const OvenStatus: React.FC<OvenStatusProps> = ({
  metrics,
  loading,
  error,
  refresh,
}) => {
  const [secondsAgo, setSecondsAgo] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!metrics?.lastUpdated) return
    const updateTicker = () => {
      setSecondsAgo(Math.max(0, Math.floor((Date.now() - metrics.lastUpdated) / 1000)))
    }
    updateTicker()
    const timer = setInterval(updateTicker, 1000)
    return () => clearInterval(timer)
  }, [metrics?.lastUpdated])

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await refresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  return (
    <div className="rounded-3xl bg-cookie-card border border-cookie-border p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cookie-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">
              Network Telemetry
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              rpc.cookiescan.io
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">
            {metrics ? `${secondsAgo}s ago` : 'Syncing'}
          </span>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || loading}
            className="p-1.5 rounded-lg bg-cookie-surface hover:bg-cookie-border text-slate-400 hover:text-white transition disabled:opacity-50"
            title="Refresh RPC Stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || loading ? 'animate-spin text-cookie-blue' : ''}`} />
          </button>
        </div>
      </div>

      {error && !metrics && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          ⚠️ Connecting to Cookie Chain node...
        </div>
      )}

      {/* Metrics List */}
      <div className="mt-5 space-y-3">
        {/* Metric 1: TPS */}
        <div className="p-4 rounded-2xl bg-cookie-surface border border-cookie-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-slate-400">THROUGHPUT (TPS)</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              OPTIMAL
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {metrics ? metrics.tps : '--'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              tx / sec
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(20, (metrics?.tps || 1) * 3))}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Slot & Epoch */}
        <div className="p-4 rounded-2xl bg-cookie-surface border border-cookie-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cookie-blue" />
              SLOT INDEX
            </span>
            <span className="text-xs font-mono text-cookie-blue">
              Epoch {metrics ? metrics.epoch : '--'}
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {metrics ? `#${metrics.currentSlot.toLocaleString()}` : 'Syncing...'}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Epoch Progress</span>
            <span className="text-slate-200">{metrics ? `${metrics.epochProgressPercent}%` : '--'}</span>
          </div>
          <div className="mt-1 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics?.epochProgressPercent || 0}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Validators & SVM Core */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-cookie-surface border border-cookie-border">
            <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Validators
            </span>
            <span className="text-lg font-bold text-white font-mono">
              {metrics ? metrics.activeValidators : '--'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-cookie-surface border border-cookie-border">
            <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cookie-blue" />
              SVM Core
            </span>
            <span className="text-xs font-bold font-mono text-white block truncate">
              v{metrics ? metrics.solanaCoreVersion : '4.1.2'}
            </span>
          </div>
        </div>
      </div>

      {/* Explorer link */}
      <div className="mt-4 pt-3.5 border-t border-cookie-border flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Block Explorer</span>
        <a
          href={COOKIE_CHAIN_CONFIG.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cookie-blue hover:underline flex items-center gap-1 font-semibold font-mono"
        >
          cookiescan.io
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
