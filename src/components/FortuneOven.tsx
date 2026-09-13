import React, { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { Buffer } from 'buffer'
import { CheckCircle2, ExternalLink, Dices, AlertCircle, RefreshCw, Wallet, Sparkles } from 'lucide-react'
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
        particleCount: 80,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#ff7a1a', '#ffb347', '#d4a15c', '#f5ece1'],
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
    <article
      id="fortune-oven"
      className="relative rounded-3xl bg-[#1e1410] border border-[#3a251e] p-6 sm:p-8 md:p-9 hero-oven-glow overflow-hidden transition-all"
    >
      {/* Artisanal Ember Glow Ambient (Bottom glow & top warmth) */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-[#ff7a1a]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-96 h-64 bg-gradient-to-tr from-[#ff7a1a]/20 via-[#ffb347]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Custom Flat Hearth & Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#281a15]">
        {/* Title & Lore */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#f5ece1] tracking-tight">
              Fortune Oven
            </h2>
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#281a15] text-[#ffb347] border border-[#3a251e] uppercase tracking-wider">
              SVM Memo Inscription
            </span>
          </div>
          <p className="text-sm text-[#998376] max-w-xl leading-relaxed font-sans">
            Inscribe permanent fortunes and recipes directly into Cookie Chain block storage via the Solana Memo Program. Verified on-chain in ~0.8 seconds.
          </p>
        </div>

        {/* Prominent Counter Display */}
        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0">
          <span className="text-[11px] font-mono text-[#998376] uppercase tracking-wider">LIFETIME BATCHES</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-display font-black text-2xl sm:text-3xl text-[#f5ece1]">
              {totalBaked}
            </span>
            <span className="text-xs font-mono font-bold text-[#d4a15c]">Baked</span>
          </div>
        </div>
      </div>

      {/* Oven Recipe Tray (Textarea Area) */}
      <div className="relative z-10 mt-6 space-y-4">
        <div className="rounded-2xl bg-[#0e0806] border border-[#3a251e] focus-within:border-[#d4a15c] transition-colors p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#998376] font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff7a1a] animate-pulse" />
              <span>RECIPE SLATE</span>
            </span>

            {/* Subtle Ghost/Secondary Roll Button */}
            <button
              type="button"
              onClick={handleRandomFortune}
              disabled={bakingState === 'signing' || bakingState === 'baking'}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono text-[#998376] hover:text-[#f5ece1] bg-[#1e1410] hover:bg-[#281a15] border border-[#3a251e] transition active:scale-95 disabled:opacity-50"
            >
              <Dices className="w-3.5 h-3.5 text-[#d4a15c]" />
              <span>Roll Fortune</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={fortune}
            onChange={(e) => setFortune(e.target.value)}
            disabled={bakingState === 'signing' || bakingState === 'baking'}
            placeholder="Write your wisdom or prediction to inscribe into the block..."
            className="w-full bg-transparent text-[#f5ece1] placeholder-[#998376]/60 text-base sm:text-lg focus:outline-none transition leading-relaxed resize-none font-sans font-medium"
          />

          <div className="flex items-center justify-between text-[11px] font-mono text-[#998376] pt-3 border-t border-[#1e1410]">
            <span className="flex items-center gap-1.5">
              <span>Program:</span>
              <span className="text-[#d4a15c] font-semibold">Solana Memo (MemoSq4g...)</span>
            </span>
            <span>{fortune.length} chars</span>
          </div>
        </div>

        {/* Error Notification */}
        {bakingState === 'error' && errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">{errorMsg}</span>
          </div>
        )}

        {/* Confirmed Receipt Card */}
        {bakingState === 'baked' && txSignature && (
          <div className="p-5 rounded-2xl bg-[#140d0a] border border-[#d4a15c]/60 space-y-3 shadow-lg">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-[#f5ece1]">
                    Fresh Out Of The Oven! Baked on-chain.
                  </h4>
                  {bakedSlot && (
                    <span className="text-xs font-mono text-[#d4a15c]">
                      Confirmed in Slot #{bakedSlot.toLocaleString()} (~0.8s finality)
                    </span>
                  )}
                </div>
              </div>

              <a
                href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#281a15] hover:bg-[#33211b] text-[#f5ece1] border border-[#3a251e] text-xs font-mono font-bold transition"
              >
                <span>Inspect in CookieScan</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#d4a15c]" />
              </a>
            </div>

            <p className="text-xs sm:text-sm text-[#f5ece1] font-mono bg-[#0e0806] p-3.5 rounded-xl border border-[#281a15] italic">
              "{fortune}"
            </p>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-mono text-[#998376]">
                Tx: {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
              </span>
              <button
                onClick={handleResetForNewBake}
                className="text-xs font-bold text-[#d4a15c] hover:text-[#f5ece1] transition flex items-center gap-1"
              >
                <span>Bake Another Batch</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* PRIMARY HERO CTA BUTTON - THE ONLY FIERY GRADIENT BUTTON ON THE SCREEN */}
        <button
          onClick={handleBakeFortune}
          disabled={bakingState === 'signing' || bakingState === 'baking' || !fortune.trim()}
          className="w-full py-4 px-6 rounded-2xl hero-flame-btn text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 select-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {bakingState === 'signing' ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Awaiting Signature in Wallet...</span>
            </>
          ) : bakingState === 'baking' ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Baking Into Cookie Chain Ledger...</span>
            </>
          ) : !connected ? (
            <>
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet to Light the Oven</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Bake Fortune on Cookie Chain (~0.8s)</span>
            </>
          )}
        </button>
      </div>
    </article>
  )
}
