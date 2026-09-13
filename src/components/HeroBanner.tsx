import React from 'react'
import { Wallet, Sparkles, Compass, CheckCircle2, ArrowRight } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

export const HeroBanner: React.FC = () => {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <section className="relative rounded-2xl bg-gradient-to-r from-cookie-card via-cookie-card to-cookie-surface border border-cookie-border/80 p-4 sm:p-5 shadow-lg overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-48 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Punchy Branding & Network Status */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              SVM Cluster
            </span>
            <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-md bg-cookie-surface border border-cookie-border">
              ⚡ ~0.8s Finality
            </span>
            <span className="text-[11px] font-mono text-amber-300 px-2 py-0.5 rounded-md bg-cookie-surface border border-cookie-border">
              &lt; 0.0001 $COOK Fee
            </span>
          </div>

          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Cookie Chain Terminal &amp; On-Chain Hub
          </h1>
        </div>

        {/* Right: 3 Quick Action Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 shrink-0">
          {/* Action 1: Wallet */}
          <button
            onClick={() => !connected && setVisible(true)}
            className={`group p-3 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 text-left ${
              connected
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-cookie-surface/90 hover:bg-cookie-surface border-cookie-border hover:border-sky-500/50'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`p-1.5 rounded-lg border shrink-0 ${
                connected
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-sky-500/10 text-sky-400 border-sky-500/20 group-hover:scale-105 transition-transform'
              }`}>
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {connected ? 'Wallet Active' : 'Connect'}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">
                  {connected && publicKey
                    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
                    : 'Click to open'}
                </div>
              </div>
            </div>
            {connected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            )}
          </button>

          {/* Action 2: Inscribe */}
          <button
            onClick={() => scrollToSection('fortune-oven')}
            className="group p-3 rounded-xl bg-cookie-surface/90 hover:bg-cookie-surface border border-cookie-border hover:border-amber-500/50 transition-all duration-200 flex items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 group-hover:scale-105 group-hover:rotate-6 transition-transform">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Bake Memo</div>
                <div className="text-[10px] font-mono text-slate-400 truncate">On-Chain text</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Action 3: Explorer */}
          <a
            href={COOKIE_CHAIN_CONFIG.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-cookie-surface/90 hover:bg-cookie-surface border border-cookie-border hover:border-sky-500/50 transition-all duration-200 flex items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">CookieScan</div>
                <div className="text-[10px] font-mono text-slate-400 truncate">Explorer</div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
