import React, { useState, useEffect, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Wallet, Send, Copy, Check, ExternalLink, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

export const BakersVault: React.FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected } = useWallet()

  const [balance, setBalance] = useState<number | null>(null)
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  // Transfer form state
  const [recipient, setRecipient] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [isSending, setIsSending] = useState<boolean>(false)
  const [txStatus, setTxStatus] = useState<'idle' | 'signing' | 'confirming' | 'success' | 'error'>('idle')
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Fetch balance
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

  // Copy address helper
  const handleCopy = () => {
    if (!publicKey) return
    navigator.clipboard.writeText(publicKey.toBase58())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Set Max Amount (minus gas buffer)
  const handleSetMax = () => {
    if (balance === null || balance <= 0) return
    const maxSendable = Math.max(0, balance - 0.001)
    setAmount(maxSendable > 0 ? maxSendable.toFixed(4) : '0')
  }

  // Handle Send Transfer
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey || !connected) return

    setErrorMessage(null)
    setTxSignature(null)

    // 1. Validate recipient address
    let toPublicKey: PublicKey
    try {
      toPublicKey = new PublicKey(recipient.trim())
    } catch {
      setErrorMessage('Invalid recipient address. Must be a valid Solana/SVM base58 address.')
      return
    }

    // 2. Validate amount
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0.')
      return
    }

    if (balance !== null && parsedAmount > balance) {
      setErrorMessage(`Insufficient $COOK balance. You have ${balance.toFixed(4)} $COOK.`)
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

      // Fetch fresh blockhash directly from Cookie Chain RPC
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed')
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      setTxStatus('confirming')
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      })

      setTxSignature(signature)

      // Wait for confirmation
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
        colors: ['#e59a38', '#f5b041', '#ff5722'],
      })

      // Reset form & update balance
      setAmount('')
      setRecipient('')
      fetchBalance()
    } catch (err: unknown) {
      setTxStatus('error')
      const msg = err instanceof Error ? err.message : 'Transaction failed or rejected by wallet.'
      setErrorMessage(msg.includes('User rejected') ? 'Transaction signature rejected in wallet.' : msg)
    } finally {
      setIsSending(false)
    }
  }

  if (!connected || !publicKey) {
    return (
      <section className="rounded-3xl bg-cookie-card border border-cookie-border/80 p-8 text-center backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-cookie-accent/15 border border-cookie-accent/30 text-cookie-gold flex items-center justify-center mx-auto mb-4 text-3xl">
          🥐
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">The Baker's Vault</h3>
        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
          Connect your <strong className="text-cookie-gold">Nightly</strong> or Solana wallet above to view your on-chain $COOK balance and execute instant sub-second transfers.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-3xl bg-cookie-card border border-cookie-border/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cookie-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cookie-accent/20 border border-cookie-accent/30 text-cookie-gold">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">The Baker's Vault</h3>
            <p className="text-xs text-slate-400">Manage assets & execute micro-transfers on Cookie Chain</p>
          </div>
        </div>

        {/* Wallet Address Pill */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cookie-dark/90 border border-cookie-border/80 text-xs font-mono">
          <span className="text-slate-300">
            {publicKey.toBase58().slice(0, 5)}...{publicKey.toBase58().slice(-5)}
          </span>
          <button
            onClick={handleCopy}
            className="p-1 text-slate-400 hover:text-white transition"
            title="Copy full address"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <a
            href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/address/${publicKey.toBase58()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-slate-400 hover:text-cookie-gold transition"
            title="View address in CookieScan"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Grid: Balance Card & Transfer Form */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Live Balance */}
        <div className="rounded-2xl bg-cookie-dark/80 border border-cookie-border/70 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">Available Balance</span>
              <button
                onClick={fetchBalance}
                disabled={loadingBalance}
                className="hover:text-cookie-gold transition"
                title="Refresh Balance"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingBalance ? 'animate-spin text-cookie-gold' : ''}`} />
              </button>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                {balance !== null ? balance.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0.00'}
              </span>
              <span className="text-sm font-bold text-cookie-gold font-mono">$COOK</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-cookie-border/50">
            <p className="text-xs text-slate-400 leading-relaxed">
              Need more $COOK for baking transactions? Move assets from Solana via Hyperlane bridge.
            </p>
            <a
              href={COOKIE_CHAIN_CONFIG.bridgeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-cookie-gold hover:text-white transition"
            >
              Open Cookie Chain Bridge
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Column 2 & 3: Quick Transfer Form */}
        <div className="lg:col-span-2 rounded-2xl bg-cookie-dark/80 border border-cookie-border/70 p-6">
          <h4 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-cookie-accent" />
            Instant $COOK Transfer
          </h4>

          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Recipient Address (Solana / Cookie Chain SVM)
              </label>
              <input
                type="text"
                placeholder="Enter Base58 public key..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={isSending}
                className="w-full px-4 py-2.5 rounded-xl bg-cookie-card border border-cookie-border focus:border-cookie-accent text-white placeholder-slate-500 text-xs font-mono focus:outline-none transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <label className="font-medium">Amount to Send</label>
                <button
                  type="button"
                  onClick={handleSetMax}
                  disabled={isSending}
                  className="text-[11px] font-bold text-cookie-gold hover:underline"
                >
                  MAX
                </button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isSending}
                  className="w-full px-4 py-2.5 rounded-xl bg-cookie-card border border-cookie-border focus:border-cookie-accent text-white placeholder-slate-500 text-xs font-mono focus:outline-none transition pr-16"
                />
                <span className="absolute right-4 top-2.5 text-xs font-bold text-cookie-gold pointer-events-none">
                  $COOK
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {txStatus === 'success' && txSignature && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Transfer confirmed on-chain!</span>
                </div>
                <a
                  href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cookie-gold hover:underline font-semibold flex items-center gap-1 shrink-0"
                >
                  CookieScan
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending || !recipient || !amount}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cookie-accent to-cookie-oven hover:brightness-110 text-cookie-dark font-bold text-xs uppercase tracking-wider transition shadow-cookie-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{txStatus === 'signing' ? 'Awaiting Wallet Signature...' : 'Baking Transaction...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send $COOK On-Chain</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
