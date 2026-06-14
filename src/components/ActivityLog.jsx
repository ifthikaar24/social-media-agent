import { useEffect, useRef } from 'react'

const typeStyles = {
  success: { color: '#10B981' },
  error: { color: '#F87171' },
  agent: { color: '#22D3EE' },
  info: { color: '#6b7280' },
}

const typeIcons = {
  success: '✓',
  error: '✗',
  agent: '⟳',
  info: '·',
}

export default function ActivityLog({ logs, agentWorking }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div style={{ background: '#05070F', border: '1px solid #1f2937', borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 80 }}>

      {/* Terminal Header */}
      <div style={{ background: '#0D1117', borderBottom: '1px solid #1f2937', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F87171' }}></div>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }}></div>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10B981' }}></div>
        </div>
        <span style={{ fontSize: 11, color: '#4b5563', fontFamily: 'monospace', margin: '0 auto' }}>agent.log</span>
        {agentWorking && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22D3EE', boxShadow: '0 0 8px #22D3EE', animation: 'pulse 1s infinite' }}></div>
            <span style={{ fontSize: 10, color: '#22D3EE' }}>ACTIVE</span>
          </div>
        )}
      </div>

      {/* Log Content */}
      <div style={{ padding: 16, fontFamily: 'monospace', fontSize: 11, height: 480, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {logs.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: '#374151' }}>
            <div style={{ fontSize: 32 }}>⬡</div>
            <span style={{ fontSize: 12 }}>Waiting for agent activity...</span>
            <span style={{ fontSize: 11, color: '#1f2937' }}>Complete the steps on the left to begin</span>
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#374151', flexShrink: 0 }}>{log.time}</span>
              <span style={{ ...typeStyles[log.type], flexShrink: 0 }}>{typeIcons[log.type]}</span>
              <span style={typeStyles[log.type]}>{log.message}</span>
            </div>
          ))
        )}
        {logs.length > 0 && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: '#374151' }}>{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
            <span style={{ color: '#6366F1', animation: 'blink 1s infinite' }}>▋</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #1f2937', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#374151', fontFamily: 'monospace' }}>{logs.length} events</span>
        <span style={{ fontSize: 10, color: '#374151', fontFamily: 'monospace' }}>1Shot Relayer · Base</span>
      </div>
    </div>
  )
}