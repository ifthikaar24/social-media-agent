import test from 'node:test'
import assert from 'node:assert/strict'

import { getMetaMaskFlaskError } from './metamask.js'

test('returns a clear install error when MetaMask Flask is unavailable', () => {
  assert.match(
    getMetaMaskFlaskError(null),
    /MetaMask Flask.*installed/i
  )
})

test('returns null when the wallet provider exists', () => {
  assert.equal(getMetaMaskFlaskError({ isMetaMask: true }), null)
})
