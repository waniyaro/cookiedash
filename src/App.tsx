import { Navbar } from './components/Navbar'
import { NodeTickerBar } from './components/NodeTickerBar'
import { FortuneOven } from './components/FortuneOven'
import { BakersVault } from './components/BakersVault'
import { HearthInspector } from './components/HearthInspector'
import { EcosystemHub } from './components/EcosystemHub'
import { useNetworkMetrics } from './hooks/useNetworkMetrics'

function App() {
  const { metrics, loading, error, refresh, isLive } = useNetworkMetrics()

  return (
    <div className="min-h-screen bg-[#0d0907] text-[#f5ece1] flex flex-col font-sans selection:bg-[#ffb347] selection:text-[#0d0907]">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Real-time Node Ticker Strip */}
        <NodeTickerBar metrics={metrics} isLive={isLive} />

        {/* FULL-WIDTH TOP HERO: Fortune Oven */}
        <FortuneOven />

        {/* Asymmetrical Bento Grid: Pastry Vault (7 cols) + Hearth Telemetry & AI (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <BakersVault />
          </div>

          <div className="lg:col-span-5">
            <HearthInspector
              metrics={metrics}
              loading={loading}
              error={error}
              refresh={refresh}
              isLive={isLive}
            />
          </div>
        </div>

        {/* Ecosystem Registry & Infrastructure Table */}
        <EcosystemHub />
      </main>
    </div>
  )
}

export default App
