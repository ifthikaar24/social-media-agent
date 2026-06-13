import { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import SmartAccount from './components/SmartAccount'

export default function App() {
  const [smartAccount, setSmartAccount] = useState(null)

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Social Media Agent 🤖</h1>
        <p className="text-gray-400">AI-powered brand content, running autonomously</p>
      </div>
      <ConnectWallet />
      <SmartAccount onSmartAccount={setSmartAccount} />
      {smartAccount && (
        <p className="text-green-400 text-sm">Smart account ready ✅</p>
      )}
    </div>
  )
}