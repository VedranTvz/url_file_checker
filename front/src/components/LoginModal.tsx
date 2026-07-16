import { useState } from 'react'

type LogInModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (profile: { email: string; name: string }) => void
}

function LogInModal({ isOpen, onClose, onSuccess }: LogInModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (event: any) => {

    event.preventDefault()
    setIsSubmitting(true)

    if(!email || !password){
      setErrorMessage("Please enter both email and password.")
      setIsSubmitting(false)
      return;
    }

    try{

    const response= await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password})
    })
      const data= await response.json()

      if(!response.ok){
        setErrorMessage(data.error || "Failed to log in. Please re-enter your password.")
        setIsSubmitting(false)
        return
      }

      const profile = {
        email,
        name: email.split('@')[0],
      }

      onSuccess?.(profile)

      console.log("Login successful:", data)
      setEmail('')
      setPassword('')
      setErrorMessage('')

    } catch(error){
      setErrorMessage("An error occurred while logging in. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close log in modal" />

      <div className="signin-modal-wrap" role="dialog" aria-modal="true" aria-labelledby="signin-title">
        <div className="signin-modal">
          <div className="signin-modal-header">
            <div>
              <div className="signin-eyebrow">Account Access</div>
              <h2 id="signin-title" className="signin-title">Log in</h2>
            </div>
            <button type="button" className="history-close" onClick={onClose} aria-label="Close log in modal">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <form className="signin-form" onSubmit={handleSubmit}>

            <label className="signin-field">
              <span className="signin-label">Email</span>
              <input
                type="email"
                className="form-control form-control-dark signin-input"
                placeholder="example@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
              />
            </label>


            <label className="signin-field">
              <span className="signin-label">Password</span>
              <input
                type="password"
                className="form-control form-control-dark signin-input"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>

            {errorMessage && <div className="signin-error">{errorMessage}</div>}

            <button type="submit" className="btn btn-search signin-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default LogInModal
