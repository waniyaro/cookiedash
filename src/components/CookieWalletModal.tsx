import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { X, ArrowUpRight } from 'lucide-react'

interface CookieWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CookieWalletModal: React.FC<CookieWalletModalProps> = ({ isOpen, onClose }) => {
  const { wallets, select, connecting } = useWallet()

  if (!isOpen) return null

  const handleSelectWallet = async (walletName: string) => {
    try {
      select(walletName as any)
      onClose()
    } catch (err) {
      console.error('Failed to select wallet:', err)
    }
  }

  // Filter installed wallets
  const installedWallets = wallets.filter(
    (w) => w.readyState === 'Installed' || w.readyState === 'Loadable'
  )

  // Prioritize Nightly and Phantom
  const priorityOrder = ['Nightly', 'Phantom', 'Solflare', 'Backpack']
  const sortedInstalled = [...installedWallets].sort((a, b) => {
    const idxA = priorityOrder.indexOf(a.adapter.name)
    const idxB = priorityOrder.indexOf(b.adapter.name)
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB)
  })

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md rounded-3xl bg-cookie-card border border-cookie-border shadow-2xl p-6 sm:p-7 overflow-hidden z-10 transition-all duration-300 animate-in zoom-in-95">
        {/* Soft Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between pb-4 border-b border-cookie-border/80">
          <div className="flex items-center gap-3">
            <img
              src="/cookie-sticker.png"
              alt="Cookie Logo"
              className="w-8 h-8 object-contain drop-shadow-sm"
            />
            <h3 className="font-extrabold text-white text-base tracking-tight">
              Connect Wallet
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-cookie-surface hover:bg-cookie-border text-slate-400 hover:text-white transition"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wallets List */}
        <div className="mt-4 space-y-2 max-h-[340px] overflow-y-auto pr-0.5">
          {sortedInstalled.length > 0 ? (
            sortedInstalled.map((wallet) => {
              const isNightly = wallet.adapter.name.toLowerCase().includes('nightly')
              return (
                <button
                  key={wallet.adapter.name}
                  onClick={() => handleSelectWallet(wallet.adapter.name)}
                  disabled={connecting}
                  className={`w-full group p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between text-left ${
                    isNightly
                      ? 'bg-sky-500/10 hover:bg-sky-500/15 border-sky-500/30 hover:border-sky-500/50'
                      : 'bg-cookie-surface hover:bg-cookie-surface/80 border-cookie-border hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {wallet.adapter.icon ? (
                      <img
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        className="w-7 h-7 rounded-xl object-contain shrink-0 p-0.5 bg-black/20 border border-white/5 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-xl bg-cookie-card border border-cookie-border flex items-center justify-center font-bold text-xs text-sky-400">
                        {wallet.adapter.name.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                        {wallet.adapter.name}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-sky-400 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </button>
              )
            })
          ) : (
            <div className="p-4 rounded-2xl bg-cookie-surface/50 border border-cookie-border text-center space-y-2">
              <p className="text-xs text-slate-300">
                No supported Solana/SVM wallets detected in this browser.
              </p>
            </div>
          )}

          {/* Quick link to Nightly if not installed */}
          {!sortedInstalled.some((w) => w.adapter.name.toLowerCase().includes('nightly')) && (
            <a
              href="https://nightly.app"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-cookie-surface/40 hover:bg-cookie-surface border border-cookie-border hover:border-sky-500/30 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-500/30">
                  N
                </div>
                <span className="text-xs font-bold text-white">Nightly Wallet</span>
              </div>
              <span className="text-[11px] font-mono text-cookie-blue flex items-center gap-1">
                Install <ArrowUpRight className="w-3 h-3" />
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
