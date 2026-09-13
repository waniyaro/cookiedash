import React, { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { Buffer } from 'buffer'
import { CheckCircle2, ExternalLink, Dices, AlertCircle, RefreshCw, Send } from 'lucide-react'
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
    <div className="rounded-3xl bg-cookie-card border border-cookie-border p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cookie-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              On-Chain Fortune Inscription
            </h2>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-mono font-bold uppercase">
              Memo Program
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Write an immutable message permanently to Cookie Chain ledger
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cookie-surface border border-cookie-border text-xs font-mono text-slate-300 self-start sm:self-auto">
          <span className="text-slate-500">Inscribed:</span>
          <strong className="text-cookie-blue">{totalBaked}</strong>
        </div>
      </div>

      {/* Input Form */}
      <div className="mt-6 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300">
              Memo Message Content
            </label>
            <button
              type="button"
              onClick={handleRandomFortune}
              disabled={bakingState === 'signing' || bakingState === 'baking'}
              className="flex items-center gap-1.5 text-xs font-medium text-cookie-blue hover:underline transition disabled:opacity-50"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Random Template</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={fortune}
              onChange={(e) => setFortune(e.target.value)}
              disabled={bakingState === 'signing' || bakingState === 'baking'}
              placeholder="Type your message to bake into Cookie Chain..."
              className="w-full px-4 py-3 rounded-xl bg-cookie-surface border border-cookie-border focus:border-cookie-blue text-white text-sm focus:outline-none transition leading-relaxed placeholder-slate-500 resize-none font-sans"
            />
            <div className="absolute right-3 bottom-3 text-[10px] text-slate-500 font-mono">
              {fortune.length} chars
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {bakingState === 'error' && errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Confirmed Receipt */}
        {bakingState === 'baked' && txSignature && (
          <div className="p-4 rounded-xl bg-cookie-surface border border-emerald-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-white text-xs sm:text-sm">
                  Confirmed on Cookie Chain
                </span>
                {bakedSlot && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    Slot #{bakedSlot.toLocaleString()}
                  </span>
                )}
              </div>

              <a
                href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-cookie-blue hover:underline self-start sm:self-auto"
              >
                <span>View in CookieScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs text-slate-300 font-mono bg-cookie-bg p-3 rounded-lg border border-cookie-border">
              "{fortune}"
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleBakeFortune}
          disabled={bakingState === 'signing' || bakingState === 'baking' || !fortune.trim()}
          className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {bakingState === 'signing' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Awaiting Signature in Wallet...</span>
            </>
          ) : bakingState === 'baking' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Confirming on Cookie Chain...</span>
            </>
          ) : !connected ? (
            <>
              <Send className="w-4 h-4" />
              <span>Connect Wallet to Inscribe</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Inscribe Fortune on Cookie Chain (Memo)</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
