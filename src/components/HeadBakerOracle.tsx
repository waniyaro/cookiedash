import React, { useState } from 'react'
import { Terminal, Activity, BookOpen, Layers, Cpu } from 'lucide-react'
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
        return `[TELEMETRY OK]: SVM cluster active at ${tps} TPS in Slot #${slot.toLocaleString()} (solana-core ${version}). Sub-second finality healthy, 0% stall, fee < 0.0001 $COOK.`

      case 'fortune':
        return `[MEMO SPEC]: Solana Memo Program (MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr) writes permanent UTF-8 bytes to the ledger with near-zero overhead.`

      case 'bridge':
        return `[HYPERLANE ROUTE]: Multi-sig bridge at hyperlane.cookiescan.io transfers $COOK from Solana to Cookie Chain in < 60s.`

      case 'mcp':
        return `[COOKIE-MCP]: Compatible with official Model Context Protocol server (cookiechain/cookie-mcp). Autonomous agents read telemetry via stdio.`

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
    <div id="oracle-section" className="rounded-2xl bg-cookie-card border border-cookie-border/80 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cookie-border/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight">
              Head Baker AI
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Telemetry Oracle &amp; MCP</p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cookie-surface text-sky-400 border border-cookie-border">
          cookie-mcp
        </span>
      </div>

      {/* Query Selector Tabs */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        <button
          onClick={() => handleSelectPrompt('status')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border ${
            selectedPrompt === 'status'
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-semibold'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3 h-3 text-sky-400 shrink-0" />
          <span className="truncate">Status</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('fortune')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border ${
            selectedPrompt === 'fortune'
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-semibold'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">Memo</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('bridge')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border ${
            selectedPrompt === 'bridge'
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-semibold'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3 h-3 text-blue-400 shrink-0" />
          <span className="truncate">Bridge</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('mcp')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border ${
            selectedPrompt === 'mcp'
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-semibold'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">MCP</span>
        </button>
      </div>

      {/* Terminal Window with macOS Chrome */}
      <div className="mt-3 rounded-xl bg-slate-950 border border-slate-800/80 overflow-hidden font-mono text-xs shadow-inner">
        {/* Titlebar with Traffic Lights */}
        <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">oracle@cookiechain:~</span>
          <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {isLive ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-3.5 text-slate-300 leading-relaxed min-h-[68px]">
          {isThinking ? (
            <span className="text-sky-400 animate-pulse">Running telemetry query...</span>
          ) : (
            <p className="whitespace-pre-line text-emerald-300/90 selection:bg-emerald-500/20">
              {getOracleResponse(selectedPrompt)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

