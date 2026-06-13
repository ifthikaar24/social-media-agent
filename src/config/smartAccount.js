import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { sepolia } from 'viem/chains'
import {
  Implementation,
  toMetaMaskSmartAccount,
} from '@metamask/smart-accounts-kit'

export async function createSmartAccount(address) {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http('https://ethereum-sepolia-rpc.publicnode.com'),
  })

  const walletClient = createWalletClient({
    account: address,
    chain: sepolia,
    transport: custom(window.ethereum),
  })

  const smartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [address, [], [], []],
    deploySalt: '0x',
    signer: { walletClient },
  })

  return smartAccount
}