import { useEffect, useState, type ReactNode } from 'react'
import HistorySidebar, { type HistoryItem } from './HistorySidebar'

type HistoryPanelHelpers = {
  addHistoryItem: (item: HistoryItem) => Promise<void> | void
  openHistory: () => void
}

type UserProfile = {
  email: string
  phoneNumber?: string
  name?: string
}

type HistoryPanelProps = {
  user: UserProfile | null
  children: (helpers: HistoryPanelHelpers) => ReactNode
}

function HistoryPanel({ user, children }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [historyFilter, setHistoryFilter] = useState<'url' | 'file'>('url')

  const addHistoryItem = async (item: HistoryItem) => {
    setHistory((current) => [item, ...current].slice(0, 12))

    if (!user) return

    try {
      const response = await fetch('http://localhost:3000/api/history', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: item.type,
          title: item.title,
          subtitle: item.subtitle,
          status: item.status,
          summary: item.summary,
        }),
      })

      if (!response.ok) {
        console.error('Failed to save history item')
      }
    } catch (error) {
      console.error('History save error:', error)
    }
  }

  const openHistory = () => {
    if (!user) {
      setIsHistoryOpen(false)
      return
    }

    setIsHistoryOpen(true)
  }

  const loadHistory = async () => {
    if (!user) {
      setHistory([])
      return
    }

    try {
      const response = await fetch('http://localhost:3000/api/history', {
        credentials: 'include',
      })

      if (!response.ok) {
        return
      }

      const data = await response.json()
      setHistory(Array.isArray(data.history) ? data.history : [])
    } catch (error) {
      console.error('Failed to load history:', error)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [user])

  const urlHistory = history.filter((item) => item.type === 'url')
  const fileHistory = history.filter((item) => item.type === 'file')
  const filteredHistory = history.filter((item) => item.type === historyFilter)

  return (
    <>
      <HistorySidebar
        fileHistory={fileHistory}
        filteredHistory={filteredHistory}
        historyFilter={historyFilter}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onFilterChange={setHistoryFilter}
        urlHistory={urlHistory}
      />

      {isHistoryOpen && (
        <button
          type="button"
          className="history-backdrop"
          onClick={() => setIsHistoryOpen(false)}
          aria-label="Close analysis history"
        />
      )}

      {children({ addHistoryItem, openHistory })}
    </>
  )
}

export default HistoryPanel
