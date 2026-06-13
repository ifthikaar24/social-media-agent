import { useState } from 'react'
import { createWalletClient, createPublicClient, custom, http, parseUnits } from 'viem'
import { sepolia } from 'viem/chains'
import { erc7715ProviderActions } from '@metamask/smart-accounts-kit/actions'
import {
  Implementation,
  toMetaMaskSmartAccount,
} from '@metamask/smart-accounts-kit'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

export default function GrantPermissions({ onPermissionsGranted }) {
  const [loading, setLoading] = useState(false)
  const [granted, setGranted] = useState(false)
  const [error, setError] = useState(null)

  async function handleGrantPermissions() {
    try {
      setLoading(true)
      setError(null)

      // Step 1 — wallet client extended with ERC-7715 actions
      const walletClient = createWalletClient({
        transport: custom(window.ethereum),
      }).extend(erc7715ProviderActions())

      // Step 2 — create session account (this is the agent's account)
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
      })

      const privateKey = generatePrivateKey()
      const sessionKey = privateKeyToAccount(privateKey)

      const sessionAccount = await toMetaMaskSmartAccount({
        client: publicClient,
        implementation: Implementation.Hybrid,
        deployParams: [sessionKey.address, [], [], []],
        deploySalt: '0x',
        signatory: { account: sessionKey },
      })

      // Step 3 — request permissions from user via ERC-7715
      const currentTime = Math.floor(Date.now() / 1000)
      const expiry = currentTime + 604800 // 1 week

      const grantedPermissions = await walletClient.requestExecutionPermissions([{
        chainId: sepolia.id,
        expiry,
        to: sessionAccount.address,
        permission: {
          type: 'erc20-token-periodic',
          data: {
            tokenAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDC on Sepolia
            periodAmount: parseUnits('2', 6), // 2 USDC per week
            periodDuration: 604800, // 1 week in seconds
            justification: 'Social Media Agent — weekly content generation budget',
          },
          isAdjustmentAllowed: true,
        },
      }])

      setGranted(true)
      onPermissionsGranted({
        grantedPermissions,
        sessionAccount,
        sessionPrivateKey: privateKey,
      })

    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      {!granted ? (
        <button
          onClick={handleGrantPermissions}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          {loading ? 'Requesting Permissions...' : 'Grant Agent Permissions'}
        </button>
      ) : (
        <div className="bg-blue-900 border border-blue-500 rounded-lg px-4 py-2 text-blue-300 text-sm">
          ✅ Permissions Granted — Agent is ready
        </div>
      )}
      {error && (
        <p className="text-red-400 text-xs max-w-sm text-center">{error}</p>
      )}
    </div>
  )
}