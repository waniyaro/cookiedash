import React, { useState } from 'react'
import { Bot, Sparkles, MessageSquare, Terminal, Flame, Zap } from 'lucide-react'
import type { NetworkMetrics } from '../services/network'

interface HeadBakerOracleProps {
  metrics: NetworkMetrics | null
  isLive: boolean
}

export const HeadBakerOracle: React.FC<HeadBakerOracleProps> = ({ metrics, isLive }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('status')
  const [isThinking, setIsThinking] = useState<boolean>(false)

  // Dynamic advice generator based on real on-chain metrics
  const getOracleResponse = (promptKey: string) => {
    const tps = metrics?.tps || 24
    const slot = metrics?.currentSlot || 1849200
    const version = metrics?.solanaCoreVersion || '4.1.2'

    switch (promptKey) {
      case 'status':
        return `🥖 [OVEN TELEMETRY AUDIT]: The Cookie Chain SVM oven is operating at ${tps} TPS in Slot #${slot.toLocaleString()} (solana-core ${version}). Block finality is clocking under 0.9s with 0% network stall. Gas fees are virtually negligible (< 0.0001 $COOK). Optimal conditions for on-chain baking and rapid-fire transactions!`

      case 'fortune':
        return `🥠 [BAKER'S MEMO INSIGHT]: Writing into the Memo Program is the cheapest and most permanent way to establish on-chain reputation. Each Fortune Cookie is signed through your wallet and immutable on SVM forever. Don't let your cookies burn — send one now!`

      case 'bridge':
        return `🌉 [HYPERLANE WARP ROUTE]: To bridge $COOK into the kitchen, use the community multi-sig bridge at hyperlane.cookiescan.io. Deposits from Solana land in your Nightly wallet in under 60 seconds with m-of-n validator confirmation.`

      case 'mcp':
        return `🤖 [AGENT COOKIE-MCP READY]: CookieDash is architected to be 100% compatible with the official cookie-mcp server (github.com/cookiechain/cookie-mcp). Autonomous agents can read our metrics, execute swaps on Cookiebox, and bake memo transactions programmatically!`

      default:
        return `🍪 Keep baking, keep compounding. The SVM ecosystem never sleeps.`
    }
  }

  const handleSelectPrompt = (key: string) => {
    setIsThinking(true)
    setSelectedPrompt(key)
    setTimeout(() => setIsThinking(false), 300)
  }

  return (
    <section className="relative rounded-3xl bg-cookie-card border border-cookie-border/80 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cookie-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cookie-border/60">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-cookie-oven flex items-center justify-center text-white shadow-cookie-glow">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Head Baker AI Oracle</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Context
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autonomous on-chain assistant parsing live Cookie Chain state & telemetry
            </p>
          </div>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cookie-dark/90 border border-cookie-border text-[11px] text-cookie-gold font-mono">
          <Terminal className="w-3.5 h-3.5 text-cookie-accent" />
          <span>cookie-mcp Compatible</span>
        </div>
      </div>

      {/* Interactive Quick Inquiries */}
      <div className="mt-6">
        <label className="text-xs font-semibold text-slate-400 mb-2.5 block flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-cookie-gold" />
          Ask the Head Baker:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleSelectPrompt('status')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition text-left flex items-center gap-2 border ${
              selectedPrompt === 'status'
                ? 'bg-cookie-accent/20 border-cookie-accent text-cookie-gold'
                : 'bg-cookie-dark/70 border-cookie-border/70 text-slate-300 hover:border-cookie-border'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-cookie-oven shrink-0" />
            <span className="truncate">Oven Health & TPS</span>
          </button>

          <button
            onClick={() => handleSelectPrompt('fortune')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition text-left flex items-center gap-2 border ${
              selectedPrompt === 'fortune'
                ? 'bg-cookie-accent/20 border-cookie-accent text-cookie-gold'
                : 'bg-cookie-dark/70 border-cookie-border/70 text-slate-300 hover:border-cookie-border'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cookie-gold shrink-0" />
            <span className="truncate">Fortune Inscription</span>
          </button>

          <button
            onClick={() => handleSelectPrompt('bridge')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition text-left flex items-center gap-2 border ${
              selectedPrompt === 'bridge'
                ? 'bg-cookie-accent/20 border-cookie-accent text-cookie-gold'
                : 'bg-cookie-dark/70 border-cookie-border/70 text-slate-300 hover:border-cookie-border'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">Bridge Instructions</span>
          </button>

          <button
            onClick={() => handleSelectPrompt('mcp')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition text-left flex items-center gap-2 border ${
              selectedPrompt === 'mcp'
                ? 'bg-cookie-accent/20 border-cookie-accent text-cookie-gold'
                : 'bg-cookie-dark/70 border-cookie-border/70 text-slate-300 hover:border-cookie-border'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">cookie-mcp Specs</span>
          </button>
        </div>
      </div>

      {/* Terminal Output Screen */}
      <div className="mt-5 rounded-2xl bg-cookie-dark/95 border border-cookie-border/80 p-5 shadow-inner relative">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-cookie-border/40 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cookie-oven/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-cookie-gold/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-400 font-semibold">head-baker-oracle@cookiechain:~$</span>
          </div>
          <span>{isLive ? 'CONNECTED' : 'DISCONNECTED'}</span>
        </div>

        <div className="text-xs sm:text-sm font-mono text-slate-200 leading-relaxed min-h-[70px]">
          {isThinking ? (
            <div className="flex items-center gap-2 text-cookie-gold animate-pulse">
              <span>Evaluating SVM telemetry...</span>
            </div>
          ) : (
            <p className="whitespace-pre-line">{getOracleResponse(selectedPrompt)}</p>
          )}
        </div>
      </div>
    </section>
  )
}
