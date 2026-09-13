import React, { useState, useEffect, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Wallet, Send, Copy, Check, ExternalLink, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react'
import confetti from 'canvas-confetti'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

export const BakersVault: React.FC = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction, connected } = useWallet()
  const { setVisible } = useWalletModal()

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
        colors: ['#e59a38', '#f5b041', '#ff5722'],
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
    <div className="rounded-3xl bg-cookie-card/90 border border-cookie-border/70 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cookie-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cookie-accent/15 border border-cookie-accent/30 text-cookie-gold flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight">The Baker's Vault</h3>
            <p className="text-xs text-slate-400">Manage assets & execute instant $COOK transfers</p>
          </div>
        </div>

        {connected && publicKey && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono">
            <span className="text-slate-300">
              {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
            </span>
            <button
              onClick={handleCopy}
              className="p-0.5 text-slate-400 hover:text-white transition"
              title="Copy address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a
              href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/address/${publicKey.toBase58()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-0.5 text-slate-400 hover:text-cookie-gold transition"
              title="View in CookieScan"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {!connected ? (
        <div className="mt-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center space-y-3">
          <p className="text-xs text-slate-300">
            Connect your wallet to inspect your $COOK balance and transfer funds on Cookie Chain.
          </p>
          <button
            onClick={() => setVisible(true)}
            className="px-5 py-2.5 rounded-xl bg-cookie-card hover:bg-cookie-border border border-cookie-border text-xs font-bold text-cookie-gold transition"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Balance card */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold uppercase tracking-wider text-[11px]">Available $COOK</span>
                <button
                  onClick={fetchBalance}
                  disabled={loadingBalance}
                  className="hover:text-cookie-gold transition"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingBalance ? 'animate-spin text-cookie-gold' : ''}`} />
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {balance !== null ? balance.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0.00'}
                </span>
                <span className="text-xs font-bold text-cookie-gold font-mono">$COOK</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.05]">
              <a
                href={COOKIE_CHAIN_CONFIG.bridgeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-cookie-gold hover:underline"
              >
                Bridge $COOK from Solana
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Transfer form */}
          <div className="md:col-span-2 space-y-3">
            <form onSubmit={handleTransfer} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Recipient Base58 address..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={isSending}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-cookie-gold text-white text-xs font-mono placeholder-slate-500 focus:outline-none transition"
                />
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="Amount to send"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isSending}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-cookie-gold text-white text-xs font-mono placeholder-slate-500 focus:outline-none transition pr-16"
                  />
                  <button
                    type="button"
                    onClick={handleSetMax}
                    className="absolute right-2.5 top-2 text-[10px] font-bold text-cookie-gold hover:underline px-1.5 py-0.5 rounded bg-cookie-card border border-cookie-border/60"
                  >
                    MAX
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSending || !recipient || !amount}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cookie-accent to-cookie-oven hover:brightness-110 text-cookie-dark font-extrabold text-xs uppercase tracking-wider transition shadow-cookie-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Sending...' : 'Send'}</span>
                </button>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{errorMessage}</span>
                </div>
              )}

              {txStatus === 'success' && txSignature && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between">
                  <span>Transfer Confirmed!</span>
                  <a
                    href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cookie-gold hover:underline flex items-center gap-1 font-semibold"
                  >
                    View on CookieScan
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
