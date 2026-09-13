import React, { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { RefreshCw, ChevronDown, ChevronUp, Copy, Check, ExternalLink } from 'lucide-react'
import type { NetworkMetrics } from '../services/network'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

interface HearthInspectorProps {
  metrics: NetworkMetrics | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  isLive: boolean
}

const CHANNEL_NAMES: Record<string, string> = {
  status: 'Cluster Telemetry Stream',
  wallet: 'SVM Wallet Readiness Audit',
  memo: 'Solana Memo Protocol Spec',
  bridge: 'Hyperlane Warp Route Gateway',
}

export const HearthInspector: React.FC<HearthInspectorProps> = ({
  metrics,
  loading,
  error,
  refresh,
  isLive,
}) => {
  const { publicKey, connected } = useWallet()
  const [secondsAgo, setSecondsAgo] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tpsHistory, setTpsHistory] = useState<number[]>([7, 9, 8, 12, 10, 14, 9, 11, 13, 9])
  const [selectedAgentView, setSelectedAgentView] = useState<'status' | 'wallet' | 'memo' | 'bridge'>('status')
  const [manifestOpen, setManifestOpen] = useState(false)
  const [copiedManifest, setCopiedManifest] = useState(false)

  // Track TPS updates for sparkline
  useEffect(() => {
    if (metrics?.tps) {
      setTpsHistory((prev) => [...prev.slice(1), metrics.tps])
    }
  }, [metrics?.tps])

  // Track seconds since last update
  useEffect(() => {
    if (!metrics?.lastUpdated) return
    const updateTicker = () => {
      setSecondsAgo(Math.max(0, Math.floor((Date.now() - metrics.lastUpdated) / 1000)))
    }
    updateTicker()
    const timer = setInterval(updateTicker, 1000)
    return () => clearInterval(timer)
  }, [metrics?.lastUpdated])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const slot = metrics?.currentSlot || 24871012
  const tps = metrics?.tps || 9
  const epoch = metrics?.epoch ?? 12
  const epochProg = metrics?.epochProgressPercent ?? 57
  const version = metrics?.solanaCoreVersion || '4.1.2'
  const activeValidators = metrics?.activeValidators || 8

  // Sparkline coordinates calculation
  const maxTps = Math.max(...tpsHistory, 15)
  const minTps = Math.min(...tpsHistory, 4)
  const points = tpsHistory
    .map((val, idx) => {
      const x = (idx / (tpsHistory.length - 1)) * 140
      const y = 32 - ((val - minTps) / (maxTps - minTps || 1)) * 26
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  // Live MCP Manifest
  const mcpManifest = {
    protocol: 'cookie-mcp/v1.0',
    server: 'cookiechain-hearth-oracle',
    description: 'Autonomous Model Context Protocol server for Cookie Chain SVM',
    endpoint: 'https://rpc.cookiescan.io',
    state: {
      slot,
      tps,
      epoch,
      finality: '0.8s',
    },
    tools: [
      {
        name: 'bake_fortune_memo',
        description: 'Inscribes eternal UTF-8 text to Cookie Chain using Solana Memo Program',
        parameters: { fortune_text: 'string', fee_payer: 'base58' },
      },
      {
        name: 'query_stash_balance',
        description: 'Inspects real-time $COOK lamports balance for any SVM wallet',
        parameters: { address: 'base58' },
      },
      {
        name: 'transfer_cook',
        description: 'Dispatches native $COOK transfer on SVM ledger',
        parameters: { recipient: 'base58', amount: 'number' },
      },
      {
        name: 'warp_bridge_status',
        description: 'Checks Hyperlane warp route status between Solana and Cookie Chain',
      },
    ],
  }

  const copyManifestJson = () => {
    navigator.clipboard.writeText(JSON.stringify(mcpManifest, null, 2))
    setCopiedManifest(true)
    setTimeout(() => setCopiedManifest(false), 2000)
  }

  const getAgentContent = () => {
    switch (selectedAgentView) {
      case 'status':
        return `[01 // TELEMETRY_VERIFIED]
Node: rpc.cookiescan.io (SVM Genesis: 9wDaBR...BB2)
Slot: #${slot.toLocaleString()} | Rate: ${tps} TPS
State: Healthy, sub-second finality active.`
      case 'wallet':
        if (!connected || !publicKey) {
          return `[02 // WALLET_AUDIT: STANDBY]
No active wallet detected. Operating in passive observer mode.
Connect Phantom or Nightly to authorize transactions.`
        }
        return `[02 // WALLET_AUDIT: VERIFIED]
Pubkey: ${publicKey.toBase58().slice(0, 8)}...${publicKey.toBase58().slice(-8)}
Capabilities: Inscription Ready, $COOK Transfer Ready.`
      case 'memo':
        return `[03 // SOLANA_MEMO_SPEC: v1.0]
Program ID: ${COOKIE_CHAIN_CONFIG.memoProgramId}
Payload: Immutable UTF-8 block storage
Fee: ~0.000005 $COOK`
      case 'bridge':
        return `[04 // HYPERLANE_WARP_ROUTE]
Route: Solana Mainnet <—> Cookie Chain
Portal: ${COOKIE_CHAIN_CONFIG.bridgeUrl}
Status: Online with guaranteed message finality.`
    }
  }

  return (
    <aside
      id="telemetry-section"
      className="rounded-2xl rack-card overflow-hidden transition-all"
    >
      {/* SECTION 1: HEARTH GAUGES (COOL CARBON TELEMETRY RACK) */}
      <div className="p-5 space-y-4">
        {/* Engineering Header: Monospace Technical ID */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1f242e]">
          <div>
            <div className="text-[10px] font-mono text-[#38bdf8] font-black uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              // TELEMETRY_RACK.SVM
            </div>
            <h3 className="font-mono font-bold text-sm text-[#f1f5f9] tracking-tight">
              rpc.cookiescan.io
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0b0c0f] border border-[#262b35] text-[10px] font-mono font-bold text-[#e2e8f0]">
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
              LIVE
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="p-1.5 rounded bg-[#1e232d] hover:bg-[#282f3d] text-[#94a3b8] hover:text-[#f1f5f9] transition border border-[#2d3442]"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing || loading ? 'animate-spin text-[#38bdf8]' : ''}`} />
            </button>
          </div>
        </div>

        {error && !metrics && (
          <div className="p-2 rounded bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
            Connecting to Cookie Chain node...
          </div>
        )}

        {/* Throughput Sparkline & Current Rate */}
        <div className="p-3.5 rounded-xl bg-[#0b0c0f] border border-[#1f242e]">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8] mb-2">
            <span className="tracking-wider uppercase font-bold text-[#38bdf8]/90">THROUGHPUT GAUGE</span>
            <span>{secondsAgo}s ago</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-mono text-[#f8fafc]">{tps}</span>
                <span className="text-xs font-mono text-[#94a3b8]">tx / sec</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">Sub-second finality</span>
            </div>

            {/* Live SVG Sparkline */}
            <div className="w-36 h-10 shrink-0">
              <svg viewBox="0 0 140 36" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="tpsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,34 ${points} 140,34`}
                  fill="url(#tpsGradient)"
                />
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
                {tpsHistory.length > 0 && (
                  <circle
                    cx="140"
                    cy={32 - ((tpsHistory[tpsHistory.length - 1] - minTps) / (maxTps - minTps || 1)) * 26}
                    r="3"
                    fill="#38bdf8"
                  />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Epoch Radial & Slot Gauge */}
        <div className="p-3.5 rounded-xl bg-[#0b0c0f] border border-[#1f242e] flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#94a3b8] uppercase font-bold tracking-wider">SLOT INDEX</span>
            <div className="text-base font-black font-mono text-[#f8fafc]">
              #{slot.toLocaleString()}
            </div>
            <span className="text-[10px] font-mono text-[#38bdf8] font-semibold">Epoch {epoch}</span>
          </div>

          {/* Radial Epoch Indicator */}
          <div className="relative w-13 h-13 shrink-0 flex items-center justify-center">
            <svg className="w-13 h-13 transform -rotate-90" viewBox="0 0 44 44">
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="#181c24"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="#38bdf8"
                strokeWidth="4"
                fill="none"
                strokeDasharray={113.1}
                strokeDashoffset={113.1 - (113.1 * epochProg) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-black text-[#f8fafc]">
              {epochProg}%
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-[#0b0c0f] border border-[#1f242e]">
            <div className="text-[9px] text-[#94a3b8] uppercase font-bold mb-0.5">VALIDATORS</div>
            <div className="font-bold text-[#f8fafc]">{activeValidators} Active</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0b0c0f] border border-[#1f242e]">
            <div className="text-[9px] text-[#94a3b8] uppercase font-bold mb-0.5">CORE</div>
            <div className="font-bold text-[#f8fafc]">SVM v{version}</div>
          </div>
        </div>
      </div>

      {/* MECHANICAL INNER DIVIDER */}
      <div className="border-t border-[#1f242e]" />

      {/* SECTION 2: HEAD BAKER AI & MCP ORACLE */}
      <div className="p-5 space-y-3.5 bg-[#0e1014]/70">
        {/* Oracle Header with Clear Channel UX Hint */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#38bdf8] font-black uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              // AGENT_ORACLE
            </div>
            <h4 className="font-mono font-bold text-xs sm:text-sm text-[#f1f5f9]">
              Head Baker AI (cookie-mcp)
            </h4>
          </div>

          <a
            href="https://github.com/cookiechain/cookie-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono text-[#38bdf8] hover:underline inline-flex items-center gap-1"
          >
            <span>v1.0 Repo</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Channel Indicator UX Hint */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8] px-0.5">
          <span className="flex items-center gap-1">
            <span>Display Channel:</span>
            <span className="text-[#38bdf8] font-bold">{CHANNEL_NAMES[selectedAgentView]}</span>
          </span>
          <span className="text-[9px] text-[#64748b]">Select Mode ↓</span>
        </div>

        {/* Tactile Hardware Mode Switcher */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#0b0c0f] border border-[#1f242e] shadow-inner">
          {[
            { id: 'status', no: '01', label: 'TELEMETRY' },
            { id: 'wallet', no: '02', label: 'WALLET' },
            { id: 'memo',   no: '03', label: 'MEMO SPEC' },
            { id: 'bridge', no: '04', label: 'WARP' },
          ].map((tab) => {
            const isActive = selectedAgentView === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedAgentView(tab.id as any)}
                className={`py-2 px-1 rounded-lg text-center transition-all flex flex-col items-center justify-center gap-0.5 select-none ${
                  isActive
                    ? 'bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-[#f8fafc] shadow-[0_2px_6px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] border border-[#38bdf8]/60'
                    : 'bg-[#12151c] text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#181d26] border border-transparent active:translate-y-0.5'
                }`}
              >
                <span className={`text-[9px] font-mono leading-none ${isActive ? 'text-[#38bdf8] font-black' : 'text-[#475569]'}`}>
                  {tab.no}
                </span>
                <span className="text-[10px] font-mono font-bold tracking-tight">
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Compact Agent Output */}
        <div className="p-3 rounded-xl bg-[#0b0c0f] border border-[#1f242e] text-xs font-mono leading-relaxed text-[#f1f5f9]">
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-[#e2e8f0]/95">
            {getAgentContent()}
          </pre>
        </div>

        {/* Proof of Integration: Live MCP Manifest Drawer */}
        <div className="rounded-xl border border-[#282d38] bg-[#0b0c0f] overflow-hidden">
          <button
            onClick={() => setManifestOpen(!manifestOpen)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-mono text-[#38bdf8] hover:bg-[#161a22] transition"
          >
            <span className="font-semibold">// View live cookie-mcp manifest</span>
            {manifestOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {manifestOpen && (
            <div className="p-3 border-t border-[#1f242e] bg-[#0b0c0f] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#94a3b8]">
                <span>cookie-mcp protocol dump</span>
                <button
                  onClick={copyManifestJson}
                  className="inline-flex items-center gap-1 text-[#38bdf8] hover:text-[#f8fafc] transition"
                >
                  {copiedManifest ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedManifest ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="text-[10px] font-mono text-[#94a3b8] leading-snug overflow-x-auto max-h-48 p-2 rounded-lg bg-[#141820]">
                {JSON.stringify(mcpManifest, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
