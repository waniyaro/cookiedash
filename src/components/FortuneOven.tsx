import React, { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { Buffer } from 'buffer'
import { CheckCircle2, ExternalLink, Dices, AlertCircle, RefreshCw, Flame, Wallet, Sparkles } from 'lucide-react'
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
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#f59e0b', '#0284c7'],
      })
    } catch (err: unknown) {
      setBakingState('error')
      const msg = err instanceof Error ? err.message : 'Transaction failed or cancelled.'
      setErrorMsg(msg.includes('User rejected') ? 'Signature rejected by user in wallet.' : msg)
    }
  }

  return (
    <div id="fortune-oven" className="rounded-2xl bg-cookie-card border border-cookie-border/80 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cookie-border/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Fortune Oven
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                MEMO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Permanent on-chain inscription
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cookie-surface border border-cookie-border text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Baked:</span>
          <span className="text-amber-400 font-bold">{totalBaked}</span>
        </div>
      </div>

      {/* Input Form */}
      <div className="mt-4 space-y-3">
        {/* Dark Styled Textarea Box */}
        <div className="relative rounded-xl bg-slate-950/80 border border-slate-800/80 focus-within:border-amber-500/50 transition-all p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="font-medium text-slate-400">INSCRIPTION TEXT</span>
            <button
              type="button"
              onClick={handleRandomFortune}
              disabled={bakingState === 'signing' || bakingState === 'baking'}
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition disabled:opacity-50 font-semibold"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Random</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={fortune}
            onChange={(e) => setFortune(e.target.value)}
            disabled={bakingState === 'signing' || bakingState === 'baking'}
            placeholder="Type your message to inscribe permanently..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none transition leading-relaxed resize-none font-sans"
          />

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
            <span>Solana Memo Program</span>
            <span>{fortune.length} chars</span>
          </div>
        </div>

        {/* Error Notification */}
        {bakingState === 'error' && errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">{errorMsg}</span>
          </div>
        )}

        {/* Confirmed Receipt */}
        {bakingState === 'baked' && txSignature && (
          <div className="p-3.5 rounded-xl bg-cookie-surface border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-white text-xs">
                  Inscribed on Cookie Chain
                </span>
                {bakedSlot && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    Slot #{bakedSlot.toLocaleString()}
                  </span>
                )}
              </div>

              <a
                href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-cookie-blue hover:underline"
              >
                <span>CookieScan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              "{fortune}"
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleBakeFortune}
          disabled={bakingState === 'signing' || bakingState === 'baking' || !fortune.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {bakingState === 'signing' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Awaiting Signature in Wallet...</span>
            </>
          ) : bakingState === 'baking' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Confirming on-chain...</span>
            </>
          ) : !connected ? (
            <>
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet to Inscribe</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Inscribe Fortune on Cookie Chain</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

