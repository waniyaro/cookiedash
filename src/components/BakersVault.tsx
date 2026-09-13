import React, { useState, useEffect, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Send, Copy, Check, ExternalLink, RefreshCw, AlertCircle, ArrowUpRight, ArrowLeftRight, Lock, Wallet } from 'lucide-react'
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
  const [activePercentage, setActivePercentage] = useState<number | null>(null)
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
    setActivePercentage(100)
  }

  const handleSetPercentage = (pct: number) => {
    if (balance === null || balance <= 0) return
    const sendable = Math.max(0, (balance - 0.001) * (pct / 100))
    setAmount(sendable > 0 ? sendable.toFixed(4) : '0')
    setActivePercentage(pct)
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
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#d4a15c', '#f5ece1', '#10b981'],
      })

      setAmount('')
      setActivePercentage(null)
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
    <section
      id="vault-section"
      className="bakery-card rounded-3xl p-6 sm:p-7 shadow-xl overflow-hidden transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#2d1e17]">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-[#0c0806] text-[#d4a15c] border border-[#2d1e17]">
            <ArrowLeftRight className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base sm:text-lg text-[#f5ece1] tracking-tight">
                Pastry Cashbox &amp; Transfer
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0c0806] text-[#d4a15c] border border-[#2d1e17] font-bold">
                $COOK
              </span>
            </div>
            <p className="text-xs text-[#968579] mt-0.5 font-sans">
              Instant sub-second transfers on Cookie Chain SVM
            </p>
          </div>
        </div>

        {connected && publicKey ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c0806] border border-[#2d1e17] text-xs font-mono">
            <span className="text-[#d4a15c] font-bold">
              {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 text-[#968579] hover:text-[#f5ece1] transition rounded"
              title="Copy address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a
              href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/address/${publicKey.toBase58()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-[#968579] hover:text-[#d4a15c] transition rounded"
              title="View in CookieScan"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#968579] px-2.5 py-1 rounded-lg bg-[#0c0806] border border-[#2d1e17]">
            <Lock className="w-3 h-3 text-[#d4a15c]" />
            <span>Read-Only</span>
          </span>
        )}
      </div>

      {/* Main Grid: Balance & Transfer Form */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Balance Stash Card */}
        <div className="p-4 rounded-2xl bg-[#0c0806] border border-[#2d1e17] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#968579] mb-1">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider">YOUR COOKIE STASH</span>
              {connected && (
                <button
                  onClick={fetchBalance}
                  disabled={loadingBalance}
                  className="text-[#968579] hover:text-[#f5ece1] transition"
                  title="Refresh Balance"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingBalance ? 'animate-spin text-[#d4a15c]' : ''}`} />
                </button>
              )}
            </div>

            <div className="mt-2">
              {connected ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#f5ece1] font-mono">
                    {balance !== null ? balance.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0.00'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#d4a15c]">$COOK</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#968579]/40 font-mono">—.—</span>
                    <span className="text-xs font-mono font-bold text-[#968579]/40">$COOK</span>
                  </div>
                  <p className="text-[11px] text-[#968579] font-sans">
                    Connect wallet to reveal your balance
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#221813] flex items-center justify-between">
            <a
              href={COOKIE_CHAIN_CONFIG.bridgeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-mono text-[#d4a15c] hover:underline"
            >
              <span>Hyperlane Bridge</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            {!connected && (
              <button
                onClick={() => setVisible(true)}
                className="text-xs font-mono font-bold text-[#d4a15c] hover:underline"
              >
                Connect
              </button>
            )}
          </div>
        </div>

        {/* Transfer Form or Engaging Disconnected State */}
        <div className="md:col-span-2">
          {!connected ? (
            <div className="p-5 rounded-2xl bg-[#0c0806] border border-[#2d1e17] flex flex-col items-center justify-center text-center space-y-3 min-h-[140px]">
              <div className="space-y-1 max-w-sm">
                <h4 className="font-display font-bold text-sm text-[#f5ece1]">
                  Connect to Send $COOK
                </h4>
                <p className="text-xs text-[#968579] font-sans leading-relaxed">
                  Fast, sub-second peer-to-peer transfers with microscopic gas fees on Cookie Chain.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVisible(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2d1f19] hover:bg-[#38261e] text-[#d4a15c] hover:text-[#f5ece1] border border-[#442f24] font-mono text-xs font-bold transition active:scale-95 shadow-sm"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect Wallet</span>
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0c0806] border border-[#2d1e17] focus:border-[#d4a15c] text-[#f5ece1] text-xs font-mono placeholder-[#968579]/60 focus:outline-none transition disabled:opacity-60"
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
                      onChange={(e) => {
                        setAmount(e.target.value)
                        setActivePercentage(null)
                      }}
                      disabled={isSending}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#0c0806] border border-[#2d1e17] focus:border-[#d4a15c] text-[#f5ece1] text-xs font-mono placeholder-[#968579]/60 focus:outline-none transition pr-16 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={handleSetMax}
                      disabled={balance === null || balance <= 0}
                      className="absolute right-2 top-2 text-[10px] font-bold text-[#d4a15c] hover:text-[#f5ece1] px-2 py-0.5 rounded bg-[#221813] border border-[#2d1e17] disabled:opacity-40"
                    >
                      MAX
                    </button>
                  </div>

                  {/* SECONDARY GHOST/OUTLINE BUTTON - DOES NOT COMPETE WITH HERO OVEN */}
                  <button
                    type="submit"
                    disabled={isSending || !recipient || !amount}
                    className="px-5 py-2.5 rounded-xl bg-[#2d1f19] hover:bg-[#38261e] text-[#d4a15c] hover:text-[#f5ece1] border border-[#442f24] hover:border-[#d4a15c] font-mono text-xs font-bold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Sending...' : 'Send $COOK'}</span>
                  </button>
                </div>

                {/* Percentage Shortcuts with REAL Dynamic UI State */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#968579]">
                  <span>Portion:</span>
                  {[25, 50, 75, 100].map((pct) => {
                    const isSelected = activePercentage === pct
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => (pct === 100 ? handleSetMax() : handleSetPercentage(pct))}
                        disabled={balance === null || balance <= 0}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition active:scale-95 disabled:opacity-40 ${
                          isSelected
                            ? 'bg-[#d4a15c] text-[#090605] shadow-sm shadow-[#d4a15c]/25'
                            : 'bg-[#0c0806] border border-[#2d1e17] text-[#968579] hover:text-[#f5ece1] hover:border-[#442f24]'
                        }`}
                      >
                        {pct}%
                      </button>
                    )
                  })}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="truncate">{errorMessage}</span>
                </div>
              )}

              {txStatus === 'success' && txSignature && (
                <div className="p-3 rounded-xl bg-[#0c0806] border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-2">
                  <span className="font-semibold text-emerald-300">✓ Dispatched on Cookie Chain!</span>
                  <a
                    href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#d4a15c] hover:underline flex items-center gap-1 font-mono shrink-0"
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
    </section>
  )
}
