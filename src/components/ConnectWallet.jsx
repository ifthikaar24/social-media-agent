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
      <div className="status-row">
        <div className="status-left">
          <span className="dot" />
          <span className="mono">{address.slice(0, 6)}…{address.slice(-4)}</span>
        </div>
        <button type="button" className="btn-ghost" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => connect({ connector })}
      disabled={isPending}
      className="btn btn-primary btn-block"
    >
      {isPending ? 'Connecting…' : 'Connect MetaMask Flask'}
    </button>
  )
}
