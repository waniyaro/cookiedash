import React from 'react'
import type { NetworkMetrics } from '../services/network'

interface NodeTickerBarProps {
  metrics: NetworkMetrics | null
  isLive: boolean
}

export const NodeTickerBar: React.FC<NodeTickerBarProps> = ({ metrics, isLive }) => {
  const slot = metrics?.currentSlot ? `#${metrics.currentSlot.toLocaleString()}` : '#24,871,012'
  const tps = metrics?.tps ?? 9
  const epoch = metrics?.epoch ?? 12
  const epochProg = metrics?.epochProgressPercent ?? 57
  const version = metrics?.solanaCoreVersion || '4.1.2'

  return (
    <section aria-label="Cookie Chain Live Node Telemetry" className="w-full">
      <div className="w-full rounded-2xl bg-[#0e0806] border border-[#3a251e]/80 px-4 py-2.5 shadow-inner flex items-center justify-between gap-4 overflow-x-auto text-xs font-mono">
        {/* Left: Node Identity & Ping */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLive ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLive ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </span>
          <span className="text-[#f5ece1] font-bold tracking-wide">rpc.cookiescan.io</span>
          <span className="text-[#998376]">•</span>
          <span className="text-[#998376]">Cookie Chain SVM</span>
        </div>

        {/* Center: Live Stats Sequence */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-[#998376]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#998376]">slot</span>
            <span className="text-[#f5ece1] font-bold">{slot}</span>
          </div>

          <span>·</span>

          <div className="flex items-center gap-1.5">
            <span className="text-[#f5ece1] font-bold text-[#ffb347]">{tps}</span>
            <span>TPS</span>
          </div>

          <span>·</span>

          <div className="flex items-center gap-1.5">
            <span>epoch {epoch}</span>
            <span className="text-[#f5ece1] font-semibold">({epochProg}%)</span>
          </div>

          <span className="hidden sm:inline">·</span>

          <div className="hidden sm:flex items-center gap-1.5">
            <span>finality</span>
            <span className="text-[#d4a15c] font-semibold">~0.8s</span>
          </div>

          <span className="hidden md:inline">·</span>

          <div className="hidden md:flex items-center gap-1.5">
            <span>core</span>
            <span className="text-[#f5ece1]">v{version}</span>
          </div>
        </div>

        {/* Right: Memo Program ID badge */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-[11px] text-[#998376]">
          <span>memo:</span>
          <span className="text-[#d4a15c] font-mono">MemoSq...fcHr</span>
        </div>
      </div>
    </section>
  )
}
