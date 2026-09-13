import React, { useState, useEffect, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Send, Copy, Check, ExternalLink, RefreshCw, AlertCircle, ArrowUpRight, ArrowLeftRight, Lock, Sparkles, Wallet } from 'lucide-react'
import confetti from 'canvas-confetti'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

export const BakersVault: React.FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected } = useWallet()
  const { setVisible } = useWalletModal()

  const [balance, setBalance] = useState<number | null>(null)
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  // Transfer state
  const [recipient, setRecipient] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [isSending, setIsSending] = useState<boolean>(false)
  const [txStatus, setTxStatus] = useState<'idle' | 'signing' | 'confirming' | 'success' | 'error'>('idle')
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null)
      return
    }
    setLoadingBalance(true)
    try {
      const lamports = await connection.getBalance(publicKey, 'confirmed')
      setBalance(lamports / LAMPORTS_PER_SOL)
    } catch (err) {
      console.warn('Failed to fetch balance:', err)
    } finally {
      setLoadingBalance(false)
    }
  }, [connection, publicKey])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  const handleCopy = () => {
    if (!publicKey) return
    navigator.clipboard.writeText(publicKey.toBase58())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSetMax = () => {
    if (balance === null || balance <= 0) return
    const maxSendable = Math.max(0, balance - 0.001)
    setAmount(maxSendable > 0 ? maxSendable.toFixed(4) : '0')
  }

  const handleSetPercentage = (pct: number) => {
    if (balance === null || balance <= 0) return
    const sendable = Math.max(0, (balance - 0.001) * (pct / 100))
    setAmount(sendable > 0 ? sendable.toFixed(4) : '0')
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !connected) return

    setErrorMessage(null)
    setTxSignature(null)

    let toPublicKey: PublicKey
    try {
      toPublicKey = new PublicKey(recipient.trim())
    } catch {
      setErrorMessage('Invalid recipient address. Must be a valid Base58 public key.')
      return
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Enter a valid transfer amount.')
      return
    }

    if (balance !== null && parsedAmount > balance) {
      setErrorMessage(`Insufficient funds. Your balance is ${balance.toFixed(4)} $COOK.`)
      return
    }

    try {
      setIsSending(true)
      setTxStatus('signing')

      const lamportsToSend = Math.round(parsedAmount * LAMPORTS_PER_SOL)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPublicKey,
          lamports: lamportsToSend,
        })
      )

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      setTxStatus('confirming')
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      })

      setTxSignature(signature)

      await connection.confirmTransaction(
        {
          signature,
          blockhash,
          lastValidBlockHeight,
        },
        'confirmed'
      )

      setTxStatus('success')
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#f59e0b', '#10b981'],
      })

      setAmount('')
      setRecipient('')
      fetchBalance()
    } catch (err: unknown) {
      setTxStatus('error')
      const msg = err instanceof Error ? err.message : 'Transaction failed.'
      setErrorMessage(msg.includes('User rejected') ? 'Signature rejected by user.' : msg)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div id="vault-section" className="rounded-2xl bg-[#120703]/95 border border-[#381608] p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle Warm Amber Corner Sheen */}
      <div className="absolute -left-12 -top-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2e1307]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-black text-[#fffbeb] text-lg tracking-tight">Pastry Stash Vault</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                $COOK
              </span>
            </div>
            <p className="text-xs text-amber-200/70 mt-0.5 font-sans">
              Instant transfers across the bakery counter (~0.8s finality)
            </p>
          </div>
        </div>

        {connected && publicKey ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#1c0c05] border border-[#3d1a0c] text-xs font-mono">
            <span className="text-amber-200 font-bold">
              {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 text-amber-400/80 hover:text-white transition rounded hover:bg-[#2e1307]"
              title="Copy address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a
              href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/address/${publicKey.toBase58()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-amber-400/80 hover:text-amber-200 transition rounded hover:bg-[#2e1307]"
              title="View in CookieScan"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <button
            onClick={() => setVisible(true)}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 hover:text-amber-100 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 transition shadow-sm active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Vault Locked · Connect</span>
          </button>
        )}
      </div>

      {/* Main Grid: Balance & Transfer Form */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div className="p-4 rounded-xl bg-[#0a0402] border border-[#2e1307] flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between text-xs text-amber-200/80 mb-1">
              <span className="font-mono text-[10px] uppercase font-bold text-amber-400/70 tracking-wider">YOUR COOKIE STASH</span>
              {connected && (
                <button
                  onClick={fetchBalance}
                  disabled={loadingBalance}
                  className="text-amber-400 hover:text-amber-200 transition"
                  title="Refresh Balance"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingBalance ? 'animate-spin text-amber-400' : ''}`} />
                </button>
              )}
            </div>

            <div className="mt-2">
              {connected ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#fffbeb] font-mono">
                    {balance !== null ? balance.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0.00'}
                  </span>
                  <span className="text-xs font-mono font-black text-amber-400">$COOK</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-amber-500/50 font-mono">—.—</span>
                    <span className="text-xs font-mono font-bold text-amber-500/50">$COOK</span>
                  </div>
                  <p className="text-[11px] text-amber-300/70 font-sans">
                    Connect wallet to reveal your fresh batch
                  </p>
                </div>
              )}
            </div>

            {connected && balance === 0 && (
              <p className="text-xs text-amber-300/80 mt-2.5 font-sans">
                💡 Batch is empty. Bridge $COOK from Solana via Hyperlane below.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#260e05] flex items-center justify-between">
            <a
              href={COOKIE_CHAIN_CONFIG.bridgeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-200 transition"
            >
              <span>Hyperlane Warp Bridge</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            {!connected && (
              <button
                onClick={() => setVisible(true)}
                className="text-xs font-black text-amber-400 hover:underline"
              >
                Connect
              </button>
            )}
          </div>
        </div>

        {/* Transfer Form or Engaging Disconnected State */}
        <div className="md:col-span-2">
          {!connected ? (
            /* Inviting Empty / Disconnected Card */
            <div className="p-5 rounded-xl bg-[#0a0402] border border-[#2e1307] flex flex-col items-center justify-center text-center space-y-3 min-h-[150px]">
              <div className="p-3 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="max-w-sm space-y-1">
                <h4 className="font-display font-black text-base text-[#fffbeb]">
                  Open Your Bakery Cashbox
                </h4>
                <p className="text-xs text-amber-200/80 font-sans leading-relaxed">
                  Connect your wallet to dispatch $COOK across Cookie Chain in sub-second time with microscopic gas fees.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVisible(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl tactile-oven-btn text-[#080402] font-black text-xs uppercase tracking-wider transition shadow-md select-none"
              >
                <Wallet className="w-4 h-4 text-[#080402]" />
                <span>Connect Wallet to Transfer</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleTransfer} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Recipient Base58 address (e.g. 7xK2...)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={isSending}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090402] border border-[#381608] focus:border-amber-400 text-white text-xs font-mono placeholder-amber-700/80 focus:outline-none transition disabled:opacity-60"
                />
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      placeholder="Amount in $COOK"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={isSending}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#090402] border border-[#381608] focus:border-amber-400 text-white text-xs font-mono placeholder-amber-700/80 focus:outline-none transition pr-16 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={handleSetMax}
                      disabled={balance === null || balance <= 0}
                      className="absolute right-2 top-2 text-[10px] font-bold text-amber-400 hover:text-amber-200 px-2 py-0.5 rounded bg-[#200e06] border border-[#3d1a0c] disabled:opacity-40"
                    >
                      MAX
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending || !recipient || !amount}
                    className="px-6 py-2.5 rounded-xl tactile-oven-btn text-[#080402] font-black text-xs uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 select-none"
                  >
                    <Send className="w-3.5 h-3.5 text-[#080402]" />
                    <span>{isSending ? 'Sending...' : 'Send $COOK'}</span>
                  </button>
                </div>

                {/* Quick percentage shortcuts */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400/80">
                  <span>Quick Portion:</span>
                  {[25, 50, 75].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSetPercentage(pct)}
                      disabled={balance === null || balance <= 0}
                      className="px-2.5 py-0.5 rounded-lg bg-[#1c0c05] border border-[#381608] text-amber-200 hover:text-white hover:border-amber-500/50 transition disabled:opacity-40 font-bold"
                    >
                      {pct}%
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleSetMax}
                    disabled={balance === null || balance <= 0}
                    className="px-2.5 py-0.5 rounded-lg bg-[#261006] border border-amber-500/40 text-amber-300 hover:text-amber-100 transition disabled:opacity-40 font-bold"
                  >
                    100%
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="truncate">{errorMessage}</span>
                </div>
              )}

              {txStatus === 'success' && txSignature && (
                <div className="p-3.5 rounded-xl bg-[#211205] border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between gap-2">
                  <span className="font-bold">✓ $COOK Dispatched on Cookie Chain!</span>
                  <a
                    href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 font-bold shrink-0"
                  >
                    CookieScan
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
