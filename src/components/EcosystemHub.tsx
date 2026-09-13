import React from 'react'
import { ExternalLink, ArrowUpRight, Compass, Shield, Code2, Coins, Layers, BookOpen } from 'lucide-react'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

const ECOSYSTEM_SERVICES = [
  {
    title: 'Cookiebox Swap',
    description: 'Premier DEX liquidity aggregator routing across all Cookie Chain pools.',
    url: 'https://cookiebox.app',
    icon: Coins,
    badge: 'DEX Aggregator',
    accent: 'from-amber-500/20 to-cookie-oven/20 border-cookie-accent/40',
  },
  {
    title: 'Cookieswap / Candy Shop',
    description: 'Instant token swapping and liquidity pool creation on Cookie Chain.',
    url: COOKIE_CHAIN_CONFIG.swapUrl,
    icon: Layers,
    badge: 'Trading Hub',
    accent: 'from-cookie-oven/20 to-rose-500/20 border-cookie-oven/40',
  },
  {
    title: 'Hyperlane Warp Bridge',
    description: 'Instant cross-chain bridge for $COOK between Solana and Cookie Chain.',
    url: COOKIE_CHAIN_CONFIG.bridgeUrl,
    icon: ArrowUpRight,
    badge: 'Multi-Sig Bridge',
    accent: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40',
  },
  {
    title: 'Cookie DAS API',
    description: 'Official Digital Asset Standard API & community RPC infrastructure.',
    url: COOKIE_CHAIN_CONFIG.cookieDasApi,
    icon: Code2,
    badge: 'Developer API',
    accent: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40',
  },
  {
    title: 'cookie-mcp',
    description: 'Official Model Context Protocol server empowering AI agents on Cookie Chain.',
    url: 'https://github.com/cookiechain/cookie-mcp',
    icon: Shield,
    badge: 'AI Agent Server',
    accent: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40',
  },
  {
    title: 'Cookie Chain Docs',
    description: 'Official technical guides, SVM architecture, and validator resources.',
    url: COOKIE_CHAIN_CONFIG.docsUrl,
    icon: BookOpen,
    badge: 'Official Docs',
    accent: 'from-slate-700/30 to-slate-800/30 border-slate-700/60',
  },
]

export const EcosystemHub: React.FC = () => {
  return (
    <footer className="mt-16 pt-12 pb-16 border-t border-cookie-border/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cookie-gold" />
            <h3 className="text-xl font-bold text-white tracking-tight">Cookie Chain Ecosystem</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Direct access to official infrastructure, trading protocols, and developer toolkits
          </p>
        </div>

        <a
          href={COOKIE_CHAIN_CONFIG.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cookie-card hover:bg-cookie-border border border-cookie-border text-xs font-semibold text-slate-200 hover:text-white transition self-start sm:self-auto"
        >
          <span>Open CookieScan Explorer</span>
          <ExternalLink className="w-3.5 h-3.5 text-cookie-gold" />
        </a>
      </div>

      {/* Grid of Ecosystem Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ECOSYSTEM_SERVICES.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-5 rounded-2xl bg-gradient-to-br ${item.accent} border backdrop-blur-md hover:scale-[1.02] transition duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 rounded-xl bg-cookie-dark/70 text-cookie-gold">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cookie-dark/80 text-slate-300 border border-cookie-border/60">
                    {item.badge}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-cookie-gold transition flex items-center gap-1.5">
                  {item.title}
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </a>
          )
        })}
      </div>

      {/* Bottom Copyright & Open Source Tag */}
      <div className="mt-12 pt-6 border-t border-cookie-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>
          CookieDash • Built for the Cookie Chain Community & Superteam Earn Bounty.
        </p>
        <p className="font-mono">
          RPC: <span className="text-cookie-gold">rpc.cookiescan.io</span> • Genesis: <span className="text-slate-400">9wDaBR...BB2</span>
        </p>
      </div>
    </footer>
  )
}
