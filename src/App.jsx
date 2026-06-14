import { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import SmartAccount from './components/SmartAccount'
import GrantPermissions from './components/GrantPermissions'
import ContentGenerator from './components/ContentGenerator'
import ActivityLog from './components/ActivityLog'
import OneShotRelay from './components/OneShotRelay'

export default function App() {
  const [smartAccount, setSmartAccount] = useState(null)
  const [permissions, setPermissions] = useState(null)
  const [relayerReady, setRelayerReady] = useState(false)
  const [logs, setLogs] = useState([])

  function addLog(message, type = 'info') {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false })
    setLogs(prev => [...prev, { message, type, time }])
  }

  return (
    <div className="min-h-screen text-white" style={{ background: '#080B14', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div className="border-b border-indigo-900/40 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-sm">🤖</div>
          <span className="font-bold text-lg tracking-tight">SocialAgent</span>
          <span className="text-xs text-indigo-400 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded-full">Beta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs text-gray-400">Sepolia Testnet</span>
        </div>
      </div>

      {/* Hero */}
      <div className="text-center pt-12 pb-8 px-4">
        <div className="inline-block text-xs text-cyan-400 bg-cyan-950/50 border border-cyan-800/50 px-3 py-1 rounded-full mb-4">
          Powered by MetaMask Smart Accounts × Venice AI × 1Shot
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-3" style={{ letterSpacing: '-0.03em' }}>
          Your Brand.{' '}
          <span style={{ background: 'linear-gradient(135deg, #6366F1, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            On Autopilot.
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          One prompt. An AI agent generates and publishes your social content — autonomously, every week.
        </p>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-6 pb-16 flex flex-col lg:flex-row gap-6">

        {/* Left — Steps */}
        <div className="flex-1 flex flex-col gap-4">

          <StepCard number="01" title="Connect Wallet">
            <ConnectWallet onConnected={() => addLog('Wallet connected successfully', 'success')} />
          </StepCard>

          <StepCard number="02" title="Upgrade to Smart Account (EIP-7702)">
            <SmartAccount onSmartAccount={(sa) => {
              setSmartAccount(sa)
              addLog('Smart Account created via EIP-7702', 'success')
              addLog(`Account: ${sa.address.slice(0, 10)}...`, 'info')
            }} />
          </StepCard>

          {smartAccount && (
            <StepCard number="03" title="Grant Agent Permissions (ERC-7715)">
              <p className="text-gray-400 text-xs mb-3">
                Allow the agent to spend up to 2 USDC/week on your behalf.
              </p>
              <GrantPermissions onPermissionsGranted={(p) => {
                setPermissions(p)
                addLog('ERC-7715 permissions granted by user', 'success')
                addLog('Agent A delegating to Agent B via ERC-7710...', 'agent')
                setTimeout(() => addLog('Redelegation complete — Agent B active', 'success'), 1000)
              }} />
            </StepCard>
          )}

          {permissions && (
            <StepCard number="04" title="Connect 1Shot Permissionless Relayer">
              <OneShotRelay
                onLog={addLog}
                onReady={() => setRelayerReady(true)}
              />
            </StepCard>
          )}

          {relayerReady && (
            <StepCard number="05" title="Generate Your Brand Content">
              <ContentGenerator onLog={addLog} />
            </StepCard>
          )}

        </div>

        {/* Right — Activity Log */}
        <div className="lg:w-80 xl:w-96">
          <ActivityLog logs={logs} />
        </div>

      </div>
    </div>
  )
}

function StepCard({ number, title, children }) {
  return (
    <div className="rounded-2xl border border-gray-800 p-6" style={{ background: '#0D1117' }}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono text-indigo-400 font-bold">{number}</span>
        <h2 className="font-semibold text-white text-sm">{title}</h2>
      </div>
      {children}
    </div>
  )
}