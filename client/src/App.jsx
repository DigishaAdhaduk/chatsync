import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('login')

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(u)
  }, [])

  function handleLogin(name) {
    localStorage.setItem('user', name)
    setUser(name)
  }

  function logout() {
    localStorage.removeItem('user')
    setUser(null)
    setPage('login')
  }

  if (!user) {
    return page === 'login'
      ? <Login onLogin={handleLogin} goRegister={() => setPage('register')} />
      : <Register onRegister={handleLogin} goLogin={() => setPage('login')} />
  }

  return <Chat user={user} onLogout={logout} />
}
