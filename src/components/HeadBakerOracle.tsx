import React, { useState } from 'react'
import { Bot, Sparkles, Terminal, Flame, Zap } from 'lucide-react'
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
        return `🥖 [OVEN AUDIT]: Operating at ${tps} TPS in Slot #${slot.toLocaleString()} (solana-core ${version}). Block finality < 0.9s with 0% network stall. Gas fees are negligible (< 0.0001 $COOK). Optimal for baking!`

      case 'fortune':
        return `🥠 [MEMO INSIGHT]: Writing into the Solana Memo Program is the cheapest and most permanent way to establish on-chain reputation. Each Fortune Cookie is signed through your wallet and immutable on SVM forever.`

      case 'bridge':
        return `🌉 [HYPERLANE WARP ROUTE]: To bridge $COOK, use the community multi-sig bridge at hyperlane.cookiescan.io. Deposits from Solana confirm in your Nightly wallet in under 60 seconds with m-of-n validator safety.`

      case 'mcp':
        return `🤖 [COOKIE-MCP READY]: CookieDash is 100% compatible with the official cookie-mcp server (github.com/cookiechain/cookie-mcp). Autonomous agents can read our metrics and execute memo actions programmatically!`

      default:
        return `🍪 Keep baking, keep compounding. The SVM ecosystem moves fast.`
    }
  }

  const handleSelectPrompt = (key: string) => {
    setIsThinking(true)
    setSelectedPrompt(key)
    setTimeout(() => setIsThinking(false), 250)
  }

  return (
    <div className="rounded-3xl bg-cookie-card/90 border border-cookie-border/70 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cookie-border/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-cookie-oven text-cookie-dark font-bold shadow-cookie-glow">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
              Head Baker AI
            </h3>
            <p className="text-[11px] text-slate-400">Contextual SVM Oracle</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] text-cookie-gold font-mono">
          <Terminal className="w-3 h-3" />
          <span>cookie-mcp</span>
        </div>
      </div>

      {/* Query Selector Tabs */}
      <div className="mt-4 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => handleSelectPrompt('status')}
          className={`px-2.5 py-2 rounded-xl text-[11px] font-bold transition text-left flex items-center gap-1.5 border ${
            selectedPrompt === 'status'
              ? 'bg-cookie-accent/20 border-cookie-accent text-cookie-gold'
              : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3 h-3 text-cookie-oven shrink-0" />
          <span className="truncate">Oven Health</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('fortune')}
          className={`px-2.5 py-2 rounded-xl text-[11px] font-bold transition text-left flex items-center gap-1.5 border ${
            selectedPrompt === 'fortune'
              ? 'bg-cookie-accent/20 border-cookie-accent text-cookie-gold'
              : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3 h-3 text-cookie-gold shrink-0" />
          <span className="truncate">Memo Insights</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('bridge')}
          className={`px-2.5 py-2 rounded-xl text-[11px] font-bold transition text-left flex items-center gap-1.5 border ${
            selectedPrompt === 'bridge'
              ? 'bg-cookie-accent/20 border-cookie-accent text-cookie-gold'
              : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3 h-3 text-blue-400 shrink-0" />
          <span className="truncate">Bridge Guide</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('mcp')}
          className={`px-2.5 py-2 rounded-xl text-[11px] font-bold transition text-left flex items-center gap-1.5 border ${
            selectedPrompt === 'mcp'
              ? 'bg-cookie-accent/20 border-cookie-accent text-cookie-gold'
              : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3 h-3 text-purple-400 shrink-0" />
          <span className="truncate">cookie-mcp</span>
        </button>
      </div>

      {/* Terminal Display */}
      <div className="mt-4 rounded-2xl bg-black/40 border border-white/[0.06] p-4 font-mono text-xs">
        <div className="flex items-center justify-between text-[10px] text-slate-500 pb-2 mb-2 border-b border-white/[0.05]">
          <span className="text-cookie-gold font-semibold">oracle@cookiechain</span>
          <span>{isLive ? 'ONLINE' : 'POLLING'}</span>
        </div>

        <div className="text-slate-300 leading-relaxed min-h-[60px]">
          {isThinking ? (
            <span className="text-cookie-gold animate-pulse">Evaluating on-chain telemetry...</span>
          ) : (
            <p className="whitespace-pre-line">{getOracleResponse(selectedPrompt)}</p>
          )}
        </div>
      </div>
    </div>
  )
}
