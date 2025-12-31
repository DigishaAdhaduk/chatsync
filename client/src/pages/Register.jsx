import { useState } from 'react'

export default function Register({ onRegister, goLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')

    const r = await fetch('http://localhost:5001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    if (!r.ok) {
      setError('User already exists')
      return
    }

    onRegister(name)
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={submit}>
        <h2>Create account</h2>

        {error && <div className="auth-error">{error}</div>}

        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />

        <button type="submit">Register</button>

        <div className="auth-link" onClick={goLogin}>
          Back to login
        </div>
      </form>
    </div>
  )
}
