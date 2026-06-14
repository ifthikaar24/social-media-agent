import { useRef, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function ConnectWallet({ onConnected }) {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const connector = connectors[0]
  const hasLogged = useRef(false)

  useEffect(() => {
    if (isConnected && onConnected && !hasLogged.current) {
      hasLogged.current = true
      onConnected()
    }
  }, [isConnected])

  if (isConnected) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}></div>
          <span style={{ color: '#10B981', fontSize: 13, fontFamily: 'monospace' }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          style={{ fontSize: 12, color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer' }}
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
      style={{
        width: '100%',
        padding: '12px',
        borderRadius: 12,
        border: 'none',
        cursor: isPending ? 'not-allowed' : 'pointer',
        fontWeight: 700,
        fontSize: 14,
        opacity: isPending ? 0.5 : 1,
        background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
        color: 'white',
        transition: 'all 0.2s'
      }}
    >
      {isPending ? 'Connecting...' : 'Connect MetaMask Flask'}
    </button>
  )
}