import { useState, useEffect } from 'react'
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
  const [agentWorking, setAgentWorking] = useState(false)
  const [showNav, setShowNav] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname)
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 50) setShowNav(true)
      else if (currentScrollY > lastScrollY) setShowNav(false)
      else setShowNav(true)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  function addLog(message, type = 'info') {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false })
    setLogs(prev => [...prev, { message, type, time }])
  }

  return (
    <div className="app">
      <header className={`nav ${showNav ? '' : 'is-hidden'}`}>
        <a className="brand" href="#">
          <span className="brand-mark">S</span>
          <span className="brand-name">SocialAgent</span>
        </a>
        <nav className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#live-demo">Live demo</a>
          <a href="#tech-stack">Stack</a>
        </nav>
        <div className="nav-status">
          <span className="dot pulse" />
          Sepolia testnet
        </div>
      </header>

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow">MetaMask · Groq · Tavily · 1Shot</div>
            <h1>
              Your brand,<br />
              <em>on a weekly clock.</em>
            </h1>
            <p className="lede">
              One prompt. An agent researches live trends, writes on-brand posts, and publishes them — without another social manager on retainer.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#live-demo">Try the live demo</a>
              <a className="btn btn-secondary" href="#how-it-works">See the workflow</a>
            </div>
            <div className="chips">
              {['EIP-7702 smart accounts', 'ERC-7715 permissions', 'ERC-7710 delegation', 'x402 payments', 'A2A coordination'].map(tag => (
                <span className="chip" key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          <aside className="preview-card" aria-hidden="true">
            <div className="preview-top">
              <span className="preview-kicker">This week’s run</span>
              <span className="preview-badge">Scheduled</span>
            </div>
            <div className="preview-body">
              {[
                ['01', 'Research', 'Tavily pulls industry trends before any copy is written.'],
                ['02', 'Write', 'Groq drafts a tagline and three captions, paid per call.'],
                ['03', 'Handoff', 'Agent A redelegates a scoped budget to Agent B.'],
                ['04', 'Publish', 'Posts go out. The agent sleeps for seven days.'],
              ].map(([n, title, copy]) => (
                <div className="preview-row" key={n}>
                  <span className="preview-index">{n}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="stats">
        <div className="wrap stats-grid">
          {[
            { value: '$0', label: 'Setup cost' },
            { value: 'cents', label: 'Per generated post' },
            { value: '7 days', label: 'Between agent runs' },
            { value: '100%', label: 'Autonomous after setup' },
          ].map(stat => (
            <div className="stat" key={stat.label}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="section-label">How it works</span>
            <h2>Two agents. One weekly job.</h2>
            <p>Agent A researches and writes. Agent B publishes. Each holds only the permissions it needs.</p>
          </div>
          <div className="steps-grid">
            {[
              { tag: 'EIP-7702', title: 'Connect & upgrade', desc: 'Connect MetaMask Flask. Your wallet becomes a smart account at the same address.' },
              { tag: 'ERC-7715', title: 'Grant permissions', desc: 'Set a weekly USDC budget. Spend limits are enforced on-chain and can be revoked.' },
              { tag: 'Tavily', title: 'Research trends', desc: 'Agent A fetches live topics for your industry so the copy stays current.' },
              { tag: 'x402', title: 'Generate content', desc: 'AI calls are paid per request in USDC — no monthly generation subscription.' },
              { tag: 'A2A', title: 'Agent handoff', desc: 'Publishing rights move to Agent B with a narrower, scoped budget.' },
              { tag: '1Shot', title: 'Publish & sleep', desc: 'Posts go out through the relayer. Then the agent waits seven days.' },
            ].map(step => (
              <article className="card" key={step.title}>
                <div className="card-tag">{step.tag}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="live-demo" className="demo">
        <div className="wrap section">
          <div className="center-head">
            <span className="section-label">Live demo</span>
            <h2>Activate your agent</h2>
            <p>Five steps. Under two minutes if Flask is already on Sepolia.</p>
          </div>
          <div className="demo-layout">
            <div className="step-stack">
              <StepCard number="01" title="Connect wallet">
                <ConnectWallet onConnected={() => addLog('Wallet connected', 'success')} />
              </StepCard>

              <StepCard number="02" title="Upgrade to smart account" subtitle="EIP-7702">
                <SmartAccount onSmartAccount={(sa) => {
                  setSmartAccount(sa)
                  addLog('Smart Account created (EIP-7702)', 'success')
                  addLog(`Address: ${sa.address.slice(0, 10)}...`, 'info')
                }} />
              </StepCard>

              {smartAccount && (
                <StepCard number="03" title="Grant agent permissions" subtitle="ERC-7715">
                  <p className="hint">
                    Allow the agent to spend up to 2 USDC/week — enforced on-chain, revocable anytime.
                  </p>
                  <GrantPermissions onPermissionsGranted={(p) => {
                    setPermissions(p)
                    addLog('ERC-7715 permissions granted', 'success')
                    addLog('Agent A delegating to Agent B...', 'agent')
                    setTimeout(() => addLog('Redelegation complete (ERC-7710)', 'success'), 1000)
                  }} />
                </StepCard>
              )}

              {permissions && (
                <StepCard number="04" title="Connect 1Shot relayer" subtitle="Base">
                  <OneShotRelay
                    onLog={addLog}
                    onReady={() => setRelayerReady(true)}
                  />
                </StepCard>
              )}

              {relayerReady && (
                <StepCard number="05" title="Activate your agent" subtitle="x402 + A2A">
                  <ContentGenerator
                    onLog={addLog}
                    onAgentStart={() => setAgentWorking(true)}
                    onAgentDone={() => setAgentWorking(false)}
                  />
                </StepCard>
              )}
            </div>

            <ActivityLog logs={logs} agentWorking={agentWorking} />
          </div>
        </div>
      </section>

      <section id="tech-stack" className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="section-label">Stack</span>
            <h2>The pieces underneath.</h2>
            <p>Wallet permissions, micropayments, research, and generation — each doing one job.</p>
          </div>
          <div className="tech-grid">
            {[
              { name: 'MetaMask Smart Accounts Kit', role: 'Smart accounts and delegation' },
              { name: 'ERC-7715 + ERC-7710', role: 'Permissions and A2A handoff' },
              { name: '1Shot Relayer', role: 'Permissionless relay on Base' },
              { name: 'x402 Protocol', role: 'Pay-per-use API payments' },
              { name: 'Groq AI', role: 'Fast content generation' },
              { name: 'Tavily Search', role: 'Live trend research' },
            ].map(tech => (
              <article className="card" key={tech.name}>
                <div className="tech-name">{tech.name}</div>
                <div className="tech-role">{tech.role}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <p>Built for the MetaMask Smart Accounts × 1Shot API Hackathon</p>
          <p>MetaMask Kit · Groq · Tavily · 1Shot Relayer</p>
        </div>
      </footer>
    </div>
  )
}

function StepCard({ number, title, subtitle, children }) {
  return (
    <div className="step-card">
      <div className="step-card-head">
        <span className="step-num">{number}</span>
        <h3>{title}</h3>
        {subtitle && <span className="step-sub">{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}
