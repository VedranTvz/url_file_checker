import { useState, type ChangeEvent, type DragEvent } from 'react'
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

type FileCheckerProps = {
  onAnalysisComplete: (item: HistoryItem) => void
}

function FileChecker({ onAnalysisComplete }: FileCheckerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<{ summary: ScanSummary } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleFileUpload = async () => {

    if (!selectedFile) return

    const formData = new FormData()
    formData.append('file', selectedFile)
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/file/hash`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error uploading file')
      } else {
        setResult(data)
        onAnalysisComplete({
          id: `file-${selectedFile.name}-${Date.now()}`,
          type: 'file',
          title: selectedFile.name,
          subtitle: data.summary.verdict,
          status: data.summary.verdict,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          summary: data.summary.headline,
        })
      }
    } catch (error) {
      setError(String(error))
      console.error('Error uploading file:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-panel w-100">
      <div className="search-card p-4 d-flex flex-column gap-4">
        <div className="text-secondary small text-uppercase letter-spacing-2">File Scan</div>
        <div
          className="upload-card d-flex flex-column align-items-center justify-content-center gap-3 px-4 py-5 text-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="upload-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.686 2 6 4.686 6 8c0 .33.028.654.082.972C4.63 9.456 3.5 10.99 3.5 12.75 3.5 14.88 5.37 16.75 7.5 16.75H10v-2.5H7.5c-1.24 0-2.25-1.01-2.25-2.25 0-1.24 1.01-2.25 2.25-2.25h1.22l-1.58 1.58 1.06 1.06L12 7.06l3.8 3.8 1.06-1.06L13.28 9.75H14.5c1.24 0 2.25 1.01 2.25 2.25 0 1.24-1.01 2.25-2.25 2.25H14v2.5h2.5c2.13 0 4-1.87 4-4.25 0-1.76-1.13-3.3-2.58-3.78A5.97 5.97 0 0 0 18 8c0-3.314-2.686-6-6-6z" />
            </svg>
          </div>
          <div className="upload-text text-white">Drag & drop your file here, or browse files</div>
          <label htmlFor="file-upload" className="upload-label">
            Browse files
          </label>
          <input id="file-upload" type="file" className="hidden-file-input" onChange={handleFileChange} />
          <div className="upload-filename text-secondary">
            {selectedFile ? selectedFile.name : 'No file selected'}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-search d-flex align-items-center justify-content-center gap-2"
          onClick={handleFileUpload}
          disabled={!selectedFile || loading}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              <span>Scanning</span>
            </>
          ) : (
            'Upload file'
          )}
        </button>
        {error && <div className="text-danger mt-2">{error}</div>}
      </div>

      {loading && (
        <div className="results-section mt-4 d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="d-flex flex-column align-items-center gap-3">
            <span className="spinner" aria-hidden="true" style={{ width: '48px', height: '48px' }} />
            <span className="text-secondary">Analyzing file, please wait...</span>
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

export default FileChecker
