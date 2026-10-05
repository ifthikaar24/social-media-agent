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
    <div className="flex flex-col gap-3">
      {!smartAddress ? (
        <button
          type="button"
          onClick={handleCreateSmartAccount}
          disabled={loading}
          className="btn btn-primary btn-block"
        >
          {loading ? 'Creating smart account…' : 'Create smart account'}
        </button>
      ) : (
        <div className="status-row">
          <div className="status-left">
            <span className="dot" />
            <span className="mono">{smartAddress.slice(0, 6)}…{smartAddress.slice(-4)}</span>
          </div>
          <span className="step-sub">Active</span>
        </div>
      )}
      {error && <p className="error-box">{error}</p>}
    </div>
  )
}
