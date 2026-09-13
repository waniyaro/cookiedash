import React from 'react'
import { ArrowUpRight, Compass, Shield, Code2, Coins, Layers, BookOpen } from 'lucide-react'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

const ECOSYSTEM_SERVICES = [
  {
    title: 'Cookiebox Swap',
    description: 'Premier DEX liquidity aggregator routing orders across all on-chain pools.',
    url: 'https://cookiebox.app',
    icon: Coins,
    badge: 'DEX',
    iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  {
    title: 'Cookieswap',
    description: 'Instant token swapping and liquidity pool deployment on Cookie Chain.',
    url: COOKIE_CHAIN_CONFIG.swapUrl,
    icon: Layers,
    badge: 'AMM',
    iconBg: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  },
  {
    title: 'Hyperlane Warp Bridge',
    description: 'Direct multi-sig bridge transporting $COOK between Solana and Cookie Chain.',
    url: COOKIE_CHAIN_CONFIG.bridgeUrl,
    icon: ArrowUpRight,
    badge: 'Bridge',
    iconBg: 'bg-amber-600/15 text-amber-300 border-amber-500/30',
  },
  {
    title: 'Cookie DAS API',
    description: 'Digital Asset Standard RPC endpoints for developers to query tokens.',
    url: COOKIE_CHAIN_CONFIG.cookieDasApi,
    icon: Code2,
    badge: 'RPC & DAS',
    iconBg: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  },
  {
    title: 'cookie-mcp',
    description: 'Official Model Context Protocol server empowering autonomous AI bakery agents.',
    url: 'https://github.com/cookiechain/cookie-mcp',
    icon: Shield,
    badge: 'AI Agents',
    iconBg: 'bg-orange-600/15 text-orange-300 border-orange-500/30',
  },
  {
    title: 'Cookie Chain Docs',
    description: 'Official SVM guides, genesis specs, node validator setups, and hackathon bounties.',
    url: COOKIE_CHAIN_CONFIG.docsUrl,
    icon: BookOpen,
    badge: 'Docs',
    iconBg: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
  },
]

export const EcosystemHub: React.FC = () => {
  return (
    <footer className="mt-14 pt-8 pb-16 border-t border-[#2e1307]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#160a04] border border-[#381608] text-amber-400">
            <Compass className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-black text-[#fffbeb] text-lg tracking-tight">The Pantry &amp; Backdoor Routes</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold uppercase">
              Official Nodes
            </span>
          </div>
        </div>

        <a
          href={COOKIE_CHAIN_CONFIG.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#160a04] hover:bg-[#261106] border border-[#381608] hover:border-amber-500/50 text-xs font-bold text-amber-300 hover:text-white transition-all duration-200 shadow-sm"
        >
          <span>CookieScan</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-500/80 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Grid of Pantry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {ECOSYSTEM_SERVICES.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 rounded-2xl bg-[#0f0603]/90 hover:bg-[#1a0c05] border border-[#2e1307] hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-950/40"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`p-2 rounded-xl border ${item.iconBg} transition-transform duration-200 group-hover:scale-110 shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#1f0d06] text-amber-300 border border-[#3d1a0c]">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-display font-black text-sm text-[#fffbeb] group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500/60 opacity-0 group-hover:opacity-100 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <p className="text-xs text-amber-200/70 mt-1.5 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </a>
          )
        })}
      </div>

      {/* Footer Branding Bar */}
      <div className="mt-10 pt-6 border-t border-[#260e05] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-amber-400/60">
        <div className="flex items-center gap-3">
          <img
            src="/cookie-sticker.png"
            alt="CookieDash Logo"
            className="w-5 h-5 object-contain drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
          />
          <span className="text-[#fffbeb] font-bold">CookieDash</span>
          <span className="text-amber-700">•</span>
          <span className="text-amber-200/80">Night Bakery on Cookie Chain SVM</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-amber-300 font-bold">rpc.cookiescan.io</span>
          <span className="text-amber-700">•</span>
          <span className="text-amber-400/60">Genesis: 9wDaBR...BB2</span>
        </div>
      </div>
    </footer>
  )
}

