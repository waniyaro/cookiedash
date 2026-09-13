import React, { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { Buffer } from 'buffer'
import { Sparkles, Flame, CheckCircle2, ExternalLink, Dices, AlertCircle, RefreshCw, Cookie } from 'lucide-react'
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
  const { setVisible } = useWalletModal()

  const [fortune, setFortune] = useState<string>(DEGEN_FORTUNES[0])
  const [bakingState, setBakingState] = useState<'idle' | 'signing' | 'baking' | 'baked' | 'error'>('idle')
  const [bakedSlot, setBakedSlot] = useState<number | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [totalBaked, setTotalBaked] = useState<number>(() => {
    return parseInt(localStorage.getItem('cookie_total_baked') || '57', 10)
  })

  const handleRandomFortune = () => {
    const available = DEGEN_FORTUNES.filter((f) => f !== fortune)
    const random = available[Math.floor(Math.random() * available.length)]
    setFortune(random)
  }

  const handleBakeFortune = async () => {
    if (!publicKey || !connected) {
      setVisible(true)
      return
    }
    if (!fortune.trim()) return

    setErrorMsg(null)
    setTxSignature(null)
    setBakedSlot(null)

    try {
      setBakingState('signing')

      const memoText = `🍪 [CookieDash Fortune]: ${fortune.trim()}`
      const memoData = Buffer.from(memoText, 'utf-8')

      const memoInstruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
        programId: new PublicKey(COOKIE_CHAIN_CONFIG.memoProgramId),
        data: memoData,
      })

      const transaction = new Transaction().add(memoInstruction)

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      setBakingState('baking')

      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      })

      setTxSignature(signature)

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

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e59a38', '#f5b041', '#ff5722', '#10b981'],
      })
    } catch (err: unknown) {
      setBakingState('error')
      const msg = err instanceof Error ? err.message : 'Transaction failed or cancelled.'
      setErrorMsg(msg.includes('User rejected') ? 'Signature rejected by user.' : msg)
    }
  }

  return (
    <div className="rounded-3xl bg-cookie-card/90 border border-cookie-border/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-cookie-oven/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cookie-border/50">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cookie-accent to-cookie-oven flex items-center justify-center text-white shadow-oven-glow">
            <Cookie className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                On-Chain Fortune Cookie
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-cookie-accent/15 text-cookie-gold border border-cookie-accent/30 text-[10px] font-extrabold uppercase tracking-wider">
                Memo Program
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Inscribe your immutable prediction or message directly into Cookie Chain
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs self-start sm:self-auto font-mono text-slate-300">
          <Flame className="w-4 h-4 text-cookie-oven" />
          <span>Total Baked:</span>
          <strong className="text-cookie-gold">{totalBaked}</strong>
        </div>
      </div>

      {/* Interactive Studio Body */}
      <div className="mt-6 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cookie-gold" />
              Fortune Inscription Text
            </label>
            <button
              type="button"
              onClick={handleRandomFortune}
              disabled={bakingState === 'signing' || bakingState === 'baking'}
              className="flex items-center gap-1 text-xs font-semibold text-cookie-gold hover:text-white transition disabled:opacity-50"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Randomize</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={fortune}
              onChange={(e) => setFortune(e.target.value)}
              disabled={bakingState === 'signing' || bakingState === 'baking'}
              placeholder="Write a message to permanently bake into the block..."
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus:border-cookie-gold text-white text-sm focus:outline-none transition leading-relaxed placeholder-slate-500 resize-none font-sans"
            />
            <div className="absolute right-3 bottom-3 text-[10px] text-slate-500 font-mono">
              {fortune.length} characters
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {bakingState === 'error' && errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Confirmed Baked Receipt */}
        {bakingState === 'baked' && txSignature && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-cookie-card to-cookie-accent/15 border border-emerald-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-extrabold text-white text-sm">
                  Successfully Baked into Block!
                </span>
                {bakedSlot && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cookie-dark text-slate-300 border border-cookie-border">
                    Slot #{bakedSlot.toLocaleString()}
                  </span>
                )}
              </div>

              <a
                href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-cookie-gold hover:underline self-start sm:self-auto"
              >
                <span>Inspect on CookieScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs text-cookie-gold italic bg-cookie-dark/60 p-3 rounded-xl border border-white/[0.05]">
              "{fortune}"
            </p>
          </div>
        )}

        {/* Main Action Button */}
        <button
          onClick={handleBakeFortune}
          disabled={bakingState === 'signing' || bakingState === 'baking' || !fortune.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cookie-accent via-cookie-oven to-cookie-gold hover:brightness-110 text-cookie-dark font-black text-xs uppercase tracking-wider transition shadow-cookie-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {bakingState === 'signing' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Awaiting Signature in Wallet...</span>
            </>
          ) : bakingState === 'baking' ? (
            <>
              <Flame className="w-4 h-4 animate-bounce text-cookie-dark" />
              <span>Baking into Block at 100% Heat...</span>
            </>
          ) : !connected ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Connect Wallet to Bake Fortune</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-cookie-dark" />
              <span>Bake Fortune into Cookie Chain (On-Chain Memo)</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
