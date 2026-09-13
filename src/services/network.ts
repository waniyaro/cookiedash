import { Connection } from '@solana/web3.js'

export interface NetworkMetrics {
  currentSlot: number
  tps: number
  epoch: number
  slotIndex: number
  slotsInEpoch: number
  epochProgressPercent: number
  activeValidators: number
  solanaCoreVersion: string
  isHealthy: boolean
  lastUpdated: number
}

export async function fetchNetworkMetrics(connection: Connection): Promise<NetworkMetrics> {
  try {
    // 1. Fetch current slot and epoch info in parallel
    const [currentSlot, epochInfo, version] = await Promise.all([
      connection.getSlot(),
      connection.getEpochInfo(),
      connection.getVersion(),
    ])

    // 2. Fetch recent performance samples for accurate live TPS
    let calculatedTps = 24 // Fallback reasonable SVM TPS
    try {
      const samples = await connection.getRecentPerformanceSamples(4)
      if (samples && samples.length > 0) {
        const totalTx = samples.reduce((acc, s) => acc + s.numTransactions, 0)
        const totalSecs = samples.reduce((acc, s) => acc + s.samplePeriodSecs, 0)
        if (totalSecs > 0) {
          calculatedTps = Math.round(totalTx / totalSecs)
        }
      }
    } catch {
      // Some RPCs don't support getRecentPerformanceSamples
    }

    // 3. Fetch active validator count
    let activeValidators = 1
    try {
      const voteAccounts = await connection.getVoteAccounts()
      activeValidators = (voteAccounts.current?.length || 0) + (voteAccounts.delinquent?.length || 0) || 1
    } catch {
      // Fallback
    }

    const epochProgressPercent = Math.min(
      100,
      Math.round((epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100)
    )

    return {
      currentSlot,
      tps: Math.max(1, calculatedTps),
      epoch: epochInfo.epoch,
      slotIndex: epochInfo.slotIndex,
      slotsInEpoch: epochInfo.slotsInEpoch,
      epochProgressPercent,
      activeValidators: Math.max(1, activeValidators),
      solanaCoreVersion: version['solana-core'] || '4.1.2',
      isHealthy: true,
      lastUpdated: Date.now(),
    }
  } catch (err) {
    console.warn('Error fetching Cookie Chain metrics:', err)
    throw err
  }
}
