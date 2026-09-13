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
        className="absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md rounded-3xl bg-[#130703] border-2 border-[#381608] shadow-[0_0_80px_rgba(234,88,12,0.3)] p-6 sm:p-7 overflow-hidden z-10 transition-all duration-300 animate-in zoom-in-95">
        {/* Soft Ambient Hearth Glow */}
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between pb-4 border-b border-[#2e1307]">
          <div className="flex items-center gap-3">
            <img
              src="/cookie-sticker.png"
              alt="Cookie Logo"
              className="w-8 h-8 object-contain drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]"
            />
            <div>
              <h3 className="font-display font-black text-[#fffbeb] text-lg tracking-tight">
                Connect Bakery Wallet
              </h3>
              <p className="text-xs text-amber-200/70 font-sans">Cookie Chain SVM Keypair</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#200e06] hover:bg-[#30160a] text-amber-400 hover:text-white transition border border-[#3d1a0c]"
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
                  className={`w-full group p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between text-left active:scale-[0.98] ${
                    isNightly
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border-amber-500/50 hover:border-amber-400 shadow-sm'
                      : 'bg-[#090402] hover:bg-[#1a0c05] border-[#2e1307] hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {wallet.adapter.icon ? (
                      <img
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        className="w-8 h-8 rounded-xl object-contain shrink-0 p-1 bg-black/40 border border-white/10 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-[#200e06] border border-[#3d1a0c] flex items-center justify-center font-black text-xs text-amber-400">
                        {wallet.adapter.name.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-bold text-[#fffbeb] group-hover:text-amber-300 transition-colors">
                        {wallet.adapter.name}
                      </span>
                      {isNightly && (
                        <span className="block text-[10px] font-mono text-amber-400/90 font-semibold">
                          Recommended for Cookie Chain
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-mono text-amber-400 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </button>
              )
            })
          ) : (
            <div className="p-5 rounded-2xl bg-[#0a0402] border border-[#2e1307] text-center space-y-2">
              <p className="text-xs text-amber-200/80 font-sans">
                No active SVM wallets detected in this browser.
              </p>
            </div>
          )}

          {/* Quick link to Nightly if not installed */}
          {!sortedInstalled.some((w) => w.adapter.name.toLowerCase().includes('nightly')) && (
            <a
              href="https://nightly.app"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-[#080402] flex items-center justify-center font-black text-xs">
                  N
                </div>
                <div>
                  <span className="text-xs font-bold text-[#fffbeb]">Install Nightly Wallet</span>
                  <span className="block text-[10px] text-amber-300/80">Native multi-chain SVM support</span>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1 font-bold">
                Get <ArrowUpRight className="w-3 h-3" />
              </span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
