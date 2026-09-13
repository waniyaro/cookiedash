import React from 'react'
import { Flame, ArrowLeftRight, Radio, Terminal, Compass, ArrowUpRight } from 'lucide-react'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

export const HeroBanner: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="space-y-4 pt-2 pb-2">
      {/* Page Title & Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-[#2e170c]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-3xl sm:text-4xl font-black text-[#fffbeb] tracking-tight">
              Night Bakery <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400">cApp</span>
            </h1>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-950/60 text-amber-300 border border-amber-500/40 shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              420°C SVM OVEN
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#fde68a]/80 font-sans max-w-2xl leading-relaxed">
            Where fortunes are permanently baked into immutable SVM slots, $COOK flows like hot caramel, and autonomous agents whisper recipes.
          </p>
        </div>

        {/* Quick Nav Anchors with Artisanal Tactile Character */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => scrollTo('fortune-oven')}
            className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#160b06] hover:bg-[#24120a] border border-[#3d1e10] hover:border-amber-500/50 text-xs font-semibold text-amber-200 hover:text-white transition duration-200 shadow-sm shadow-amber-950/20 active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 group-hover:text-amber-300 transition-transform" />
            <span>Master Oven</span>
          </button>

          <button
            onClick={() => scrollTo('vault-section')}
            className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#160b06] hover:bg-[#24120a] border border-[#3d1e10] hover:border-amber-500/50 text-xs font-semibold text-amber-200 hover:text-white transition duration-200 shadow-sm shadow-amber-950/20 active:scale-95"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Pastry Vault</span>
          </button>

          <button
            onClick={() => scrollTo('telemetry-section')}
            className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#160b06] hover:bg-[#24120a] border border-[#3d1e10] hover:border-amber-500/50 text-xs font-semibold text-amber-200 hover:text-white transition duration-200 shadow-sm shadow-amber-950/20 active:scale-95"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Gauges</span>
          </button>

          <button
            onClick={() => scrollTo('oracle-section')}
            className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#160b06] hover:bg-[#24120a] border border-[#3d1e10] hover:border-amber-500/50 text-xs font-semibold text-amber-200 hover:text-white transition duration-200 shadow-sm shadow-amber-950/20 active:scale-95"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Baker AI</span>
          </button>

          <a
            href={COOKIE_CHAIN_CONFIG.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#160b06] hover:bg-[#24120a] border border-[#3d1e10] hover:border-amber-500/40 text-xs font-semibold text-amber-300/80 hover:text-amber-200 transition duration-200"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>CookieScan</span>
            <ArrowUpRight className="w-3 h-3 text-amber-500/60 group-hover:text-amber-300 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  )
}
