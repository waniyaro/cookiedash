import { Navbar } from './components/Navbar'
import { HeroBanner } from './components/HeroBanner'
import { FortuneOven } from './components/FortuneOven'
import { BakersVault } from './components/BakersVault'
import { OvenStatus } from './components/OvenStatus'
import { HeadBakerOracle } from './components/HeadBakerOracle'
import { EcosystemHub } from './components/EcosystemHub'
import { useNetworkMetrics } from './hooks/useNetworkMetrics'

function App() {
  const { metrics, loading, error, refresh, isLive } = useNetworkMetrics()

  return (
    <div className="min-h-screen text-[#fffbeb] flex flex-col font-sans selection:bg-amber-400 selection:text-[#080402]">
      <Navbar isLive={isLive} currentSlot={metrics?.currentSlot} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section with Onboarding Flow */}
        <HeroBanner />

        {/* 2-Column Responsive Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Primary Actions): Fortune Inscription & Vault */}
          <div className="lg:col-span-7 space-y-8">
            <FortuneOven />
            <BakersVault />
          </div>

          {/* Right Column (Live Intelligence): Telemetry & AI Oracle */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            <OvenStatus
              metrics={metrics}
              loading={loading}
              error={error}
              refresh={refresh}
            />
            <HeadBakerOracle metrics={metrics} isLive={isLive} />
          </div>
        </div>

        {/* Official Ecosystem & Bridge Section */}
        <EcosystemHub />
      </main>
    </div>
  )
}

export default App
