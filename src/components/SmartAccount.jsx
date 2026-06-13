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
          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          {loading ? 'Creating Smart Account...' : 'Create Smart Account'}
        </button>
      ) : (
        <div className="bg-purple-900 border border-purple-500 rounded-lg px-4 py-2 text-purple-300 text-sm">
          ✅ Smart Account: {smartAddress.slice(0, 6)}...{smartAddress.slice(-4)}
        </div>
      )}
      {error && (
        <p className="text-red-400 text-xs max-w-sm text-center">{error}</p>
      )}
    </div>
  )
}