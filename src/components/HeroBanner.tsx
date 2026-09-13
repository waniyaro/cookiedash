import React from 'react'
import { Sparkles, ArrowRight, Zap, ShieldCheck, Flame } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

export const HeroBanner: React.FC = () => {
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-cookie-card/90 via-cookie-dark/95 to-cookie-dark border border-cookie-border/60 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
      {/* Radiant Glow Behind Header */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-gradient-to-r from-cookie-accent/20 via-cookie-gold/15 to-cookie-oven/20 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-4xl mx-auto text-center space-y-5">
        {/* Network Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cookie-accent/10 border border-cookie-accent/30 text-cookie-gold text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-cookie-gold animate-pulse" />
          <span>Cookie Chain Community Hackathon</span>
          <span className="w-1 h-1 rounded-full bg-cookie-gold/60" />
          <span className="text-slate-300">SVM Testnet</span>
        </div>

        {/* Main Punchy Title */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          The Decentralized Bakery for <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-cookie-gold via-cookie-accent to-cookie-oven bg-clip-text text-transparent">
            Cookie Chain SVM
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Monitor real-time network throughput, inscribe permanent on-chain fortunes via Solana Memo, and execute micro-transfers with sub-second finality.
        </p>

        {/* 3-Step Interactive Process Bar */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-cookie-accent/20 border border-cookie-accent/30 text-cookie-gold font-mono font-bold text-xs flex items-center justify-center shrink-0">
              01
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white">Connect Wallet</h4>
              <p className="text-[11px] text-slate-400 truncate">Nightly or Phantom</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-cookie-oven/20 border border-cookie-oven/30 text-cookie-oven font-mono font-bold text-xs flex items-center justify-center shrink-0">
              02
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white">Bake Fortune</h4>
              <p className="text-[11px] text-slate-400 truncate">On-Chain Memo Inscription</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
              03
            </span>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white">Verify on CookieScan</h4>
              <p className="text-[11px] text-slate-400 truncate">Instant On-Chain Proof</p>
            </div>
          </div>
        </div>

        {/* Quick CTA if disconnected */}
        {!connected && (
          <div className="pt-2">
            <button
              onClick={() => setVisible(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cookie-accent to-cookie-oven hover:brightness-110 text-cookie-dark font-extrabold text-xs uppercase tracking-wider transition shadow-cookie-glow"
            >
              <span>Connect Nightly Wallet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Micro Stats Row */}
        <div className="pt-4 border-t border-cookie-border/40 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cookie-gold" />
            ~0.8s Block Time
          </span>
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-cookie-oven" />
            &lt; 0.0001 $COOK Gas Fee
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Solana VM Compatible
          </span>
        </div>
      </div>
    </section>
  )
}
