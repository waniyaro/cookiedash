import { ArrowRight, Zap, ShieldCheck, Clock } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

export const HeroBanner: React.FC = () => {
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()

  return (
    <section className="rounded-3xl bg-cookie-card border border-cookie-border p-6 sm:p-8 shadow-sm">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Cookie Chain SVM Ecosystem
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              ~0.8s Finality
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              &lt; 0.0001 $COOK Fee
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Community Operated
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            Interactive On-Chain Hub & Analytics for <span className="text-cookie-blue">Cookie Chain</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
            Stream live network telemetry from the RPC, inscribe permanent memos on-chain via the Solana Memo Program, and execute high-speed token transfers.
          </p>
        </div>

        {/* 3-Step Execution Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-cookie-surface/60 border border-cookie-border/60">
            <div className="text-[10px] font-mono font-bold text-sky-400 mb-1">STEP 01</div>
            <h4 className="text-xs font-bold text-white mb-0.5">Connect Wallet</h4>
            <p className="text-[11px] text-slate-400">Nightly or Phantom on Cookie Chain</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-cookie-surface/60 border border-cookie-border/60">
            <div className="text-[10px] font-mono font-bold text-amber-400 mb-1">STEP 02</div>
            <h4 className="text-xs font-bold text-white mb-0.5">Inscribe Fortune</h4>
            <p className="text-[11px] text-slate-400">Execute on-chain Memo transaction</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-cookie-surface/60 border border-cookie-border/60">
            <div className="text-[10px] font-mono font-bold text-emerald-400 mb-1">STEP 03</div>
            <h4 className="text-xs font-bold text-white mb-0.5">Verify on Explorer</h4>
            <p className="text-[11px] text-slate-400">Inspect confirmed slot on CookieScan</p>
          </div>
        </div>

        {!connected && (
          <div className="pt-1">
            <button
              onClick={() => setVisible(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
            >
              <span>Connect Wallet to Begin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
