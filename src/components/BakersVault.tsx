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
    <div id="vault-section" className="rounded-2xl bg-cookie-card border border-cookie-border/80 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cookie-border/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base tracking-tight">Transfer Vault</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
                $COOK
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Native SVM asset transfers at ~0.8s finality
            </p>
          </div>
        </div>

        {connected && publicKey ? (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-cookie-surface border border-cookie-border text-xs font-mono">
            <span className="text-slate-200">
              {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-white transition rounded hover:bg-cookie-card"
              title="Copy address"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <a
              href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/address/${publicKey.toBase58()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-400 hover:text-cookie-blue transition rounded hover:bg-cookie-card"
              title="View in CookieScan"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <button
            onClick={() => setVisible(true)}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-sky-400 hover:text-sky-300 px-3 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition shadow-sm"
          >
            <Lock className="w-3 h-3 text-sky-400" />
            <span>Vault Locked · Connect</span>
          </button>
        )}
      </div>

      {/* Main Grid: Balance & Transfer Form */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400">YOUR BALANCE</span>
              {connected && (
                <button
                  onClick={fetchBalance}
                  disabled={loadingBalance}
                  className="hover:text-cookie-blue transition"
                  title="Refresh Balance"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingBalance ? 'animate-spin text-cookie-blue' : 'text-slate-300'}`} />
                </button>
              )}
            </div>

            <div className="mt-1">
              {connected ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white font-mono">
                    {balance !== null ? balance.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0.00'}
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-400">$COOK</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-400 font-mono">—.—</span>
                    <span className="text-xs font-mono font-bold text-slate-400">$COOK</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Connect wallet to reveal stash
                  </p>
                </div>
              )}
            </div>

            {connected && balance === 0 && (
              <p className="text-[11px] text-amber-400/90 mt-2 font-sans">
                💡 Need $COOK? Bridge tokens from Solana via Hyperlane below.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <a
              href={COOKIE_CHAIN_CONFIG.bridgeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300 transition"
            >
              <span>Bridge via Hyperlane</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            {!connected && (
              <button
                onClick={() => setVisible(true)}
                className="text-xs font-bold text-sky-400 hover:underline"
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
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center justify-center text-center space-y-3 min-h-[140px]">
              <div className="p-2.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="max-w-sm space-y-1">
                <h4 className="text-sm font-bold text-white">
                  Unlock the Pastry Vault
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Connect your wallet to transfer $COOK across Cookie Chain in ~0.8s with sub-cent network fees.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVisible(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-sky-500/10 active:scale-[0.99]"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Connect Wallet to Transfer</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleTransfer} className="space-y-2.5">
              <div>
                <input
                  type="text"
                  placeholder="Recipient Base58 address (e.g. 7xK2...)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={isSending}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 focus:border-sky-400/60 text-white text-xs font-mono placeholder-slate-400 focus:outline-none transition disabled:opacity-60"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800/90 focus:border-sky-400/60 text-white text-xs font-mono placeholder-slate-400 focus:outline-none transition pr-16 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={handleSetMax}
                      disabled={balance === null || balance <= 0}
                      className="absolute right-2 top-2 text-[10px] font-bold text-sky-400 hover:text-sky-300 px-2 py-0.5 rounded bg-cookie-card border border-cookie-border disabled:opacity-40"
                    >
                      MAX
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending || !recipient || !amount}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-300 hover:to-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 shadow-md shadow-sky-500/10 active:scale-[0.99]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Sending...' : 'Send $COOK'}</span>
                  </button>
                </div>

                {/* Quick percentage shortcuts */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span>Quick:</span>
                  {[25, 50, 75].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSetPercentage(pct)}
                      disabled={balance === null || balance <= 0}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-sky-500/40 transition disabled:opacity-40"
                    >
                      {pct}%
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleSetMax}
                    disabled={balance === null || balance <= 0}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-amber-500/40 transition disabled:opacity-40"
                  >
                    100%
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{errorMessage}</span>
                </div>
              )}

              {txStatus === 'success' && txSignature && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between gap-2">
                  <span className="font-semibold">✓ Transfer Confirmed on Cookie Chain!</span>
                  <a
                    href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${txSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1 font-bold shrink-0"
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
