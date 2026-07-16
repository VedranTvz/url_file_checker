import { useState } from 'react'

type SignInModalProps = {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin?: () => void
  onSuccess?: (profile: { email: string; phoneNumber: string; name: string }) => void
}

function SignInModal({ isOpen, onClose, onSwitchToLogin, onSuccess }: SignInModalProps) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

if (!isOpen) return null;

   const isValidPhone = (phone: string) => {
      return /^\+?[0-9]{7,15}$/.test(phone);

  }

  const handleSubmit = async (event: any) => {

    event.preventDefault()
    setIsSubmitting(true)

     if(isValidPhone(phoneNumber) === false){
        setErrorMessage("Please enter a valid phone number.")
        setIsSubmitting(false);
        return;
    }

    try{


    console.log("Attempting to sign in with email:", email, "and phone number:", phoneNumber);

    const response= await fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, phone_number: phoneNumber, password})
    })
      const data= await response.json()

      console.log("Sign up response:", data)

      if(!response.ok){
        setErrorMessage(data.error || "Failed to sign in. Please check your credentials.")
        setIsSubmitting(false)
        return
      }

      const profile = {
        email,
        phoneNumber,
        name: email.split('@')[0],
      }

      onSuccess?.(profile)

      console.log("Sign in successful:", data)
      setEmail('')
      setPassword('')
      setPhoneNumber('')
      setErrorMessage('')

    } catch(error){
      setErrorMessage("An error occurred while signing in. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <>
      <button type="button" className="modal-backdrop" onClick={onClose} aria-label="Close sign in modal" />

      <div className="signin-modal-wrap" role="dialog" aria-modal="true" aria-labelledby="signin-title">
        <div className="signin-modal">
          <div className="signin-modal-header">
            <div>
              <div className="signin-eyebrow">Account Access</div>
              <h2 id="signin-title" className="signin-title">Sign in</h2>
            </div>
            <button type="button" className="history-close" onClick={onClose} aria-label="Close sign in modal">
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
              <span className="signin-label">Phone Number</span>
              <input
                type="text"
                className="form-control form-control-dark signin-input"
                placeholder="+385xxxxxxx"
                value={phoneNumber}
                onChange={(event) => {
                    setPhoneNumber(event.target.value);
                }}
                autoComplete="tel"
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
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>

            <p style={{ marginTop: '0.75rem', textAlign: 'center', fontSize: '0.92rem', color: '#cfd6e6' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#7dd3fc',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignInModal
