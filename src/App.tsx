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
    <div className="min-h-screen bg-[#140d0a] text-[#f5ece1] flex flex-col font-sans selection:bg-[#ffb347] selection:text-[#140d0a]">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Real-time Node Ticker Strip */}
        <NodeTickerBar metrics={metrics} isLive={isLive} />

        {/* Asymmetrical Modular Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Column (8 cols): Hero Fortune Oven & Pastry Vault */}
          <div className="lg:col-span-8 space-y-6">
            <FortuneOven />
            <BakersVault />
          </div>

          {/* Right Sidebar (4 cols): Hearth Gauges & Head Baker AI Oracle */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <HearthInspector
              metrics={metrics}
              loading={loading}
              error={error}
              refresh={refresh}
              isLive={isLive}
            />
          </div>
        </div>

        {/* Ecosystem Directory */}
        <EcosystemHub />
      </main>
    </div>
  )
}

export default App
