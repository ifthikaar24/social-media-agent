import { useEffect, useRef } from 'react'

const typeStyles = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  agent: 'text-cyan-400',
  info: 'text-gray-400',
}

const typeIcons = {
  success: '✓',
  error: '✗',
  agent: '⟳',
  info: '·',
}

export default function ActivityLog({ logs }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="rounded-2xl border border-gray-800 overflow-hidden sticky top-6" style={{ background: '#0D1117' }}>

      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800" style={{ background: '#080B14' }}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/70"></div>
        </div>
        <span className="text-xs text-gray-500 font-mono mx-auto">agent.log</span>
      </div>

      {/* Log Content */}
      <div className="p-4 font-mono text-xs h-96 lg:h-[600px] overflow-y-auto flex flex-col gap-2">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-600">
            <span className="text-2xl">⬡</span>
            <span>Waiting for agent activity...</span>
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-gray-600 shrink-0">{log.time}</span>
              <span className={`shrink-0 ${typeStyles[log.type]}`}>
                {typeIcons[log.type]}
              </span>
              <span className={typeStyles[log.type]}>{log.message}</span>
            </div>
          ))
        )}
        {/* Blinking cursor */}
        {logs.length > 0 && (
          <div className="flex gap-2 items-center">
            <span className="text-gray-600">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
            <span className="text-indigo-400 animate-pulse">▋</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}