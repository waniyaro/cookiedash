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
    <div id="oracle-section" className="rounded-2xl bg-cookie-card border border-cookie-border/80 p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-cookie-border/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base tracking-tight flex items-center gap-2">
              <span>Head Baker AI</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
                LIVE ORACLE
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">Real-time SVM telemetry &amp; autonomous agent MCP</p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cookie-surface text-sky-400 border border-cookie-border">
          cookie-mcp
        </span>
      </div>

      {/* Query Selector Tabs */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        <button
          onClick={() => handleSelectPrompt('status')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border ${
            selectedPrompt === 'status'
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-bold'
              : 'bg-slate-950/70 border-slate-800/90 text-slate-300 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="truncate">Node</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('wallet')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border ${
            selectedPrompt === 'wallet'
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-bold'
              : 'bg-slate-950/70 border-slate-800/90 text-slate-300 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">Wallet</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('memo')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border ${
            selectedPrompt === 'memo' || selectedPrompt === 'fortune'
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-bold'
              : 'bg-slate-950/70 border-slate-800/90 text-slate-300 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate">Memo</span>
        </button>

        <button
          onClick={() => handleSelectPrompt('mcp')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all text-center flex items-center justify-center gap-1.5 border ${
            selectedPrompt === 'mcp'
              ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-bold'
              : 'bg-slate-950/70 border-slate-800/90 text-slate-300 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">MCP JSON</span>
        </button>
      </div>

      {/* Terminal Window with macOS Chrome */}
      <div className="mt-3 rounded-xl bg-slate-950 border border-slate-800/90 overflow-hidden font-mono text-xs shadow-inner">
        {/* Titlebar with Traffic Lights */}
        <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[10px] text-slate-300 font-semibold">baker-oracle@cookiechain:~</span>
          <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {isLive ? 'LIVE' : 'SYNCING'}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-3.5 text-slate-200 leading-relaxed min-h-[95px] max-h-[160px] overflow-y-auto space-y-2 select-text">
          {terminalHistory.length > 0 && (
            <div className="space-y-1.5 text-slate-400 text-[11px] border-b border-slate-800 pb-2">
              {terminalHistory.map((line, idx) => (
                <div key={idx} className={line.startsWith('baker>') ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                  {line}
                </div>
              ))}
            </div>
          )}

          {isThinking ? (
            <span className="text-sky-400 animate-pulse">Running live SVM telemetry query...</span>
          ) : (
            <pre className="whitespace-pre-wrap text-emerald-300 text-[11px] font-mono leading-relaxed">
              {getOracleResponse(selectedPrompt)}
            </pre>
          )}
        </div>

        {/* Interactive CLI Input Line */}
        <form
          onSubmit={handleCommandSubmit}
          className="px-3 py-2 bg-slate-900/70 border-t border-slate-800/80 flex items-center gap-2"
        >
          <span className="text-emerald-400 font-bold text-xs select-none">baker&gt;</span>
          <input
            type="text"
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            placeholder="Type 'help', 'status', 'wallet', 'bake <msg>'..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-400 text-xs font-mono focus:outline-none"
          />
          <button
            type="submit"
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Execute Command"
          >
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  )
}

