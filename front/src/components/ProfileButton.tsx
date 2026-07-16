import { useState } from 'react'

type UserProfile = {
  email: string
  phoneNumber?: string
  name?: string
}

const getInitials = (user: UserProfile | null) => {
    
  if (!user) return 'U'

  const nameToUse = user.name || user.email
  const words = nameToUse.trim().split(/\s+/)

  if (words.length > 1) {
    return `${words[0][0]}`.toUpperCase()
  }

  return nameToUse.slice(0, 1).toUpperCase()
}

type ProfileButtonProps = {
  user: UserProfile | null
  onSignInClick: () => void
  onLogout: () => void
}

function ProfileButton({ user, onSignInClick, onLogout }: ProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const initials = getInitials(user)

  const handleLogout = () => {
    onLogout()
    setIsOpen(false)
  }

  if (!user) {
    return (
      <button
        type="button"
        className="btn btn-signin d-flex align-items-center gap-2"
        onClick={onSignInClick}
      >
        Sign in
      </button>
    )
  }

  return (
    <div className="profile-button-wrap">
      <button
        type="button"
        className="btn btn-signin profile-button d-flex align-items-center gap-2"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="profile-avatar" aria-hidden="true">{initials}</span>
        <span className="profile-label">Profile</span>
      </button>

      {isOpen && (
        <article className="profile-panel" role="dialog" aria-label="User profile information">
          <div className="profile-panel-top">
            <div className="profile-avatar profile-avatar-large" aria-hidden="true">{initials}</div>
            <div>
              <p className="profile-name">{user.name || 'Signed in user'}</p>
              <p className="profile-status">Signed in</p>
            </div>
          </div>

          <div className="profile-details">
            <div>
              <span className="profile-detail-label">Email</span>
              <strong className="profile-detail-value">{user.email}</strong>
            </div>
            {user.phoneNumber && (
              <div>
                <span className="profile-detail-label">Phone</span>
                <strong className="profile-detail-value">{user.phoneNumber}</strong>
              </div>
            )}
          </div>

          <button type="button" className="profile-logout-button" onClick={handleLogout}>
            Log out
          </button>
        </article>
      )}
    </div>
  )
}

export default ProfileButton
