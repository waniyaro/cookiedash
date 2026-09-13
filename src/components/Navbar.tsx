import React, { useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { ExternalLink, CheckCircle2, Shield, Radio } from 'lucide-react'
import { COOKIE_CHAIN_CONFIG, switchNightlyToCookieChain } from '../config/network'

interface NavbarProps {
  isLive: boolean
  currentSlot?: number
}

export const Navbar: React.FC<NavbarProps> = ({ isLive, currentSlot }) => {
  const { wallet } = useWallet()
  const [switchingNetwork, setSwitchingNetwork] = useState(false)
  const [switchSuccess, setSwitchSuccess] = useState(false)

  const handleSwitchNetwork = async () => {
    setSwitchingNetwork(true)
    const success = await switchNightlyToCookieChain()
    setSwitchingNetwork(false)
    if (success) {
      setSwitchSuccess(true)
      setTimeout(() => setSwitchSuccess(false), 3000)
    }
  }

  const isNightly = wallet?.adapter.name.toLowerCase().includes('nightly')

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cookie-bg/90 border-b border-cookie-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-amber-400 p-[1px] shadow-sm">
              <div className="w-full h-full rounded-[11px] bg-cookie-card flex items-center justify-center font-black text-cookie-blue text-sm">
                CK
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white">
                  Cookie<span className="text-cookie-blue">Dash</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  SVM
                </span>
              </div>
            </div>
          </div>

          {/* RPC Connection Status */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono">
              <Radio className={`w-3 h-3 ${isLive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
              <span className="text-slate-300">{isLive ? 'rpc.cookiescan.io' : 'Connecting...'}</span>
              {currentSlot ? (
                <span className="text-sky-400 border-l border-slate-800 pl-1.5">
                  #{currentSlot.toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Actions & Wallet */}
        <div className="flex items-center gap-2.5">
          {/* Bridge Link */}
          <a
            href={COOKIE_CHAIN_CONFIG.bridgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cookie-card hover:bg-cookie-surface border border-cookie-border text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <span>Bridge</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          {/* Nightly Auto Switch */}
          {isNightly && (
            <button
              onClick={handleSwitchNetwork}
              disabled={switchingNetwork}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-xs font-medium text-sky-300 transition"
              title="Set Cookie Chain RPC in Nightly"
            >
              {switchSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Configured</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>{switchingNetwork ? 'Configuring...' : 'Set Nightly RPC'}</span>
                </>
              )}
            </button>
          )}

          {/* Wallet Button */}
          <div className="wallet-button-wrapper">
            <WalletMultiButton className="!bg-sky-500 hover:!bg-sky-400 !text-slate-950 !h-9 !px-4 !rounded-xl !text-xs !font-bold !transition-all !duration-150 !font-sans shadow-sm" />
          </div>
        </div>
      </div>
    </header>
  )
}
