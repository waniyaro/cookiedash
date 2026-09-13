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
      className="relative rounded-3xl bg-gradient-to-b from-[#1c0c05] via-[#130703] to-[#0a0402] border-2 border-amber-500/70 p-6 sm:p-8 oven-hearth-hot transition-all duration-300 overflow-hidden shadow-2xl"
    >
      {/* Intense Background Blazing Coals Glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-gradient-to-br from-amber-500/30 to-orange-600/30 rounded-full blur-3xl pointer-events-none animate-ember" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-gradient-to-tr from-orange-600/25 to-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Cast-Iron Oven Heat Vents on Top Edge */}
      <div className="flex items-center justify-between pb-4 border-b border-[#3d1a0c]">
        {/* Left: Oven Hearth Title & Hot Badge */}
        <div className="flex items-center gap-3.5">
          {/* Animated Cast-Iron Fire Chamber */}
          <div className="relative p-3 rounded-2xl bg-gradient-to-b from-[#381608] to-[#1a0802] text-amber-400 border border-amber-500/50 shadow-inner shadow-orange-950/60 flex items-center justify-center">
            <Flame className="w-6 h-6 text-amber-400 animate-pulse drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            {/* Steam particles rising from the hearth */}
            <span className="absolute -top-3 left-2.5 text-xs select-none text-amber-300 font-black animate-steam pointer-events-none">
              ~
            </span>
            <span className="absolute -top-3.5 right-2 text-[10px] select-none text-amber-200 font-bold animate-steam pointer-events-none" style={{ animationDelay: '0.9s' }}>
              ~
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-display text-xl sm:text-2xl font-black text-[#fffbeb] tracking-tight drop-shadow-sm">
                Fortune Oven
              </h2>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-950/80 to-amber-950/80 text-amber-300 border border-amber-500/50 shadow-sm uppercase tracking-wider">
                🔥 420°C Hearth
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-0.5 font-sans">
              Inscribe eternal on-chain fortunes via Solana Memo Program
            </p>
          </div>
        </div>

        {/* Right: Brass Oven Plaque (Counter & Vents) */}
        <div className="hidden sm:flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1 opacity-70">
            <span className="w-3 h-1 rounded-full bg-amber-500/60" />
            <span className="w-3 h-1 rounded-full bg-amber-500/60" />
            <span className="w-3 h-1 rounded-full bg-amber-500/60" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#240f06] border border-amber-500/40 text-xs font-mono text-amber-300 shadow-inner">
            <span className="text-amber-400/70 text-[11px]">Baked:</span>
            <span className="font-black text-amber-300">{totalBaked} Batches</span>
          </div>
        </div>
      </div>

      {/* Input Form & Success View */}
      <div className="relative mt-6 space-y-4">
        {/* Cast-Iron Baking Sheet (Textarea Box) */}
        <div className="relative rounded-2xl bg-[#090402] border-2 border-[#381608] focus-within:border-amber-400 transition-all p-4 space-y-2.5 shadow-inner shadow-black/80">
          <div className="flex items-center justify-between text-xs font-mono text-amber-200/90">
            <span className="font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>OVEN RECIPE TRAY</span>
            </span>
            <button
              type="button"
              onClick={handleRandomFortune}
              disabled={bakingState === 'signing' || bakingState === 'baking'}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-200 transition disabled:opacity-50 font-bold px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 active:scale-95"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Roll Fortune</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={fortune}
            onChange={(e) => setFortune(e.target.value)}
            disabled={bakingState === 'signing' || bakingState === 'baking'}
            placeholder="Type your fortune or wisdom to bake into the Cookie Chain ledger..."
            className="w-full bg-transparent text-[#fffbeb] placeholder-amber-700/80 text-sm sm:text-base focus:outline-none transition leading-relaxed resize-none font-sans font-medium"
          />

          <div className="flex items-center justify-between text-[11px] font-mono text-amber-300/60 pt-2 border-t border-[#260e05]">
            <span className="flex items-center gap-1.5">
              <span>Program:</span>
              <span className="text-amber-300 font-bold">Solana Memo (MemoSq...)</span>
            </span>
            <span className="font-bold text-amber-300/90">{fortune.length} characters</span>
          </div>
        </div>

        {/* Error Notification */}
        {bakingState === 'error' && errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">{errorMsg}</span>
          </div>
        )}

        {/* Confirmed Baked Receipt with Highlighted CookieScan Link */}
        {bakingState === 'baked' && txSignature && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#211105] via-[#1a0d06] to-[#2b1607] border-2 border-amber-500/60 space-y-3 shadow-xl shadow-amber-950/40">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-display font-black text-sm sm:text-base text-[#fffbeb]">
                    Fresh Out Of The Oven! Baked on-chain.
                  </h4>
                  {bakedSlot && (
                    <span className="text-xs font-mono text-amber-300">
                      Confirmed in Slot #{bakedSlot.toLocaleString()} (~0.8s finality)
                    </span>
                  )}
                </div>
              </div>

              <a
                href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-[#080402] text-xs font-black transition shadow-md shadow-amber-500/20 active:scale-95"
              >
                <span>Inspect in CookieScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs sm:text-sm text-amber-100 font-mono bg-[#0a0402] p-3.5 rounded-xl border border-[#381608] italic">
              "{fortune}"
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono text-amber-400/60">
                Tx: {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
              </span>
              <button
                onClick={handleResetForNewBake}
                className="text-xs font-bold text-amber-300 hover:text-amber-200 transition hover:underline flex items-center gap-1"
              >
                <span>Bake Another Batch</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Tactile Baking Button */}
        <button
          onClick={handleBakeFortune}
          disabled={bakingState === 'signing' || bakingState === 'baking' || !fortune.trim()}
          className="w-full py-4 rounded-2xl tactile-oven-btn text-[#080402] font-black text-sm uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 select-none"
        >
          {bakingState === 'signing' ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-[#080402]" />
              <span>Awaiting Signature in Wallet...</span>
            </>
          ) : bakingState === 'baking' ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-[#080402]" />
              <span>Baking Into Cookie Chain Ledger...</span>
            </>
          ) : !connected ? (
            <>
              <Wallet className="w-5 h-5 text-[#080402]" />
              <span>Connect Wallet to Light the Oven</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-[#080402]" />
              <span>Bake Fortune on Cookie Chain (~0.8s)</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

