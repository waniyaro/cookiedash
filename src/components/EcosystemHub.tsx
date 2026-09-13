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
  },
  {
    title: 'Cookieswap / Candy Shop',
    description: 'Instant token swapping and liquidity pool creation on Cookie Chain.',
    url: COOKIE_CHAIN_CONFIG.swapUrl,
    icon: Layers,
    badge: 'Trading Hub',
  },
  {
    title: 'Hyperlane Warp Bridge',
    description: 'Instant cross-chain bridge for $COOK between Solana and Cookie Chain.',
    url: COOKIE_CHAIN_CONFIG.bridgeUrl,
    icon: ArrowUpRight,
    badge: 'Multi-Sig Bridge',
  },
  {
    title: 'Cookie DAS API',
    description: 'Official Digital Asset Standard API & community RPC infrastructure.',
    url: COOKIE_CHAIN_CONFIG.cookieDasApi,
    icon: Code2,
    badge: 'Developer API',
  },
  {
    title: 'cookie-mcp',
    description: 'Official Model Context Protocol server empowering AI agents on Cookie Chain.',
    url: 'https://github.com/cookiechain/cookie-mcp',
    icon: Shield,
    badge: 'AI Agent Server',
  },
  {
    title: 'Cookie Chain Docs',
    description: 'Official technical guides, SVM architecture, and validator resources.',
    url: COOKIE_CHAIN_CONFIG.docsUrl,
    icon: BookOpen,
    badge: 'Official Docs',
  },
]

export const EcosystemHub: React.FC = () => {
  return (
    <footer className="mt-12 pt-10 pb-16 border-t border-cookie-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cookie-blue" />
            <h3 className="text-base font-bold text-white tracking-tight">Official Ecosystem Infrastructure</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified protocols, bridges, and developer APIs on Cookie Chain
          </p>
        </div>

        <a
          href={COOKIE_CHAIN_CONFIG.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cookie-card hover:bg-cookie-surface border border-cookie-border text-xs font-semibold text-slate-300 hover:text-white transition self-start sm:self-auto"
        >
          <span>Open CookieScan</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {ECOSYSTEM_SERVICES.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl bg-cookie-card hover:bg-cookie-surface border border-cookie-border hover:border-sky-500/40 transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="p-1.5 rounded-lg bg-cookie-surface text-cookie-blue border border-cookie-border">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-cookie-surface text-slate-400 border border-cookie-border">
                    {item.badge}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-white group-hover:text-cookie-blue transition flex items-center gap-1.5">
                  {item.title}
                  <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition" />
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </a>
          )
        })}
      </div>

      {/* Footer Meta */}
      <div className="mt-8 pt-4 border-t border-cookie-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500">
        <p>CookieDash • Built for the Cookie Chain Community Hackathon</p>
        <p>RPC: rpc.cookiescan.io • Genesis: 9wDaBR...BB2</p>
      </div>
    </footer>
  )
}
