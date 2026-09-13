import React from 'react'
import { ArrowUpRight, Compass, Shield, Code2, Coins, Layers, BookOpen } from 'lucide-react'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

const ECOSYSTEM_SERVICES = [
  {
    title: 'Cookiebox Swap',
    description: 'Premier DEX liquidity aggregator routing across all pools.',
    url: 'https://cookiebox.app',
    icon: Coins,
    badge: 'DEX',
    accent: 'from-amber-500/15 text-amber-400 border-amber-500/25',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    title: 'Cookieswap',
    description: 'Instant token swapping and liquidity pool deployment.',
    url: COOKIE_CHAIN_CONFIG.swapUrl,
    icon: Layers,
    badge: 'Trading',
    accent: 'from-sky-500/15 text-sky-400 border-sky-500/25',
    iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
  {
    title: 'Hyperlane Warp Bridge',
    description: 'Cross-chain bridge for $COOK between Solana and Cookie Chain.',
    url: COOKIE_CHAIN_CONFIG.bridgeUrl,
    icon: ArrowUpRight,
    badge: 'Bridge',
    accent: 'from-purple-500/15 text-purple-400 border-purple-500/25',
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    title: 'Cookie DAS API',
    description: 'Digital Asset Standard RPC endpoints for developers.',
    url: COOKIE_CHAIN_CONFIG.cookieDasApi,
    icon: Code2,
    badge: 'API',
    accent: 'from-emerald-500/15 text-emerald-400 border-emerald-500/25',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  {
    title: 'cookie-mcp',
    description: 'Model Context Protocol server empowering autonomous AI agents.',
    url: 'https://github.com/cookiechain/cookie-mcp',
    icon: Shield,
    badge: 'AI Agents',
    accent: 'from-cyan-500/15 text-cyan-400 border-cyan-500/25',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  {
    title: 'Cookie Chain Docs',
    description: 'Official SVM guides, genesis specs, and node validator setups.',
    url: COOKIE_CHAIN_CONFIG.docsUrl,
    icon: BookOpen,
    badge: 'Docs',
    accent: 'from-blue-500/15 text-blue-400 border-blue-500/25',
    iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
]

export const EcosystemHub: React.FC = () => {
  return (
    <footer className="mt-12 pt-8 pb-14 border-t border-cookie-border/60">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cookie-card border border-cookie-border text-slate-400">
            <Compass className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">Ecosystem Directory</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
              Verified
            </span>
          </div>
        </div>

        <a
          href={COOKIE_CHAIN_CONFIG.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cookie-card hover:bg-cookie-surface border border-cookie-border text-xs font-medium text-slate-300 hover:text-white transition-all duration-200"
        >
          <span>CookieScan</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ECOSYSTEM_SERVICES.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 rounded-xl bg-cookie-card/90 hover:bg-cookie-surface border border-cookie-border/80 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`p-2 rounded-xl border ${item.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-xs text-white group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h4>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </a>
          )
        })}
      </div>

      {/* Footer Branding Bar */}
      <div className="mt-8 pt-6 border-t border-cookie-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2.5">
          <img
            src="/cookie-sticker.png"
            alt="CookieDash Logo"
            className="w-5 h-5 object-contain"
          />
          <span className="text-white font-bold">CookieDash</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">Community Hackathon</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 font-semibold">rpc.cookiescan.io</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Genesis: 9wDaBR...BB2</span>
        </div>
      </div>
    </footer>
  )
}

