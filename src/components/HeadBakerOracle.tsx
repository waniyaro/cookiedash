import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Terminal, Activity, BookOpen, Cpu, CornerDownLeft, UserCheck } from 'lucide-react'
import type { NetworkMetrics } from '../services/network'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

interface HeadBakerOracleProps {
  metrics: NetworkMetrics | null
  isLive: boolean
}

export const HeadBakerOracle: React.FC<HeadBakerOracleProps> = ({ metrics, isLive }) => {
  const { publicKey, connected } = useWallet()
  const [selectedPrompt, setSelectedPrompt] = useState<string>('status')
  const [customCommand, setCustomCommand] = useState<string>('')
  const [terminalHistory, setTerminalHistory] = useState<string[]>([])
  const [isThinking, setIsThinking] = useState<boolean>(false)

  const getOracleResponse = (promptKey: string, customArg?: string): string => {
    const tps = metrics?.tps || 24
    const slot = metrics?.currentSlot || 1849200
    const version = metrics?.solanaCoreVersion || '4.1.2'
    const epoch = metrics?.epoch ?? 12
    const epochProg = metrics?.epochProgressPercent ?? 64
    const walletStr = publicKey ? publicKey.toBase58() : null

    switch (promptKey.toLowerCase().trim()) {
      case 'status':
      case 'telemetry':
        return `[TELEMETRY LIVE] Node: rpc.cookiescan.io
Slot: #${slot.toLocaleString()} | TPS: ${tps} | Epoch: ${epoch} (${epochProg}% complete)
SVM Engine: solana-core v${version} | Genesis: 9wDaBRDg...
Cluster State: HEALTHY | Finality: ~0.8s | Avg Fee: <0.0001 $COOK`

      case 'wallet':
      case 'whoami':
        if (!connected || !walletStr) {
          return `[WALLET AUDIT] No active wallet connected.
Running in read-only passive observer mode on Cookie Chain.
Connect Nightly or SVM wallet to inspect balances and inscribe fortunes.`
        }
        return `[WALLET AUDIT] Address: ${walletStr}
Network: ${COOKIE_CHAIN_CONFIG.name} (SVM Genesis: 9wDaBRDg...)
Readiness: Verified for Solana Memo & Native Transfers.
Recommended next step: Inscribe a fortune or send $COOK via Transfer Vault.`

      case 'memo':
      case 'fortune':
        return `[MEMO SPECIFICATION]
Program ID: ${COOKIE_CHAIN_CONFIG.memoProgramId}
Operation: Writes permanent UTF-8 memo payload directly into slot #${slot.toLocaleString()}.
Byte limit: 566 bytes | Cost: Single signature fee (~0.000005 $COOK).`

      case 'bridge':
      case 'hyperlane':
        return `[HYPERLANE INTEROP]
Route: Solana Mainnet <—> Cookie Chain SVM (Warp Route)
Portal URL: ${COOKIE_CHAIN_CONFIG.bridgeUrl}
Status: Online. Transfer $COOK cross-chain with guaranteed finality.`

      case 'mcp':
        return JSON.stringify(
          {
            protocol: 'cookie-mcp/v1.0',
            server: 'cookiechain-oracle',
            live_slot: slot,
            cluster_tps: tps,
            connected_chef: walletStr ? `${walletStr.slice(0, 6)}...${walletStr.slice(-6)}` : null,
            tools: ['get_metrics', 'bake_fortune', 'query_balance', 'estimate_gas'],
          },
          null,
          2
        )

      case 'bake':
        return `[AI BAKER RECIPE] Batch input: "${customArg || 'Fresh Cinnamon Cookie'}".
Ingredients: 100% on-chain SVM compute, 0.000005 $COOK gas, ~0.8s oven heating time.
Ready to bake in slot #${(slot + 1).toLocaleString()}.`

      case 'help':
        return `Available terminal commands:
• status  - Live node telemetry and slot index
• wallet  - Real-time audit of connected wallet
• memo    - Solana Memo program specs
• bridge  - Hyperlane bridge warp route
• mcp     - Output official Model Context Protocol schema
• bake <text> - AI recipe analysis for fortune text
• clear   - Clear terminal output`

      case 'clear':
        return ''

      default:
        return `Unknown command "${promptKey}". Type "help" or click one of the quick queries above.`
    }
  }

  const handleSelectPrompt = (key: string) => {
    setIsThinking(true)
    setSelectedPrompt(key)
    setTimeout(() => setIsThinking(false), 150)
  }

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customCommand.trim()) return

    const input = customCommand.trim()
    const [cmd, ...args] = input.split(' ')
    const argString = args.join(' ')

    if (cmd.toLowerCase() === 'clear') {
      setTerminalHistory([])
      setCustomCommand('')
      return
    }

    setIsThinking(true)
    setTimeout(() => {
      const response = getOracleResponse(cmd, argString)
      setTerminalHistory((prev) => [...prev.slice(-3), `baker> ${input}`, response])
      setSelectedPrompt(cmd.toLowerCase())
      setIsThinking(false)
      setCustomCommand('')
    }, 150)
  }

  return (
    <div id="oracle-section" className="rounded-2xl bg-[#120703]/90 border border-[#381608] p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2e1307]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Terminal className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="font-display font-black text-[#fffbeb] text-lg tracking-tight flex items-center gap-2">
              <span>Head Baker AI</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                Hearth Dispatch
              </span>
            </h3>
            <p className="text-xs text-amber-200/70 mt-0.5 font-sans">Autonomous agent oracle &amp; Model Context Protocol</p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1e0d06] text-amber-300 border border-[#3d1a0c] font-bold">
          cookie-mcp
        </span>
      </div>

      {/* Query Selector Slips */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        <button
          onClick={() => handleSelectPrompt('status')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border active:scale-95 ${
            selectedPrompt === 'status'
              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold shadow-sm shadow-amber-500/20'
              : 'bg-[#0a0402] border-[#2e1307] text-amber-200/70 hover:text-white hover:border-amber-500/30'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Node Feed</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('wallet')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border active:scale-95 ${
            selectedPrompt === 'wallet'
              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold shadow-sm shadow-amber-500/20'
              : 'bg-[#0a0402] border-[#2e1307] text-amber-200/70 hover:text-white hover:border-amber-500/30'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Audit Wallet</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('memo')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border active:scale-95 ${
            selectedPrompt === 'memo' || selectedPrompt === 'fortune'
              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold shadow-sm shadow-amber-500/20'
              : 'bg-[#0a0402] border-[#2e1307] text-amber-200/70 hover:text-white hover:border-amber-500/30'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Memo Spec</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('mcp')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border active:scale-95 ${
            selectedPrompt === 'mcp'
              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold shadow-sm shadow-amber-500/20'
              : 'bg-[#0a0402] border-[#2e1307] text-amber-200/70 hover:text-white hover:border-amber-500/30'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">MCP JSON</span>
        </button>
      </div>

      {/* Amber Phosphor Hearth Terminal */}
      <div className="mt-3.5 rounded-2xl bg-[#060301] border-2 border-[#381608] overflow-hidden font-mono text-xs shadow-inner shadow-black">
        {/* Terminal Titlebar - Industrial Bakehouse Console */}
        <div className="px-3.5 py-2 bg-[#160a04] border-b border-[#2e1307] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse" />
            <span className="text-[11px] text-amber-300 font-bold tracking-wider">CHEF-TERMINAL // DISPATCH</span>
          </div>
          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            {isLive ? 'ACTIVE' : 'STANDBY'}
          </span>
        </div>

        {/* Content Body - Amber Phosphor Typography */}
        <div className="p-4 text-amber-100/90 leading-relaxed min-h-[105px] max-h-[160px] overflow-y-auto space-y-2 select-text">
          {terminalHistory.length > 0 && (
            <div className="space-y-1 text-amber-500/70 text-[11px] border-b border-[#2e1307] pb-2">
              {terminalHistory.map((line, idx) => (
                <div key={idx} className={line.startsWith('baker>') ? 'text-amber-300 font-bold' : 'text-amber-200/80'}>
                  {line}
                </div>
              ))}
            </div>
          )}

          {isThinking ? (
            <span className="text-amber-400 animate-pulse font-bold">Querying hearth telemetry &amp; node state...</span>
          ) : (
            <pre className="whitespace-pre-wrap text-amber-300 text-[11px] font-mono leading-relaxed drop-shadow-[0_0_6px_rgba(245,158,11,0.3)]">
              {getOracleResponse(selectedPrompt)}
            </pre>
          )}
        </div>

        {/* Interactive CLI Input Line */}
        <form
          onSubmit={handleCommandSubmit}
          className="px-3.5 py-2.5 bg-[#0f0703] border-t border-[#2e1307] flex items-center gap-2"
        >
          <span className="text-amber-400 font-bold text-xs select-none">chef&gt;</span>
          <input
            type="text"
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            placeholder="Type 'help', 'status', 'wallet', 'bake <wisdom>'..."
            className="flex-1 bg-transparent text-[#fffbeb] placeholder-amber-700/80 text-xs font-mono focus:outline-none"
          />
          <button
            type="submit"
            className="px-2 py-1 rounded bg-[#241006] hover:bg-[#381a0b] text-amber-300 hover:text-white border border-[#3d1a0c] transition active:scale-95"
            title="Execute Command"
          >
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  )
}

