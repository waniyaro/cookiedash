import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

interface ProtocolEntry {
  title: string
  role: string
  endpoint: string
  description: string
  url: string
  actionText: string
}

const REGISTRY_PROTOCOLS: ProtocolEntry[] = [
  {
    title: 'Cookiebox',
    role: 'DEX Aggregator',
    endpoint: 'cookiebox.app',
    description: 'Premier SVM liquidity aggregator routing swaps across all on-chain pools.',
    url: 'https://cookiebox.app',
    actionText: 'Swap',
  },
  {
    title: 'Cookieswap',
    role: 'AMM & Pools',
    endpoint: 'cookieswap.app',
    description: 'Direct liquidity pool deployment and instant token exchange on Cookie Chain.',
    url: COOKIE_CHAIN_CONFIG.swapUrl,
    actionText: 'Pools',
  },
  {
    title: 'Hyperlane Warp Bridge',
    role: 'Interoperability',
    endpoint: 'hyperlane.cookiescan.io',
    description: 'Cross-chain bridge transporting $COOK between Solana Mainnet and Cookie Chain.',
    url: COOKIE_CHAIN_CONFIG.bridgeUrl,
    actionText: 'Bridge',
  },
  {
    title: 'cookie-mcp',
    role: 'AI Execution Layer',
    endpoint: 'github.com/cookiechain/cookie-mcp',
    description: 'Official Model Context Protocol server enabling autonomous agents to execute on-chain.',
    url: 'https://github.com/cookiechain/cookie-mcp',
    actionText: 'GitHub',
  },
  {
    title: 'Cookie DAS API',
    role: 'RPC & Indexer',
    endpoint: 'api.cookiescan.io/das',
    description: 'Digital Asset Standard RPC endpoints for querying tokens and assets.',
    url: COOKIE_CHAIN_CONFIG.cookieDasApi,
    actionText: 'API Docs',
  },
  {
    title: 'Cookie Chain Docs',
    role: 'Core Specifications',
    endpoint: 'docs.cookiescan.io',
    description: 'SVM architecture, validator node deployment, and genesis specs.',
    url: COOKIE_CHAIN_CONFIG.docsUrl,
    actionText: 'Read Docs',
  },
]

export const EcosystemHub: React.FC = () => {
  return (
    <footer className="mt-12 pt-8 pb-14 border-t border-[#38261e]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-display font-bold text-[#f5ece1] text-lg sm:text-xl tracking-tight">
              Cookie Chain Registry &amp; Infrastructure
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#251b16] text-[#d4a15c] border border-[#38261e] uppercase">
              6 Verified Protocols
            </span>
          </div>
          <p className="text-xs text-[#8f8075] mt-1 font-sans">
            Official tools, bridges, and RPC services powering the ecosystem
          </p>
        </div>

        <a
          href={COOKIE_CHAIN_CONFIG.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a1310] hover:bg-[#251b16] border border-[#38261e] text-xs font-mono font-bold text-[#d4a15c] hover:text-[#f5ece1] transition self-start sm:self-auto"
        >
          <span>CookieScan Explorer</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Protocol Registry Table / List (Replaces generic 6 cards) */}
      <div className="rounded-2xl bg-[#1a1310] border border-[#38261e] divide-y divide-[#241813] overflow-hidden shadow-xl">
        {REGISTRY_PROTOCOLS.map((entry) => (
          <div
            key={entry.title}
            className="p-4 sm:px-6 hover:bg-[#251b16]/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
          >
            {/* Protocol Identity & Role */}
            <div className="md:w-64 shrink-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-[#f5ece1]">
                  {entry.title}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#080504] text-[#d4a15c] border border-[#38261e]">
                  {entry.role}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#8f8075]">
                {entry.endpoint}
              </span>
            </div>

            {/* Description */}
            <p className="flex-1 text-[#8f8075] font-sans text-xs leading-relaxed md:px-4">
              {entry.description}
            </p>

            {/* Action link */}
            <div className="shrink-0 flex items-center md:justify-end">
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#080504] hover:bg-[#1a1310] text-[#f5ece1] hover:text-[#ffb347] border border-[#38261e] text-xs font-mono font-bold transition group"
              >
                <span>{entry.actionText}</span>
                <ArrowUpRight className="w-3 h-3 text-[#8f8075] group-hover:text-[#ffb347] transition-colors" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Branding Bar */}
      <div className="mt-8 pt-6 border-t border-[#241813] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#8f8075]">
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
