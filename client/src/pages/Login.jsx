import { useState } from 'react'

export default function Login({ onLogin, goRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')

    const r = await fetch('http://localhost:5001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!r.ok) {
      setError('Invalid credentials')
      return
    }

    const d = await r.json()
    onLogin(d.name)
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={submit}>
        <h2>Welcome back</h2>

        {error && <div className="auth-error">{error}</div>}

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>

        <div className="auth-link" onClick={goRegister}>
          Create account
        </div>
      </form>
    </div>
  )
}
