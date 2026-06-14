import { useState } from 'react'
import { getRelayerCapabilities, getRelayerFeeData } from '../services/oneshot'

export default function OneShotRelay({ onLog, onReady }) {
  const [loading, setLoading] = useState(false)
  const [relayerInfo, setRelayerInfo] = useState(null)
  const [error, setError] = useState(null)

  async function handleConnect() {
    try {
      setLoading(true)
      setError(null)

      onLog('Connecting to 1Shot Permissionless Relayer (Base)...', 'agent')

      const caps = await getRelayerCapabilities()
      console.log('1Shot capabilities:', JSON.stringify(caps, null, 2))

      if (!caps || Object.keys(caps).length === 0) {
        throw new Error('No capabilities returned from relayer')
      }

      onLog('1Shot relayer capabilities fetched ✓', 'success')

      // Extract tokens and targetAddress from response
      const tokens = caps.tokens || []
      const targetAddress = caps.targetAddress || caps.delegate || ''
      const usdcToken = tokens.find(t =>
        t.symbol?.toUpperCase() === 'USDC'
      ) || tokens[0]

      if (usdcToken) {
        onLog(`Accepted tokens: ${tokens.map(t => t.symbol).join(', ')}`, 'info')
        onLog('Fetching fee quote from 1Shot relayer...', 'agent')

        const fee = await getRelayerFeeData(usdcToken.address)
        console.log('1Shot fee data:', JSON.stringify(fee, null, 2))

        onLog(`Fee quote: minFee = ${fee?.minFee || 'N/A'} (USDC)`, 'success')
        onLog(`Relayer delegate: ${targetAddress?.slice(0, 10) || 'N/A'}...`, 'info')
        onLog('1Shot relayer ready — EIP-7710 transactions can be relayed', 'success')

        setRelayerInfo({ tokens, targetAddress, fee, usdcToken })
        onReady()
      } else {
        onLog('Relayer connected — no token data in response', 'info')
        setRelayerInfo({ tokens: [], targetAddress, fee: null })
        onReady()
      }

    } catch (err) {
      console.error(err)
      setError(err.message)
      onLog(`1Shot error: ${err.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-gray-400 text-xs">
        Connect to 1Shot's permissionless relayer on Base — relay EIP-7710 transactions with gas paid in USDC. No signup, no API key needed.
      </p>

      <button
        onClick={handleConnect}
        disabled={loading || !!relayerInfo}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
        style={{
          background: relayerInfo
            ? '#1a2a1a'
            : 'linear-gradient(135deg, #0EA5E9, #6366F1)',
          color: 'white',
          border: relayerInfo ? '1px solid #22c55e' : 'none'
        }}
      >
        {loading ? 'Connecting...' : relayerInfo ? '⚡ Relayer Connected' : '⚡ Connect 1Shot Relayer'}
      </button>

      {relayerInfo && (
        <div className="rounded-xl p-4 border border-cyan-800/50" style={{ background: '#0D1117' }}>
          <p className="text-xs text-cyan-400 mb-3 uppercase tracking-wider font-semibold">
            1Shot Relayer Active ✅
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">Network</span>
              <span className="text-white text-xs font-mono">Base (8453)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-xs">Accepted tokens</span>
              <span className="text-emerald-400 text-xs">
                {relayerInfo.tokens.length > 0
                  ? relayerInfo.tokens.map(t => t.symbol).join(', ')
                  : 'USDC, USDT'}
              </span>
            </div>
            {relayerInfo.targetAddress && (
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Delegate</span>
                <span className="text-white text-xs font-mono">
                  {relayerInfo.targetAddress.slice(0, 10)}...
                </span>
              </div>
            )}
            {relayerInfo.fee && (
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs">Min fee</span>
                <span className="text-cyan-400 text-xs">
                  {relayerInfo.fee.minFee} USDC atoms
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl p-3 border border-red-800 bg-red-950/30">
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}
    </div>
  )
}