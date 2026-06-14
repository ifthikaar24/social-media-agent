const RELAYER_URL = 'https://relayer.1shotapi.com/relayers'

// Use Base (8453) — 1Shot doesn't support Sepolia testnet
const CHAIN_ID = '8453'

export async function getRelayerCapabilities() {
  const response = await fetch(RELAYER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'relayer_getCapabilities',
      params: [CHAIN_ID],
    }),
  })
  const data = await response.json()
  return data.result
}

export async function getRelayerFeeData(tokenAddress) {
  const response = await fetch(RELAYER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'relayer_getFeeData',
      params: { chainId: CHAIN_ID, token: tokenAddress },
    }),
  })
  const data = await response.json()
  return data.result
}

export async function getRelayerStatus(taskId) {
  const response = await fetch(RELAYER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'relayer_getStatus',
      params: { taskId },
    }),
  })
  const data = await response.json()
  return data.result
}

export async function pollRelayerStatus(taskId, onStatusUpdate) {
  const terminalStates = ['Confirmed', 'Rejected', 'Reverted']
  while (true) {
    const status = await getRelayerStatus(taskId)
    onStatusUpdate(status)
    if (terminalStates.includes(status?.status)) return status
    await new Promise(r => setTimeout(r, 2500))
  }
}