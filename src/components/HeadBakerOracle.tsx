import React, { useState } from 'react'
import { Bot, Terminal, Activity, BookOpen, Layers } from 'lucide-react'
import type { NetworkMetrics } from '../services/network'

interface HeadBakerOracleProps {
  metrics: NetworkMetrics | null
  isLive: boolean
}

export const HeadBakerOracle: React.FC<HeadBakerOracleProps> = ({ metrics, isLive }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('status')
  const [isThinking, setIsThinking] = useState<boolean>(false)

  const getOracleResponse = (promptKey: string) => {
    const tps = metrics?.tps || 24
    const slot = metrics?.currentSlot || 1849200
    const version = metrics?.solanaCoreVersion || '4.1.2'

    switch (promptKey) {
      case 'status':
        return `[NODE TELEMETRY]: Cookie Chain SVM cluster active at ${tps} TPS in Slot #${slot.toLocaleString()} (solana-core ${version}). Sub-second finality is healthy with 0% network stall. Gas fees < 0.0001 $COOK. Optimal throughput for on-chain execution.`

      case 'fortune':
        return `[MEMO SPECIFICATION]: Writing to the Solana Memo Program (MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr) establishes permanent on-chain data with near-zero gas overhead. Messages are signed by the wallet and immutably indexed by CookieScan.`

      case 'bridge':
        return `[HYPERLANE WARP ROUTE]: To bridge $COOK, use the community multi-sig bridge at hyperlane.cookiescan.io. Deposits from Solana confirm in your Nightly wallet in under 60 seconds with m-of-n validator safety.`

      case 'mcp':
        return `[AGENT COOKIE-MCP]: Fully compatible with the official cookie-mcp server (github.com/cookiechain/cookie-mcp). Autonomous agents can read our metrics and invoke memo inscriptions programmatically via standard MCP stdio.`

      default:
        return `Cookie Chain SVM is operational.`
    }
  }

  const handleSelectPrompt = (key: string) => {
    setIsThinking(true)
    setSelectedPrompt(key)
    setTimeout(() => setIsThinking(false), 200)
  }

  return (
    <div className="rounded-3xl bg-cookie-card border border-cookie-border p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cookie-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">
              Head Baker AI
            </h3>
            <p className="text-[11px] text-slate-400">Contextual Telemetry Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cookie-surface border border-cookie-border text-[10px] text-sky-400 font-mono">
          <Terminal className="w-3 h-3" />
          <span>cookie-mcp</span>
        </div>
      </div>

      {/* Query Selector Tabs */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => handleSelectPrompt('status')}
          className={`group px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 text-left flex items-center gap-2 border ${
            selectedPrompt === 'status'
              ? 'bg-sky-500/15 border-sky-500/30 text-sky-300 shadow-sm'
              : 'bg-cookie-surface border-cookie-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="truncate">Node Status</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('fortune')}
          className={`group px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 text-left flex items-center gap-2 border ${
            selectedPrompt === 'fortune'
              ? 'bg-sky-500/15 border-sky-500/30 text-sky-300 shadow-sm'
              : 'bg-cookie-surface border-cookie-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="truncate">Memo Docs</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('bridge')}
          className={`group px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 text-left flex items-center gap-2 border ${
            selectedPrompt === 'bridge'
              ? 'bg-sky-500/15 border-sky-500/30 text-sky-300 shadow-sm'
              : 'bg-cookie-surface border-cookie-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="truncate">Bridge Route</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('mcp')}
          className={`group px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 text-left flex items-center gap-2 border ${
            selectedPrompt === 'mcp'
              ? 'bg-sky-500/15 border-sky-500/30 text-sky-300 shadow-sm'
              : 'bg-cookie-surface border-cookie-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className="truncate">cookie-mcp</span>
        </button>
      </div>

      {/* Terminal Display */}
      <div className="mt-4 rounded-2xl bg-cookie-surface border border-cookie-border p-4 font-mono text-xs">
        <div className="flex items-center justify-between text-[10px] text-slate-500 pb-2 mb-2 border-b border-slate-800">
          <span className="text-sky-400 font-semibold">oracle@cookiechain</span>
          <span>{isLive ? 'CONNECTED' : 'POLLING'}</span>
        </div>

        <div className="text-slate-300 leading-relaxed min-h-[60px]">
          {isThinking ? (
            <span className="text-sky-400 animate-pulse">Evaluating on-chain telemetry...</span>
          ) : (
            <p className="whitespace-pre-line">{getOracleResponse(selectedPrompt)}</p>
          )}
        </div>
      </div>
    </div>
  )
}
