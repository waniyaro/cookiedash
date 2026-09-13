import React from 'react'
import { Sparkles, Send, Activity, Bot, ExternalLink } from 'lucide-react'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

export const HeroBanner: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="space-y-4 pt-1 pb-2">
      {/* Page Title & Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cookie-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              On-Chain Terminal
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Cookie Chain
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Interactive playground for Solana Memo inscriptions, token transfers, and live telemetry.
          </p>
        </div>

        {/* Quick Nav Anchors */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => scrollTo('fortune-oven')}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cookie-card hover:bg-cookie-surface border border-cookie-border hover:border-amber-500/40 text-xs font-medium text-slate-300 hover:text-white transition duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Fortune Oven</span>
          </button>

          <button
            onClick={() => scrollTo('vault-section')}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cookie-card hover:bg-cookie-surface border border-cookie-border hover:border-sky-500/40 text-xs font-medium text-slate-300 hover:text-white transition duration-200"
          >
            <Send className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
            <span>Transfer Vault</span>
          </button>

          <button
            onClick={() => scrollTo('telemetry-section')}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cookie-card hover:bg-cookie-surface border border-cookie-border hover:border-emerald-500/40 text-xs font-medium text-slate-300 hover:text-white transition duration-200"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Telemetry</span>
          </button>

          <button
            onClick={() => scrollTo('oracle-section')}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cookie-card hover:bg-cookie-surface border border-cookie-border hover:border-purple-500/40 text-xs font-medium text-slate-300 hover:text-white transition duration-200"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span>Oracle</span>
          </button>

          <a
            href={COOKIE_CHAIN_CONFIG.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cookie-card hover:bg-cookie-surface border border-cookie-border hover:border-slate-600 text-xs font-medium text-slate-400 hover:text-white transition duration-200"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>
    </div>
  )
}
