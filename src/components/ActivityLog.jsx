const typeClass = {
  success: 'log-success',
  error: 'log-error',
  agent: 'log-agent',
  info: 'log-info',
}

const typeIcons = {
  success: '✓',
  error: '×',
  agent: '→',
  info: '·',
}

export default function ActivityLog({ logs, agentWorking }) {
  return (
    <aside className="log">
      <div className="log-head">
        <span className="log-title">Activity</span>
        {agentWorking && (
          <span className="log-live">
            <span className="dot pulse" />
            Live
          </span>
        )}
      </div>

      <div className="log-body">
        {logs.length === 0 ? (
          <div className="log-empty">
            <strong>No events yet</strong>
            Complete the steps on the left to start a run.
          </div>
        ) : (
          logs.map((log, i) => (
            <div className="log-row" key={`${log.time}-${i}`}>
              <span className="log-time">{log.time}</span>
              <span className={`log-icon ${typeClass[log.type]}`}>{typeIcons[log.type]}</span>
              <span className={typeClass[log.type]}>{log.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="log-foot">
        <span>{logs.length} events</span>
        <span>1Shot · Base</span>
      </div>
    </aside>
  )
}
