import { useState, type ChangeEvent } from 'react'
const API_URL=import.meta.env.VITE_API_PROD;

type ScanSummary = {
  verdict: string
  headline: string
  explanation: string
  recommendation: string
}

type HistoryItem = {
  id: string
  type: 'url' | 'file'
  title: string
  subtitle: string
  status: string
  timestamp: string
  summary: string
}

type URLCheckerProps = {
  onAnalysisComplete: (item: HistoryItem) => void
}

function URLChecker({ onAnalysisComplete }: URLCheckerProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{ summary: ScanSummary } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sendURL = async (url: string) => {
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/check/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error checking URL')
      } else {
        setResult(data)
        onAnalysisComplete({
          id: `url-${Date.now()}`,
          type: 'url',
          title: url,
          subtitle: data.summary.verdict,
          status: data.summary.verdict,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          summary: data.summary.headline,
        })
      }
    } catch (error) {
      setError(String(error))
    } finally {
      setLoading(false)
    }
  }


  const handleSearch = () => {
    if (!input.trim()) {
      return
    }
    sendURL(input)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  return (

    <div className="search-panel w-100">
      <div className="search-card p-4 d-flex flex-column gap-3">
        <div className="text-secondary small text-uppercase letter-spacing-2">URL Scan</div>
        <div className="search-group d-flex gap-2 flex-wrap">
          <input
            type="url"
            className="form-control form-control-dark search-input"
            placeholder="Enter URL to inspect"
            value={input}
            onChange={handleInputChange}
          />
          <button type="button" className="btn btn-search d-flex align-items-center justify-content-center gap-2" onClick={handleSearch} disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                <span>Scanning</span>
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>
      
          {loading && (
      <div className="results-section mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="d-flex flex-column align-items-center gap-3">
          <span className="spinner" aria-hidden="true" style={{ width: '48px', height: '48px' }} />
          <span className="text-secondary">Analyzing URL, please wait...</span>
        </div>
      </div>
    )}

    {result && !loading && (
      <div className="results-section mt-4">
        <div className="results-header mb-3">
          <h3 className="results-title">Scan Results</h3>
        </div>

        <div className="results-card">
          <div className="result-item">
            <span className="result-label">Verdict</span>
            <span className={`result-value status-badge status-${result.summary.verdict}`}>
              {result.summary.verdict}
            </span>
          </div>

          <div className="result-item">
            <span className="result-label">Summary</span>
            <span className="result-value">{result.summary.headline}</span>
          </div>

          <div className="result-item">
            <span className="result-label">Details</span>
            <span className="result-value">{result.summary.explanation}</span>
          </div>

          <div className="result-item">
            <span className="result-label">Recommendation</span>
            <span className="result-value">{result.summary.recommendation}</span>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

export default URLChecker
