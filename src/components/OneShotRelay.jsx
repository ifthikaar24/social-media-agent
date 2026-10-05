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

      if (!caps || Object.keys(caps).length === 0) {
        throw new Error('No capabilities returned from relayer')
      }

      onLog('1Shot relayer capabilities fetched ✓', 'success')

      const chainData = caps['8453'] || caps
      const tokens = chainData.tokens || []
      const targetAddress = chainData.targetAddress || chainData.feeCollector || ''
      const usdcToken = tokens.find(t =>
        t.symbol?.toUpperCase() === 'USDC'
      ) || tokens[0]

      if (usdcToken) {
        onLog(`Accepted tokens: ${tokens.map(t => t.symbol).join(', ')}`, 'info')
        onLog('Fetching fee quote from 1Shot relayer...', 'agent')

        const fee = await getRelayerFeeData(usdcToken.address)

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
      <p className="hint">
        Connect to 1Shot’s permissionless relayer on Base — relay EIP-7710 transactions with gas paid in USDC. No signup, no API key.
      </p>

      <button
        type="button"
        onClick={handleConnect}
        disabled={loading || !!relayerInfo}
        className="btn btn-block"
        style={{
          background: relayerInfo ? 'var(--accent-soft)' : 'var(--accent)',
          color: relayerInfo ? 'var(--accent)' : '#f8f4eb',
          border: relayerInfo ? '1px solid #c9ddd2' : 'none',
        }}
      >
        {loading ? 'Connecting…' : relayerInfo ? 'Relayer connected' : 'Connect 1Shot relayer'}
      </button>

      {relayerInfo && (
        <div className="result">
          <p className="result-label">1Shot relayer</p>
          <div className="meta-list">
            <div className="meta-row">
              <span>Network</span>
              <span className="mono" style={{ color: 'var(--ink)' }}>Base (8453)</span>
            </div>
            <div className="meta-row">
              <span>Accepted tokens</span>
              <span>
                {relayerInfo.tokens.length > 0
                  ? relayerInfo.tokens.map(t => t.symbol).join(', ')
                  : 'USDC, USDT'}
              </span>
            </div>
            {relayerInfo.targetAddress && (
              <div className="meta-row">
                <span>Delegate</span>
                <span className="mono" style={{ color: 'var(--ink)' }}>
                  {relayerInfo.targetAddress.slice(0, 10)}…
                </span>
              </div>
            )}
            {relayerInfo.fee && (
              <div className="meta-row">
                <span>Min fee</span>
                <span>{relayerInfo.fee.minFee} USDC atoms</span>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}
    </div>
  )
}
