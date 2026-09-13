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
    <div id="telemetry-section" className="rounded-2xl bg-[#120703]/90 border border-[#381608] p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2e1307]">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 group">
            <Radio className="w-4 h-4 transition-transform group-hover:scale-110 text-amber-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-[#fffbeb] text-lg tracking-tight">
                Hearth Gauges
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold uppercase">
                Live Feed
              </span>
            </div>
            <p className="text-xs text-amber-200/70 font-mono mt-0.5">
              rpc.cookiescan.io
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-amber-400/80">
            {metrics ? `${secondsAgo}s ago` : 'Syncing'}
          </span>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || loading}
            className="p-1.5 rounded-lg bg-[#1e0d06] hover:bg-[#2b1409] text-amber-300 hover:text-white transition disabled:opacity-50 hover:rotate-45 border border-[#3d1a0c]"
            title="Refresh RPC Stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {error && !metrics && (
        <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs">
          ⚠️ Connecting to Cookie Chain node...
        </div>
      )}

      {/* Metrics List */}
      <div className="mt-4 space-y-3">
        {/* Metric 1: Throughput */}
        <div className="p-3.5 rounded-xl bg-[#0a0402] border border-[#2e1307] shadow-inner">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-amber-400/70 font-bold tracking-wider">THROUGHPUT GAUGE</span>
            <span className="text-[10px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
              OPTIMAL
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#fffbeb] font-mono">
              {metrics ? metrics.tps : '--'}
            </span>
            <span className="text-xs font-mono text-amber-300/80">
              tx / sec
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full bg-[#1e0d06] rounded-full overflow-hidden border border-[#381608]">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
              style={{ width: `${Math.min(100, Math.max(20, (metrics?.tps || 1) * 3))}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Slot & Epoch */}
        <div className="p-3.5 rounded-xl bg-[#0a0402] border border-[#2e1307] shadow-inner">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase text-amber-400/70 font-bold tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-amber-400" />
              BLOCK SLOT INDEX
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">
              Epoch {metrics ? metrics.epoch : '--'}
            </span>
          </div>
          <div className="text-xl font-black font-mono text-[#fffbeb]">
            {metrics ? `#${metrics.currentSlot.toLocaleString()}` : 'Syncing...'}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-amber-200/80 font-mono">
            <span>Epoch Batch Progress</span>
            <span className="text-amber-300 font-bold">{metrics ? `${metrics.epochProgressPercent}%` : '--'}</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full bg-[#1e0d06] rounded-full overflow-hidden border border-[#381608]">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
              style={{ width: `${metrics?.epochProgressPercent || 0}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Active Bakers & SVM Engine */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-[#0a0402] border border-[#2e1307] shadow-inner">
            <span className="text-[10px] font-mono uppercase text-amber-400/70 font-bold tracking-wider flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              Active Nodes
            </span>
            <span className="text-lg font-black text-[#fffbeb] font-mono">
              {metrics ? metrics.activeValidators : '--'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0a0402] border border-[#2e1307] shadow-inner">
            <span className="text-[10px] font-mono uppercase text-amber-400/70 font-bold tracking-wider flex items-center gap-1 mb-1">
              <Cpu className="w-3 h-3 text-amber-400" />
              Engine
            </span>
            <span className="text-xs font-black font-mono text-amber-300 block truncate">
              SVM v{metrics ? metrics.solanaCoreVersion : '4.1.2'}
            </span>
          </div>
        </div>
      </div>

      {/* Explorer link */}
      <div className="mt-4 pt-3.5 border-t border-[#2e1307] flex items-center justify-between text-xs">
        <span className="text-amber-200/70">Block Explorer</span>
        <a
          href={COOKIE_CHAIN_CONFIG.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-200 hover:underline flex items-center gap-1 font-bold font-mono"
        >
          cookiescan.io
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
