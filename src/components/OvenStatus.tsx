import React, { useState, useEffect } from 'react'
import { Flame, RefreshCw, Cpu, Layers, ShieldCheck, Zap, ExternalLink } from 'lucide-react'
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
    <section className="relative rounded-3xl bg-cookie-card border border-cookie-border/80 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-cookie-oven/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cookie-accent/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cookie-border/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cookie-oven/20 border border-cookie-oven/30 text-cookie-oven">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Oven Status & Cookie Pulse
              </h2>
              <p className="text-xs text-slate-400">
                Live SVM telemetry polled directly from <span className="font-mono text-cookie-gold">rpc.cookiescan.io</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-mono text-slate-400">
            {metrics ? `Synced ${secondsAgo}s ago` : 'Syncing...'}
          </span>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || loading}
            className="p-2 rounded-xl bg-cookie-dark/80 hover:bg-cookie-border/80 border border-cookie-border text-slate-300 hover:text-white transition disabled:opacity-50"
            title="Refresh Network Stats"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing || loading ? 'animate-spin text-cookie-gold' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && !metrics && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          ⚠️ Unable to reach Cookie Chain RPC endpoint. Retrying in background... ({error})
        </div>
      )}

      {/* Telemetry Metrics Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Oven Heat / TPS */}
        <div className="relative group rounded-2xl bg-cookie-dark/70 border border-cookie-border/60 p-5 hover:border-cookie-oven/50 transition duration-300">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Oven Heat (Live TPS)</span>
            <Flame className="w-4 h-4 text-cookie-oven" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {metrics ? metrics.tps : '--'}
            </span>
            <span className="text-xs text-cookie-gold font-semibold uppercase tracking-wider">
              Tx / sec
            </span>
          </div>
          <div className="mt-3">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cookie-accent to-cookie-oven rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(15, (metrics?.tps || 1) * 3))}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Optimal Bake Speed
              </span>
              <span>~0.8s Blocks</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Current Block & Epoch */}
        <div className="relative group rounded-2xl bg-cookie-dark/70 border border-cookie-border/60 p-5 hover:border-cookie-accent/50 transition duration-300">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Block Height & Epoch</span>
            <Layers className="w-4 h-4 text-cookie-accent" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono tracking-tight">
              {metrics ? `#${metrics.currentSlot.toLocaleString()}` : 'Syncing...'}
            </span>
          </div>
          <div className="mt-3">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cookie-accent rounded-full transition-all duration-500"
                style={{ width: `${metrics?.epochProgressPercent || 0}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Epoch {metrics ? metrics.epoch : '--'}</span>
              <span className="text-cookie-gold font-mono">{metrics ? `${metrics.epochProgressPercent}%` : '--'}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Master Bakers */}
        <div className="relative group rounded-2xl bg-cookie-dark/70 border border-cookie-border/60 p-5 hover:border-blue-500/50 transition duration-300">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">Master Bakers</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">
              {metrics ? metrics.activeValidators : '--'}
            </span>
            <span className="text-xs text-slate-400">Validators</span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Community Consensus Active</span>
          </div>
        </div>

        {/* Metric 4: SVM Architecture & Genesis */}
        <div className="relative group rounded-2xl bg-cookie-dark/70 border border-cookie-border/60 p-5 hover:border-cookie-gold/50 transition duration-300">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium">SVM Infrastructure</span>
            <Cpu className="w-4 h-4 text-cookie-gold" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white font-mono tracking-tight">
              v{metrics ? metrics.solanaCoreVersion : '4.1.2'}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cookie-accent/20 text-cookie-gold">
              SVM Native
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Explorer</span>
            <a
              href={COOKIE_CHAIN_CONFIG.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cookie-gold hover:underline flex items-center gap-1"
            >
              cookiescan.io
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Network Highlights Banner */}
      <div className="mt-6 pt-5 border-t border-cookie-border/40 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <Zap className="w-4 h-4 text-cookie-gold shrink-0" />
          <span><strong>Sub-Second Finality:</strong> ~1s block time with SVM execution speed.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Flame className="w-4 h-4 text-cookie-oven shrink-0" />
          <span><strong>Micro Gas Fees:</strong> Transactions cost less than 0.0001 $COOK.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span><strong>Solana Tooling Compatible:</strong> Native SPL tokens, Memo & Nightly.</span>
        </div>
      </div>
    </section>
  )
}
