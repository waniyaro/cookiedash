import React, { useState, useEffect } from 'react'
import { RefreshCw, Cpu, Layers, ShieldCheck, ExternalLink, Radio } from 'lucide-react'
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
    <div id="telemetry-section" className="rounded-2xl bg-cookie-card border border-cookie-border/80 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cookie-border/60">
        <div className="flex items-center gap-2.5">
          <div className="relative p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group">
            <Radio className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base tracking-tight">
                Node Telemetry
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
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
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-50 hover:rotate-45 border border-slate-800"
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
      <div className="mt-4 space-y-2.5">
        {/* Metric 1: TPS */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">THROUGHPUT</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              OPTIMAL
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {metrics ? metrics.tps : '--'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              tx / sec
            </span>
          </div>
          <div className="mt-2 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(20, (metrics?.tps || 1) * 3))}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Slot & Epoch */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-sky-400" />
              SLOT INDEX
            </span>
            <span className="text-[11px] font-mono text-sky-400 font-semibold">
              Epoch {metrics ? metrics.epoch : '--'}
            </span>
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {metrics ? `#${metrics.currentSlot.toLocaleString()}` : 'Syncing...'}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Epoch Progress</span>
            <span className="text-slate-300 font-semibold">{metrics ? `${metrics.epochProgressPercent}%` : '--'}</span>
          </div>
          <div className="mt-1 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${metrics?.epochProgressPercent || 0}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Validators & SVM Core */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Validators
            </span>
            <span className="text-base font-bold text-white font-mono">
              {metrics ? metrics.activeValidators : '--'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold flex items-center gap-1 mb-1">
              <Cpu className="w-3 h-3 text-sky-400" />
              SVM Core
            </span>
            <span className="text-xs font-bold font-mono text-white block truncate">
              v{metrics ? metrics.solanaCoreVersion : '4.1.2'}
            </span>
          </div>
        </div>
      </div>

      {/* Explorer link */}
      <div className="mt-3.5 pt-3 border-t border-cookie-border/60 flex items-center justify-between text-[11px]">
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
