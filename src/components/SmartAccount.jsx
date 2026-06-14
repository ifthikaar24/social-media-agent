import { useState } from 'react'
import { useAccount } from 'wagmi'
import { createSmartAccount } from '../config/smartAccount'

export default function SmartAccount({ onSmartAccount }) {
  const { address, isConnected } = useAccount()
  const [smartAddress, setSmartAddress] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleCreateSmartAccount() {
    try {
      setLoading(true)
      setError(null)
      const smartAccount = await createSmartAccount(address)
      setSmartAddress(smartAccount.address)
      onSmartAccount(smartAccount)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) return null

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      {!smartAddress ? (
        <button
          onClick={handleCreateSmartAccount}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 12,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: 14,
            opacity: loading ? 0.5 : 1,
            background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
            color: 'white',
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Creating Smart Account...' : 'Create Smart Account'}
      </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}></div>
          <span style={{ color: '#10B981', fontSize: 13, fontFamily: 'monospace' }}>
            {smartAddress.slice(0, 6)}...{smartAddress.slice(-4)}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#4b5563' }}>Smart Account Active</span>
        </div>
      )}
      {error && (
        <p className="text-red-400 text-xs max-w-sm text-center">{error}</p>
      )}
    </div>
  )
}