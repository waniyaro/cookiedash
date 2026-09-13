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
  },
  {
    title: 'Cookieswap',
    description: 'Instant token swapping and liquidity pool deployment on Cookie Chain.',
    url: COOKIE_CHAIN_CONFIG.swapUrl,
    icon: Layers,
    badge: 'AMM',
  },
  {
    title: 'Hyperlane Warp Bridge',
    description: 'Direct bridge transporting $COOK between Solana and Cookie Chain.',
    url: COOKIE_CHAIN_CONFIG.bridgeUrl,
    icon: ArrowUpRight,
    badge: 'Bridge',
  },
  {
    title: 'Cookie DAS API',
    description: 'Digital Asset Standard RPC endpoints for developers to query tokens.',
    url: COOKIE_CHAIN_CONFIG.cookieDasApi,
    icon: Code2,
    badge: 'RPC & DAS',
  },
  {
    title: 'cookie-mcp',
    description: 'Official Model Context Protocol server empowering autonomous AI bakery agents.',
    url: 'https://github.com/cookiechain/cookie-mcp',
    icon: Shield,
    badge: 'AI Agents',
  },
  {
    title: 'Cookie Chain Docs',
    description: 'Official SVM specs, genesis hash, node validator guides, and hackathon bounties.',
    url: COOKIE_CHAIN_CONFIG.docsUrl,
    icon: BookOpen,
    badge: 'Docs',
  },
]

export const EcosystemHub: React.FC = () => {
  return (
    <footer className="mt-14 pt-8 pb-16 border-t border-[#3a251e]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-[#1e1410] border border-[#3a251e] text-[#d4a15c]">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-display font-bold text-[#f5ece1] text-lg tracking-tight">
              Ecosystem &amp; Infrastructure
            </h3>
            <p className="text-xs text-[#998376] font-sans">
              Official developer endpoints, bridges, and tools on Cookie Chain
            </p>
          </div>
        </div>

        <a
          href={COOKIE_CHAIN_CONFIG.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e1410] hover:bg-[#281a15] border border-[#3a251e] hover:border-[#d4a15c] text-xs font-mono font-bold text-[#d4a15c] hover:text-[#f5ece1] transition"
        >
          <span>CookieScan</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Grid of Pantry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ECOSYSTEM_SERVICES.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl bg-[#1e1410] hover:bg-[#281a15] border border-[#3a251e] hover:border-[#d4a15c]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 rounded-xl bg-[#281a15] text-[#d4a15c] border border-[#3a251e]">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#140d0a] text-[#998376] border border-[#281a15]">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-display font-bold text-sm text-[#f5ece1] group-hover:text-[#ffb347] transition-colors">
                    {item.title}
                  </h4>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#998376] group-hover:text-[#d4a15c] transition-colors" />
                </div>

                <p className="text-xs text-[#998376] mt-1.5 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            </a>
          )
        })}
      </div>

      {/* Footer Branding Bar */}
      <div className="mt-10 pt-6 border-t border-[#281a15] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#998376]">
        <div className="flex items-center gap-3">
          <img
            src="/cookie-sticker.png"
            alt="CookieDash Logo"
            className="w-5 h-5 object-contain"
          />
          <span className="text-[#f5ece1] font-bold">CookieDash</span>
          <span>•</span>
          <span>Night Bakery on Cookie Chain SVM</span>
        </div>

        <div className="flex items-center gap-2">
          <span>rpc.cookiescan.io</span>
          <span>•</span>
          <span>Genesis: 9wDaBR...BB2</span>
        </div>
      </div>
    </footer>
  )
}
