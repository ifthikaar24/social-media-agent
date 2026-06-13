import { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import SmartAccount from './components/SmartAccount'
import GrantPermissions from './components/GrantPermissions'
import ContentGenerator from './components/ContentGenerator'

export default function App() {
  const [smartAccount, setSmartAccount] = useState(null)
  const [permissions, setPermissions] = useState(null)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4 py-12 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Social Media Agent 🤖</h1>
        <p className="text-gray-400">AI-powered brand content, running autonomously</p>
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-4">

        {/* Step 1 — Connect Wallet */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Step 1 — Connect Wallet</p>
          <ConnectWallet />
        </div>

        {/* Step 2 — Create Smart Account */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
          <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Step 2 — Create Smart Account</p>
          <SmartAccount onSmartAccount={setSmartAccount} />
        </div>

        {/* Step 3 — Grant Permissions */}
        {smartAccount && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Step 3 — Grant Agent Permissions (ERC-7715)</p>
            <GrantPermissions onPermissionsGranted={setPermissions} />
          </div>
        )}

        {/* Step 4 — Generate Content */}
        {permissions && (
          <ContentGenerator />
        )}

      </div>
    </div>
  )
}