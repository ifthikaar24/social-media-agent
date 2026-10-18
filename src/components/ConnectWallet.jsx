import { useRef, useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

import { getMetaMaskFlaskError } from '../utils/metamask'

export default function ConnectWallet({ onConnected }) {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const connector = connectors[0]
  const hasLogged = useRef(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isConnected && onConnected && !hasLogged.current) {
      hasLogged.current = true
      setError('')
      onConnected()
    }
  }, [isConnected])

  async function handleConnect() {
    const provider = typeof window !== 'undefined' ? window.ethereum : null
    const installError = getMetaMaskFlaskError(provider)

    if (installError) {
      setError(installError)
      return
    }

    try {
      setError('')
      await connect({ connector })
    } catch (err) {
      setError(err?.message || 'Unable to connect to MetaMask Flask.')
    }
  }

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
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleConnect}
        disabled={isPending}
        className="btn btn-primary btn-block"
      >
        {isPending ? 'Connecting…' : 'Connect MetaMask Flask'}
      </button>

      {error && <div className="error-box">{error}</div>}
    </div>
  )
}
