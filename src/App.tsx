import { Navbar } from './components/Navbar'
import { OvenStatus } from './components/OvenStatus'
import { FortuneOven } from './components/FortuneOven'
import { BakersVault } from './components/BakersVault'
import { HeadBakerOracle } from './components/HeadBakerOracle'
import { EcosystemHub } from './components/EcosystemHub'
import { useNetworkMetrics } from './hooks/useNetworkMetrics'

function App() {
  const { metrics, loading, error, refresh, isLive } = useNetworkMetrics()

  return (
    <div className="min-h-screen bg-cookie-dark text-slate-100 flex flex-col font-sans selection:bg-cookie-accent selection:text-cookie-dark">
      <Navbar isLive={isLive} currentSlot={metrics?.currentSlot} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Oven Status & Telemetry */}
        <OvenStatus
          metrics={metrics}
          loading={loading}
          error={error}
          refresh={refresh}
        />

        {/* Head Baker AI Oracle (Dynamic On-chain Context) */}
        <HeadBakerOracle metrics={metrics} isLive={isLive} />

        {/* On-Chain Fortune Cookie (Flagship On-Chain Feature) */}
        <FortuneOven />

        {/* Baker's Vault (Portfolio & Instant Transfer) */}
        <BakersVault />

        {/* Official Ecosystem Hub & Bridge Guide */}
        <EcosystemHub />
      </main>
    </div>
  )
}

export default App
