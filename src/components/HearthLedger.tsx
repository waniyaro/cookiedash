import React, { useState } from 'react'
import { ExternalLink, Check, Copy, ScrollText, Radio } from 'lucide-react'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

interface InscriptionEntry {
  id: string
  slot: number
  type: 'MEMO' | 'TRANSFER'
  payload: string
  txHash: string
  timeAgo: string
}

const SAMPLE_LEDGER: InscriptionEntry[] = [
  {
    id: 'tx-1',
    slot: 24871018,
    type: 'MEMO',
    payload: 'Fresh batch straight from the SVM oven: 10,000x $COOK incoming.',
    txHash: '3R1C9BBUH3K42jGQHfP5qSqkx4p4hxeWZyva5c5hHERogspxRnkK2X1C3pwAXKVvFYEykoG1ZWXvBhzxffnp5hFL',
    timeAgo: '14s ago',
  },
  {
    id: 'tx-2',
    slot: 24871012,
    type: 'TRANSFER',
    payload: 'Dispatched 2.5000 $COOK to 7xK2...9pLs',
    txHash: '4Z8kL2mW9vQ1xP7jN3bY6cT5rE8uI0oA2sD4fG6hJ8kL0mN2pQ4rS6tU8vW0xY2z',
    timeAgo: '42s ago',
  },
  {
    id: 'tx-3',
    slot: 24870994,
    type: 'MEMO',
    payload: 'Crispy crust, zero slippage. Cookie Chain is your decentralized kitchen.',
    txHash: '5A1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1p',
    timeAgo: '1m ago',
  },
  {
    id: 'tx-4',
    slot: 24870960,
    type: 'MEMO',
    payload: 'Baking temperature: 420°C. Gas fees: < 0.0001 $COOK. Life is sweet.',
    txHash: '2N3pQ4rS5tU6vW7xY8zA9bC0dE1fG2hI3jK4lM5nO6pQ7rS8tU9vW0xY1zA2bC3d',
    timeAgo: '2m ago',
  },
]

export const HearthLedger: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section className="bakery-card rounded-3xl p-5 sm:p-6 transition-all space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#2d1e17]">
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-[#d4a15c]" />
          <h3 className="font-display font-bold text-sm sm:text-base text-[#f5ece1] tracking-tight">
            Recent Hearth Inscriptions &amp; Activity
          </h3>
        </div>

        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0c0806] border border-[#2d1e17] text-[10px] font-mono text-[#968579]">
          <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
          <span>Memo Feed</span>
        </span>
      </div>

      {/* Inscription Stream List */}
      <div className="space-y-2.5">
        {SAMPLE_LEDGER.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-[#0c0806] border border-[#2d1e17] hover:border-[#442f24] transition-colors space-y-2 text-xs"
          >
            <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
              <div className="flex items-center gap-2">
                <span
                  className={`px-1.5 py-0.5 rounded font-bold ${
                    item.type === 'MEMO'
                      ? 'bg-[#ff7a1a]/15 text-[#ffb347] border border-[#ff7a1a]/30'
                      : 'bg-[#d4a15c]/15 text-[#d4a15c] border border-[#d4a15c]/30'
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-[#968579]">Slot #{item.slot.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#968579]">{item.timeAgo}</span>
                <a
                  href={`${COOKIE_CHAIN_CONFIG.explorerUrl}/tx/${item.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#968579] hover:text-[#d4a15c] transition"
                  title="Inspect on CookieScan"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <p className="text-[#f5ece1] font-sans text-xs leading-relaxed">
              "{item.payload}"
            </p>

            <div className="flex items-center justify-between text-[10px] font-mono text-[#968579] pt-1">
              <span>Tx: {item.txHash.slice(0, 8)}...{item.txHash.slice(-8)}</span>
              <button
                onClick={() => handleCopy(item.id, item.txHash)}
                className="hover:text-[#f5ece1] transition inline-flex items-center gap-1"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5" />
                    <span>Copy Tx</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
