import { useState, useEffect } from 'react'
import { Box, Link } from '@mui/material'
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
    // Remove hash from URL
    window.history.replaceState(null, '', window.location.pathname)
    // Scroll to top multiple times to override browser default behavior
    window.scrollTo(0, 0)
    setTimeout(() => window.scrollTo(0, 0), 0)
    setTimeout(() => window.scrollTo(0, 0), 100)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show navbar when at the top
      if (currentScrollY < 50) {
        setShowNav(true)
      }
      // Hide navbar when scrolling down
      else if (currentScrollY > lastScrollY) {
        setShowNav(false)
      }
      // Show navbar when scrolling up
      else if (currentScrollY < lastScrollY) {
        setShowNav(true)
      }
      
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
    <div style={{ background: '#05070F', minHeight: '100vh', color: 'white', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav - Glass Buttons Style */}
      <Box 
        sx={{ 
          position: 'sticky', 
          top: 16,
          zIndex: 50,
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
          flexWrap: 'wrap',
          transform: showNav ? 'translateY(0)' : 'translateY(-120px)',
          opacity: showNav ? 1 : 0,
          transition: 'all 0.3s ease-in-out',
          pointerEvents: showNav ? 'auto' : 'none'
        }}
      >
        {/* Logo Glass Button */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.25,
            background: 'rgba(5,7,15,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '12px',
            padding: '8px 16px',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(5,7,15,0.5)',
              border: '1px solid rgba(99,102,241,0.6)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.15)',
            }
          }}
        >
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: 1, 
              background: 'linear-gradient(135deg, #6366F1, #22D3EE)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 16 
            }}
          >
            🤖
          </Box>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em' }}>SocialAgent</span>
        </Box>

        {/* Nav Links - Separate Glass Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Live Demo', href: '#live-demo' },
            { label: 'Tech Stack', href: '#tech-stack' },
          ].map(link => (
            <Link
              key={link.label}
              href={link.href}
              sx={{
                fontSize: 13,
                color: '#9ca3af',
                textDecoration: 'none',
                fontWeight: 500,
                background: 'rgba(5,7,15,0.3)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: '8px',
                padding: '8px 16px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                display: 'block',
                '&:hover': {
                  color: 'white',
                  background: 'rgba(5,7,15,0.5)',
                  border: '1px solid rgba(99,102,241,0.5)',
                  boxShadow: '0 8px 32px rgba(99,102,241,0.15)',
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </Box>

        {/* Status - Glass Button */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            background: 'rgba(5,7,15,0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '8px',
            padding: '8px 16px',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(5,7,15,0.5)',
              border: '1px solid rgba(16,185,129,0.5)',
              boxShadow: '0 8px 32px rgba(16,185,129,0.15)',
            }
          }}
        >
          <Box 
            sx={{ 
              width: 7, 
              height: 7, 
              borderRadius: '50%', 
              background: '#10B981', 
              boxShadow: '0 0 8px #10B981', 
              animation: 'pulse 2s infinite' 
            }}
          />
          <span style={{ fontSize: 12, color: '#6b7280' }}>Sepolia Testnet</span>
        </Box>
      </Box>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 24px 70px', position: 'relative', overflow: 'hidden' }}>

        {/* Background glows */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', top: '30%', left: '30%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          color: '#22D3EE',
          background: 'rgba(34,211,238,0.08)',
          border: '1px solid rgba(34,211,238,0.2)',
          padding: '6px 16px',
          borderRadius: 20,
          marginBottom: 32,
          animation: 'fadeInDown 0.6s ease both'
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22D3EE', animation: 'pulse 1.5s infinite' }}></div>
          MetaMask Smart Accounts × Groq × Tavily × 1Shot
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(42px, 8vw, 80px)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.0,
          marginBottom: 24,
          animation: 'fadeInUp 0.7s ease 0.1s both'
        }}>
          Your Brand.<br />
          <span style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            On Autopilot.
          </span>
        </h1>

        {/* Subtext */}
        <p style={{
          fontSize: 18,
          color: '#9ca3af',
          maxWidth: 500,
          margin: '0 auto 40px',
          lineHeight: 1.7,
          animation: 'fadeInUp 0.7s ease 0.2s both'
        }}>
          One prompt. An AI agent researches real trends, generates on-brand social content, and publishes it — autonomously, every week.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          marginBottom: 48,
          animation: 'fadeInUp 0.7s ease 0.3s both'
        }}>
          <a href="#live-demo" style={{
            padding: '13px 28px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6366F1, #22D3EE)',
            color: 'white',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
            cursor: 'pointer'
          }}>
            Try It Live →
          </a>
          <a href="#how-it-works" style={{
            padding: '13px 28px',
            borderRadius: 12,
            background: 'transparent',
            color: '#9ca3af',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
            border: '1px solid #1f2937',
            cursor: 'pointer'
          }}>
            How It Works
          </a>
        </div>

        {/* Tech tags */}
        <div style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.7s ease 0.4s both'
        }}>
          {['EIP-7702 Smart Accounts', 'ERC-7715 Permissions', 'ERC-7710 Delegation', 'x402 Payments', 'A2A Coordination'].map(tag => (
            <span key={tag} style={{ fontSize: 11, color: '#6b7280', background: '#0D1117', border: '1px solid #1f2937', padding: '4px 12px', borderRadius: 20 }}>{tag}</span>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ borderTop: '1px solid #1a1f2e', borderBottom: '1px solid #1a1f2e', padding: '24px 32px', display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
        {[
          { value: '$0', label: 'Setup cost' },
          { value: 'cents', label: 'Per post generated' },
          { value: '7 days', label: 'Between agent runs' },
          { value: '100%', label: 'Autonomous after setup' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #6366F1, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: 11, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>How It Works</span>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8 }}>Two agents. One goal.</h2>
          <p style={{ color: '#9ca3af', marginTop: 8 }}>Agent A researches and creates. Agent B publishes. Each with exactly the permissions they need — nothing more.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {[
            { icon: '🔗', title: 'Connect & Upgrade', desc: 'Connect MetaMask Flask. Your wallet is instantly upgraded to a Smart Account via EIP-7702 — same address, new superpowers.', tag: 'EIP-7702', color: '#6366F1' },
            { icon: '🔐', title: 'Grant Permissions', desc: 'Set a weekly USDC budget. The agent can only spend what you allow — enforced on-chain via ERC-7715 Advanced Permissions.', tag: 'ERC-7715', color: '#8B5CF6' },
            { icon: '🔍', title: 'Research Trends', desc: 'Agent A fetches real trending topics for your industry via Tavily search — every week, fresh and relevant.', tag: 'Tavily API', color: '#22D3EE' },
            { icon: '✍️', title: 'Generate Content', desc: 'Agent A calls the AI API via x402 micropayments — paying per request in USDC, relayed by 1Shot on Base.', tag: 'x402 + ERC-7710', color: '#F59E0B' },
            { icon: '🤝', title: 'Agent Handoff', desc: 'Agent A redelegates publishing rights to Agent B with scoped permissions — A2A coordination via ERC-7710.', tag: 'A2A + ERC-7710', color: '#10B981' },
            { icon: '📱', title: 'Publish & Sleep', desc: 'Agent B publishes to all platforms via 1Shot Permissionless Relayer on Base. Then sleeps for 7 days.', tag: '1Shot Relayer', color: '#06B6D4' },
          ].map(step => (
            <div key={step.title} style={{ background: '#0D1117', border: '1px solid #1f2937', borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${step.color}, transparent)` }}></div>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{step.icon}</div>
              <div style={{ fontSize: 11, color: step.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{step.tag}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Demo */}
      <section id="live-demo" style={{ background: '#0D1117', borderTop: '1px solid #1a1f2e', borderBottom: '1px solid #1a1f2e', padding: '60px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 11, color: '#22D3EE', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Live Demo</span>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8 }}>Activate Your Agent</h2>
            <p style={{ color: '#9ca3af', marginTop: 8 }}>Follow the steps below. Takes under 2 minutes.</p>
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Left — Steps */}
            <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>

              <StepCard number="01" title="Connect Wallet" color="#6366F1">
                <ConnectWallet onConnected={() => addLog('Wallet connected', 'success')} />
              </StepCard>

              <StepCard number="02" title="Upgrade to Smart Account" color="#8B5CF6" subtitle="EIP-7702">
                <SmartAccount onSmartAccount={(sa) => {
                  setSmartAccount(sa)
                  addLog('Smart Account created (EIP-7702)', 'success')
                  addLog(`Address: ${sa.address.slice(0, 10)}...`, 'info')
                }} />
              </StepCard>

              {smartAccount && (
                <StepCard number="03" title="Grant Agent Permissions" color="#22D3EE" subtitle="ERC-7715">
                  <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12, lineHeight: 1.5 }}>
                    Allow the agent to spend up to 2 USDC/week on your behalf — enforced on-chain, revocable anytime.
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
                <StepCard number="04" title="Connect 1Shot Relayer" color="#F59E0B" subtitle="Base Mainnet">
                  <OneShotRelay
                    onLog={addLog}
                    onReady={() => setRelayerReady(true)}
                  />
                </StepCard>
              )}

              {relayerReady && (
                <StepCard number="05" title="Activate Your Agent" color="#10B981" subtitle="x402 + A2A">
                  <ContentGenerator
                    onLog={addLog}
                    onAgentStart={() => setAgentWorking(true)}
                    onAgentDone={() => setAgentWorking(false)}
                  />
                </StepCard>
              )}

            </div>

            {/* Right — Activity Log */}
            <div style={{ width: 360, flexShrink: 0 }}>
              <ActivityLog logs={logs} agentWorking={agentWorking} />
            </div>

          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section id="tech-stack" style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{ fontSize: 11, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Tech Stack</span>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginTop: 8 }}>Built on the best.</h2>
          <p style={{ color: '#9ca3af', marginTop: 8 }}>Every layer chosen for a reason.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { name: 'MetaMask Smart Accounts Kit', role: 'Smart accounts + delegation', color: '#F59E0B' },
            { name: 'ERC-7715 + ERC-7710', role: 'Permissions + delegation standard', color: '#6366F1' },
            { name: '1Shot Relayer', role: 'Permissionless tx relay on Base', color: '#22D3EE' },
            { name: 'x402 Protocol', role: 'Pay-per-use API payments', color: '#10B981' },
            { name: 'Groq AI', role: 'Fast AI content generation', color: '#8B5CF6' },
            { name: 'Tavily Search', role: 'Real-time trend research', color: '#06B6D4' },
          ].map(tech => (
            <div key={tech.name} style={{ background: '#0D1117', border: '1px solid #1f2937', borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${tech.color}, transparent)` }}></div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 4 }}>{tech.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{tech.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 32px', textAlign: 'center', borderTop: '1px solid #1a1f2e' }}>
        <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 8 }}>
          Built for MetaMask Smart Accounts × 1Shot API Hackathon
        </div>
        <div style={{ fontSize: 12, color: '#374151' }}>
          MetaMask Smart Accounts Kit · Groq AI · Tavily · 1Shot Permissionless Relayer
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #05070F; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #05070F; }
        ::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 3px; }
      `}</style>
    </div>
  )
}

function StepCard({ number, title, subtitle, color, children }) {
  return (
    <div style={{ background: '#05070F', border: '1px solid #1f2937', borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontFamily: 'monospace', color, fontWeight: 800 }}>{number}</span>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{title}</h3>
        {subtitle && (
          <span style={{ fontSize: 10, color, background: `${color}15`, border: `1px solid ${color}30`, padding: '2px 8px', borderRadius: 20, marginLeft: 'auto' }}>{subtitle}</span>
        )}
      </div>
      {children}
    </div>
  )
}