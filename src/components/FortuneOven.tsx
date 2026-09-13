import React, { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { Buffer } from 'buffer'
import { Sparkles, Flame, CheckCircle2, ExternalLink, Dices, AlertCircle, RefreshCw } from 'lucide-react'
import confetti from 'canvas-confetti'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

const DEGEN_FORTUNES = [
  'The oven never cools down. 10,000x $COOK incoming on SVM.',
  'Bake fast, swap faster. Cookie Chain is your decentralized kitchen.',
  'A mysterious master baker will airdrop fresh batches to your wallet.',
  'Your portfolio will rise like freshly fermented sourdough in the SVM oven.',
  'Micro-gas fees, maximum sugar. You are officially the Head Baker now.',
  'Sub-second finality confirmed your destiny in this exact block.',
  'Never fade the baker who deploys contracts for $0.05 on Cookie Chain.',
  'Hyperlane warp speed activated. Golden cookies will cross the bridge.',
]

export const FortuneOven: React.FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected } = useWallet()

  const [fortune, setFortune] = useState<string>(DEGEN_FORTUNES[0])
  const [bakingState, setBakingState] = useState<'idle' | 'signing' | 'baking' | 'baked' | 'error'>('idle')
  const [bakedSlot, setBakedSlot] = useState<number | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [totalBaked, setTotalBaked] = useState<number>(() => {
    return parseInt(localStorage.getItem('cookie_total_baked') || '42', 10)
  })

  // Random Fortune Picker
  const handleRandomFortune = () => {
    const available = DEGEN_FORTUNES.filter((f) => f !== fortune)
    const random = available[Math.floor(Math.random() * available.length)]
    setFortune(random)
  }

  // Bake On-Chain Transaction using Memo Program
  const handleBakeFortune = async () => {
    if (!publicKey || !connected) return
    if (!fortune.trim()) return

    setErrorMsg(null)
    setTxSignature(null)
    setBakedSlot(null)

    try {
      setBakingState('signing')

      // Encode custom on-chain memo
      const memoText = `🍪 [CookieDash Fortune]: ${fortune.trim()}`
      const memoData = Buffer.from(memoText, 'utf-8')

      const memoInstruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
        programId: new PublicKey(COOKIE_CHAIN_CONFIG.memoProgramId),
        data: memoData,
      })

      const transaction = new Transaction().add(memoInstruction)

      // Fetch fresh blockhash directly from Cookie Chain RPC
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      setBakingState('baking')

      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      })

      setTxSignature(signature)

      // Wait for confirmation on Cookie Chain
      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        'confirmed'
      )

      if (confirmation.value.err) {
        throw new Error('On-chain execution failed: ' + JSON.stringify(confirmation.value.err))
      }

      // Fetch confirmed slot
      try {
        const currentSlot = await connection.getSlot('confirmed')
        setBakedSlot(currentSlot)
      } catch {
        // Fallback
      }

      setBakingState('baked')
      const newCount = totalBaked + 1
      setTotalBaked(newCount)
      localStorage.setItem('cookie_total_baked', newCount.toString())

      // Fire festive bakery confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e59a38', '#f5b041', '#ff5722', '#10b981'],
      })
    } catch (err: unknown) {
      setBakingState('error')
      const msg = err instanceof Error ? err.message : 'Transaction failed or cancelled.'
      setErrorMsg(msg.includes('User rejected') ? 'Signature rejected by wallet.' : msg)
    }
  }

  return (
    <section className="relative rounded-3xl bg-cookie-card border border-cookie-border/80 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
      {/* Decorative ambient heat */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-64 bg-cookie-oven/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cookie-border/60">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cookie-oven to-cookie-accent flex items-center justify-center text-2xl shadow-oven-glow select-none">
            🥠
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white tracking-tight">On-Chain Fortune Cookie</h3>
              <span className="px-2 py-0.5 rounded-full bg-cookie-oven/20 text-cookie-oven border border-cookie-oven/30 text-[10px] font-bold uppercase tracking-wider">
                Memo Program
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Imprint your custom or degen fortune permanently into the Cookie Chain SVM ledger
            </p>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cookie-dark/90 border border-cookie-border text-xs text-slate-300">
          <Flame className="w-4 h-4 text-cookie-oven" />
          <span>Total Baked:</span>
          <strong className="text-cookie-gold font-mono">{totalBaked}</strong>
        </div>
      </div>

      {/* Main Interactive Baking Studio */}
      <div className="mt-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cookie-gold" />
              Your On-Chain Fortune Inscription
            </label>
            <button
              onClick={handleRandomFortune}
              disabled={bakingState === 'signing' || bakingState === 'baking'}
              className="flex items-center gap-1.5 text-xs font-semibold text-cookie-gold hover:text-white transition disabled:opacity-50"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Random Degen Fortune</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={fortune}
              onChange={(e) => setFortune(e.target.value)}
              disabled={bakingState === 'signing' || bakingState === 'baking'}
              placeholder="Write a fortune to permanently bake into Cookie Chain..."
              className="w-full px-4 py-3 rounded-2xl bg-cookie-dark/90 border border-cookie-border focus:border-cookie-gold text-white text-sm focus:outline-none transition leading-relaxed font-sans placeholder-slate-500 resize-none shadow-inner"
            />
            <div className="absolute right-3 bottom-3 text-[11px] text-slate-500 font-mono">
              {fortune.length} chars
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {bakingState === 'error' && errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong>Baking Interrupted:</strong>
              <p className="opacity-90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Freshly Baked Result Card */}
        {bakingState === 'baked' && txSignature && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cookie-oven/20 via-cookie-card to-cookie-accent/20 border border-cookie-gold/50 shadow-cookie-glow animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-extrabold text-white text-sm sm:text-base">
                    Freshly Baked on Cookie Chain!
                  </h4>
                  {bakedSlot && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cookie-dark text-slate-300 border border-cookie-border">
                      Slot #{bakedSlot.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-cookie-gold font-medium italic mt-2 bg-cookie-dark/60 p-3 rounded-xl border border-cookie-border/60">
                  "{fortune}"
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
                  <span>Tx Hash:</span>
                  <span className="text-slate-200">{txSignature.slice(0, 10)}...{txSignature.slice(-10)}</span>
                </div>
              </div>

              <a
                href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cookie-gold to-cookie-accent hover:brightness-110 text-cookie-dark font-extrabold text-xs flex items-center gap-1.5 shadow-cookie-glow transition shrink-0 self-center"
              >
                <span>Inspect on CookieScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!connected ? (
          <div className="text-center p-4 rounded-2xl bg-cookie-dark/60 border border-cookie-border text-xs text-slate-400">
            Connect your <strong className="text-cookie-gold">Nightly</strong> or Solana wallet above to bake this fortune on-chain.
          </div>
        ) : (
          <button
            onClick={handleBakeFortune}
            disabled={bakingState === 'signing' || bakingState === 'baking' || !fortune.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cookie-accent via-cookie-oven to-cookie-gold hover:brightness-110 text-cookie-dark font-extrabold text-sm uppercase tracking-wider transition shadow-cookie-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {bakingState === 'signing' ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Confirming Signature in Nightly...</span>
              </>
            ) : bakingState === 'baking' ? (
              <>
                <Flame className="w-5 h-5 animate-bounce text-cookie-dark" />
                <span>Baking into Block at 100% Heat...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Bake Fortune Cookie (On-Chain Memo)</span>
              </>
            )}
          </button>
        )}
      </div>
    </section>
  )
}
