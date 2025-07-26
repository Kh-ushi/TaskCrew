import React, { useState } from 'react'
import './LoginPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    // TODO: hook up your auth logic here
    console.log({ email, password })
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <FontAwesomeIcon icon={faCircleCheck} size="2x" />
          <h2>TaskCrew</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login_btn login_btn--primary">
            Log In
          </button>
        </form>

        <div className="login-card__footer">
          <span>Don’t have an account?</span>
          <button className="btn btn--outline">Sign Up</button>
        </div>
      </div>
    </div>
  )
}
