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
    <section className="relative rounded-3xl bg-cookie-card border border-cookie-border p-6 sm:p-7 shadow-sm overflow-hidden">
      {/* Soft Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SVM Core 4.1.2</span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="text-slate-300">⚡ ~0.8s Finality</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-300">Gas &lt; 0.0001 $COOK</span>
          </div>
        </div>

        {/* Crisp Punchy Title without walls of text */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Cookie Chain <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-amber-300">Live Terminal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Real-time SVM telemetry, on-chain fortune baking via Solana Memo, and instant $COOK vault.
          </p>
        </div>

        {/* Dynamic Interactive Pipeline Flow */}
        <div className="pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1: Wallet Status */}
            <div
              onClick={() => !connected && setVisible(true)}
              className={`group relative p-4 rounded-2xl border transition-all duration-300 ${
                connected
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-cookie-surface/80 hover:bg-cookie-surface border-cookie-border hover:border-sky-500/50 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">
                  Step 01
                </span>
                {connected ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-sky-400 group-hover:underline flex items-center gap-1">
                    Connect <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl border transition-transform duration-300 group-hover:scale-110 ${
                  connected
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                }`}>
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {connected ? 'Wallet Ready' : 'Connect Wallet'}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    {connected && publicKey
                      ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
                      : 'Nightly or Phantom'}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Inscribe */}
            <div
              onClick={() => scrollToSection('fortune-oven')}
              className="group p-4 rounded-2xl bg-cookie-surface/80 hover:bg-cookie-surface border border-cookie-border hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">
                  Step 02
                </span>
                <span className="text-[11px] font-mono text-amber-400 group-hover:underline flex items-center gap-1">
                  Bake <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Inscribe Memo</h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    Permanent on-chain text
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Explorer */}
            <a
              href={COOKIE_CHAIN_CONFIG.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-2xl bg-cookie-surface/80 hover:bg-cookie-surface border border-cookie-border hover:border-sky-500/50 transition-all duration-300 block"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">
                  Step 03
                </span>
                <span className="text-[11px] font-mono text-sky-400 group-hover:underline flex items-center gap-1">
                  CookieScan <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 transition-transform duration-300 group-hover:scale-110">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Verify On-Chain</h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    Inspect block receipts
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

