type HistoryItem = {
  id: string
  type: 'url' | 'file'
  title: string
  subtitle: string
  status: string
  timestamp: string
  summary: string
}

type HistorySidebarProps = {
  fileHistory: HistoryItem[]
  filteredHistory: HistoryItem[]
  historyFilter: 'url' | 'file'
  isOpen: boolean
  onClose: () => void
  onFilterChange: (filter: 'url' | 'file') => void
  urlHistory: HistoryItem[]
}

function HistorySidebar({
  fileHistory,
  filteredHistory,
  historyFilter,
  isOpen,
  onClose,
  onFilterChange,
  urlHistory,
}: HistorySidebarProps) {
  return (
    <aside className={`history-sidebar ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <div className="history-sidebar-header">
        <div>
          <h2 className="history-sidebar-title">History</h2>
        </div>
        <button type="button" className="history-close" onClick={onClose} aria-label="Close history">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="history-sidebar-body">
        <div className="history-filter-tabs">
          <button
            type="button"
            className={`history-filter-tab ${historyFilter === 'url' ? 'active' : ''}`}
            onClick={() => onFilterChange('url')}
          >
            URL
            <span className="history-filter-count">{urlHistory.length}</span>
          </button>
          <button
            type="button"
            className={`history-filter-tab ${historyFilter === 'file' ? 'active' : ''}`}
            onClick={() => onFilterChange('file')}
          >
            File
            <span className="history-filter-count">{fileHistory.length}</span>
          </button>
        </div>

        <section className="history-section">
          <div className="history-section-heading">
            {historyFilter === 'url' ? 'URL Analyses' : 'File Analyses'}
          </div>
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <article key={item.id} className="history-card">
                <div className="history-card-top">
                  <span className={`history-status status-${item.status}`}>{item.status}</span>
                  <span className="history-time">{item.timestamp}</span>
                </div>
                <div className="history-card-title">{item.title}</div>
                <div className="history-card-subtitle">{item.subtitle}</div>
                <div className="history-card-summary">{item.summary}</div>
              </article>
            ))
          ) : (
            <div className="history-empty">
              {historyFilter === 'url' ? 'No URL analyses yet.' : 'No file analyses yet.'}
            </div>
          )}
        </section>
      </div>
    </aside>
  )
}

export type { HistoryItem }
export default HistorySidebar
