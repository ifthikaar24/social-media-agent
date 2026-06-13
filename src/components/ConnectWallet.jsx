import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useEffect } from 'react'

export default function ConnectWallet({ onConnected }) {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const connector = connectors[0]

  useEffect(() => {
    if (isConnected && onConnected) onConnected()
  }, [isConnected])

  if (isConnected) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="text-emerald-400 text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="text-xs text-gray-600 hover:text-red-400 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector })}
      disabled={isPending}
      className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
      style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', color: 'white' }}
    >
      {isPending ? 'Connecting...' : 'Connect MetaMask Flask'}
    </button>
  )
}