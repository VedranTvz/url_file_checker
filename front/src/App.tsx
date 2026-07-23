import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import FileChecker from './components/FileChecker'
import HistoryPanel from './components/HistoryPanel'
import LogInModal from './components/LoginModal'
import ProfileButton from './components/ProfileButton'
import SignInModal from './components/SignInModal'
import URLChecker from './components/URLChecker'
const API_URL=import.meta.env.VITE_API_PROD

type UserProfile = {
  email: string
  phoneNumber?: string
  name?: string
}

const STORAGE_KEY = 'file_checker_user'

const readStoredProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch {
    return null
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<'url' | 'provider'>('url')
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(() => readStoredProfile())

  const closeAuthModals = () => {
    setIsSignInOpen(false)
    setIsLoginOpen(false)
  }

  const openSignInModal = () => {
    setIsLoginOpen(false)
    setIsSignInOpen(true)
  }

  const openLoginModal = () => {
    setIsSignInOpen(false)
    setIsLoginOpen(true)
  }

  const saveUser = (profile: UserProfile) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    }

    setUser(profile)
  }

  const clearUser = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    }

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }

    setUser(null)
  }

  return (
    <div className="App d-flex flex-column min-vh-100">
      <SignInModal
        isOpen={isSignInOpen}
        onClose={closeAuthModals}
        onSwitchToLogin={openLoginModal}
        onSuccess={(profile) => {
          saveUser(profile)
          closeAuthModals()
        }}
      />
      <LogInModal
        isOpen={isLoginOpen}
        onClose={closeAuthModals}
        onSuccess={(profile) => {
          saveUser(profile)
          closeAuthModals()
        }}
      />

      <HistoryPanel user={user}>
        {({ addHistoryItem, openHistory }) => (
          <>
            <div className="tabs-row d-flex align-items-start justify-content-between py-4 px-4">
              <div className="brand-label text-white fw-bold">File_checker</div>

              <div className="tabs-group d-flex justify-content-center">
                <button
                  type="button"
                  className={`btn btn-tab ${activeTab === 'url' ? 'active' : ''}`}
                  onClick={() => setActiveTab('url')}
                >
                  URL Scan
                </button>
                <button
                  type="button"
                  className={`btn btn-tab ${activeTab === 'provider' ? 'active' : ''}`}
                  onClick={() => setActiveTab('provider')}
                >
                  File Scan
                </button>
              </div>

              <ProfileButton
                user={user}
                onSignInClick={openSignInModal}
                onLogout={clearUser}
              />
            </div>

            <div className="history-row px-4 pt-3">
              <button
                type="button"
                className="history-toggle"
                onClick={user ? openHistory : undefined}
                disabled={!user}
                aria-label={user ? 'Open analysis history' : 'Sign in to view history'}
                title={user ? 'Open analysis history' : 'Sign in to view history'}
              >
                <span className="history-toggle-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L14.75 14.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.93 4.93A10 10 0 1 1 2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 4V9H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="history-toggle-label">History</span>
              </button>
            </div>

            <div className="content d-flex align-items-start justify-content-center px-4 pt-4 pb-5">
              {activeTab === 'url' ? (
                <URLChecker onAnalysisComplete={addHistoryItem} />
              ) : (
                <FileChecker onAnalysisComplete={addHistoryItem} />
              )}
            </div>
          </>
        )}
      </HistoryPanel>
    </div>
  )
}

export default App
