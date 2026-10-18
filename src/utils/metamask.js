export function getMetaMaskFlaskError(provider) {
  const hasProvider = !!provider

  if (!hasProvider) {
    return 'MetaMask Flask is not installed. Please install the MetaMask Flask extension and try again.'
  }

  return null
}
