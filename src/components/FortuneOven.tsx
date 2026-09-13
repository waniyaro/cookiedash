import React, { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { Buffer } from 'buffer'
import { CheckCircle2, ExternalLink, Dices, AlertCircle, RefreshCw, Flame, Wallet, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

const DEGEN_FORTUNES = [
  'Fresh batch straight from the SVM oven: 10,000x $COOK incoming.',
  'Crispy crust, zero slippage. Cookie Chain is your decentralized kitchen.',
  'A mysterious master baker will airdrop fresh batches to this wallet.',
  'Your portfolio will rise like golden brioche in the sub-second oven.',
  'Baking temperature: 420°C. Gas fees: < 0.0001 $COOK. Life is sweet.',
  'Sub-second finality confirmed your recipe in this exact slot.',
  'Never fade the baker who deploys contracts for $0.05 on Cookie Chain.',
  'Hyperlane warp speed activated: hot golden cookies crossing the bridge.',
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

      const memoText = `[CookieDash]: ${fortune.trim()}`
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
        colors: ['#38bdf8', '#f59e0b', '#fbbf24', '#0284c7'],
      })
    } catch (err: unknown) {
      setBakingState('error')
      const msg = err instanceof Error ? err.message : 'Transaction failed or cancelled.'
      setErrorMsg(msg.includes('User rejected') ? 'Signature rejected by user in wallet.' : msg)
    }
  }

  const handleResetForNewBake = () => {
    setBakingState('idle')
    setTxSignature(null)
    setBakedSlot(null)
    handleRandomFortune()
  }

  return (
    <div
      id="fortune-oven"
      className="relative rounded-2xl bg-cookie-card border-2 border-amber-500/35 hover:border-amber-400/50 p-5 sm:p-7 oven-hearth-glow transition-all duration-300 overflow-hidden"
    >
      {/* Warm Ambient Hearth Radial Glow in Background */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between pb-4 border-b border-cookie-border/70">
        <div className="flex items-center gap-3">
          {/* Animated Oven Icon with Steam & Hearth Pulse */}
          <div className="relative p-2.5 rounded-xl bg-gradient-to-b from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30 animate-hearth shadow-inner">
            <Flame className="w-5 h-5" />
            {/* Steam particles indicator */}
            <span className="absolute -top-2 left-2 text-[10px] select-none text-amber-300 font-bold animate-steam pointer-events-none">
              ~
            </span>
            <span className="absolute -top-2.5 right-2 text-[8px] select-none text-amber-200 font-bold animate-steam pointer-events-none" style={{ animationDelay: '0.8s' }}>
              ~
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                Fortune Oven
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold tracking-wide">
                420°C SVM
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Inscribe permanent decentralized fortunes via Solana Memo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/25 text-xs font-mono shadow-sm">
          <span className="text-slate-400 text-[11px]">Baked:</span>
          <span className="text-amber-400 font-extrabold">{totalBaked}</span>
        </div>
      </div>

      {/* Input Form & Success View */}
      <div className="relative mt-5 space-y-3.5">
        {/* Dark Styled Textarea Box */}
        <div className="relative rounded-xl bg-slate-950/90 border border-slate-800/90 focus-within:border-amber-400/60 transition-all p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span>FORTUNE INSCRIPTION</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400/90">UTF-8</span>
            </span>
            <button
              type="button"
              onClick={handleRandomFortune}
              disabled={bakingState === 'signing' || bakingState === 'baking'}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition disabled:opacity-50 font-bold hover:scale-105 active:scale-95"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Surprise Me</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={fortune}
            onChange={(e) => setFortune(e.target.value)}
            disabled={bakingState === 'signing' || bakingState === 'baking'}
            placeholder="Type your message to inscribe permanently on Cookie Chain..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none transition leading-relaxed resize-none font-sans"
          />

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/80">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
              Solana Memo Program (MemoSq...)
            </span>
            <span className="font-semibold text-slate-300">{fortune.length} chars</span>
          </div>
        </div>

        {/* Error Notification */}
        {bakingState === 'error' && errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">{errorMsg}</span>
          </div>
        )}

        {/* Confirmed Baked Receipt with Highlighted CookieScan Link */}
        {bakingState === 'baked' && txSignature && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cookie-card to-amber-950/30 border-2 border-emerald-500/40 space-y-3 shadow-lg">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    Freshly Baked &amp; Inscribed on Cookie Chain!
                  </h4>
                  {bakedSlot && (
                    <span className="text-[10px] font-mono text-emerald-300">
                      Confirmed in Slot #{bakedSlot.toLocaleString()} (~0.8s)
                    </span>
                  )}
                </div>
              </div>

              <a
                href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-xs font-bold text-sky-300 hover:text-white transition shadow-sm"
              >
                <span>View on CookieScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs text-slate-200 font-mono bg-slate-950/90 p-3 rounded-lg border border-slate-800 italic">
              "{fortune}"
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-slate-400">
                Tx: {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
              </span>
              <button
                onClick={handleResetForNewBake}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition hover:underline flex items-center gap-1"
              >
                <span>Bake Another Fortune</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Action Button */}
        <button
          onClick={handleBakeFortune}
          disabled={bakingState === 'signing' || bakingState === 'baking' || !fortune.trim()}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:via-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {bakingState === 'signing' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Awaiting Signature in Wallet...</span>
            </>
          ) : bakingState === 'baking' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Baking Into Cookie Chain Block...</span>
            </>
          ) : !connected ? (
            <>
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet to Bake Fortune</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Bake Fortune Into Cookie Chain</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

