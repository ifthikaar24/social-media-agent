import { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import SmartAccount from './components/SmartAccount'
import GrantPermissions from './components/GrantPermissions'

export default function App() {
  const [smartAccount, setSmartAccount] = useState(null)
  const [permissions, setPermissions] = useState(null)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Social Media Agent 🤖</h1>
        <p className="text-gray-400">AI-powered brand content, running autonomously</p>
      </div>

      {/* Step 1 — Connect Wallet */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Step 1 — Connect Wallet</p>
        <ConnectWallet />
      </div>

      {/* Step 2 — Create Smart Account */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
        <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Step 2 — Create Smart Account</p>
        <SmartAccount onSmartAccount={setSmartAccount} />
      </div>

      {/* Step 3 — Grant Permissions */}
      {smartAccount && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md">
          <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Step 3 — Grant Agent Permissions</p>
          <GrantPermissions onPermissionsGranted={setPermissions} />
        </div>
      )}

      {/* Ready */}
      {permissions && (
        <p className="text-green-400 text-sm">🚀 Agent is ready to generate content</p>
      )}
    </div>
  )
}