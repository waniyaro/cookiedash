import React, { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { Buffer } from 'buffer'
import { CheckCircle2, ExternalLink, Dices, AlertCircle, RefreshCw, Wallet, Flame } from 'lucide-react'
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
      className="relative rounded-3xl bakery-card hero-oven-glow p-6 sm:p-8 lg:p-10 overflow-hidden transition-all"
    >
      {/* Artisanal Ambient Warmth */}
      <div className="absolute -right-16 -top-16 w-96 h-96 bg-gradient-to-br from-[#ff7a1a]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-[500px] h-72 bg-gradient-to-tr from-[#ff7a1a]/20 via-[#ffb347]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Full-Width Grid Split Inside Hero: Left (Hearth Lore & Artwork), Right (Interactive Baking Slate) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left Column (5 cols): Hearth Lore & Big Stats */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#251b16] text-[#ffb347] border border-[#38261e] uppercase tracking-wider">
              SVM Memo Inscription Engine
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#f5ece1] tracking-tight leading-[1.1]">
              Fortune <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a1a] via-[#ff9a2b] to-[#ffb347]">Oven</span>
            </h1>
            <p className="text-sm sm:text-base text-[#8f8075] leading-relaxed font-sans">
              Inscribe permanent fortunes and recipes directly into Cookie Chain block storage via the Solana Memo Program. Immutable, verifiable, baked in ~0.8 seconds.
            </p>
          </div>

          {/* Pure Architectural Metric Display (No generic circle-icon) */}
          <div className="pt-2 pl-4 border-l-2 border-[#d4a15c] space-y-1">
            <span className="text-[10px] font-mono text-[#968579] uppercase tracking-wider block">
              TOTAL ON-CHAIN BATCHES
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-display font-black text-4xl sm:text-5xl text-[#f5ece1] tracking-tight">
                {totalBaked}
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[#d4a15c] uppercase tracking-wider">
                Batches Inscribed
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#968579]">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Solana Memo Program
              </span>
              <span>•</span>
              <span>Gas &lt; 0.0001 $COOK</span>
              <span>•</span>
              <span>~0.8s Finality</span>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): The Baking Slate Tray & Hero CTA */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#080504] border border-[#38261e] focus-within:border-[#d4a15c] transition-colors p-5 space-y-3 shadow-inner">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8f8075] font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff7a1a] animate-pulse" />
                <span>RECIPE SLATE</span>
              </span>

              {/* Ghost Roll Fortune Button */}
              <button
                type="button"
                onClick={handleRandomFortune}
                disabled={bakingState === 'signing' || bakingState === 'baking'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-[#8f8075] hover:text-[#f5ece1] bg-[#1a1310] hover:bg-[#251b16] border border-[#38261e] transition active:scale-95 disabled:opacity-50"
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
              placeholder="Inscribe your message or wisdom to bake into the Cookie Chain ledger..."
              className="w-full bg-transparent text-[#f5ece1] placeholder-[#8f8075]/60 text-base sm:text-lg focus:outline-none transition leading-relaxed resize-none font-sans font-medium"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-[#8f8075] pt-3 border-t border-[#1a1310]">
              <span className="flex items-center gap-1.5">
                <span>Program:</span>
                <span className="text-[#d4a15c] font-semibold">Solana Memo (MemoSq4g...)</span>
              </span>
              <span>{fortune.length} characters</span>
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
            <div className="p-5 rounded-2xl bg-[#080504] border border-[#d4a15c]/60 space-y-3 shadow-lg">
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#251b16] hover:bg-[#33251e] text-[#f5ece1] border border-[#38261e] text-xs font-mono font-bold transition"
                >
                  <span>Inspect in CookieScan</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#d4a15c]" />
                </a>
              </div>

              <p className="text-xs sm:text-sm text-[#f5ece1] font-mono bg-[#1a1310] p-3.5 rounded-xl border border-[#251b16] italic">
                "{fortune}"
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-[#8f8075]">
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

          {/* PRIMARY HERO CTA BUTTON - ONLY FIERY BUTTON ON SCREEN */}
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
                <Flame className="w-5 h-5 fill-current" />
                <span>Bake Fortune on Cookie Chain (~0.8s)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
