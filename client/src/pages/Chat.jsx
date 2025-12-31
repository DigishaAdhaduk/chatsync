import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:5001')

export default function Chat({ user, onLogout }) {
  const [rooms, setRooms] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)

  const [menuRoom, setMenuRoom] = useState(null)
  const [modal, setModal] = useState(null)
  const [input, setInput] = useState('')
  const [groupLoading, setGroupLoading] = useState(false)

  const bottomRef = useRef(null)

  useEffect(() => {
    fetch('http://localhost:5001/rooms')
      .then(r => r.json())
      .then(data => {
        setRooms(data)
        if (data.length) setCurrentRoom(data[0].name)
      })
  }, [])


  useEffect(() => {
    if (!currentRoom) return

    fetch(`http://localhost:5001/messages/${currentRoom}`)
      .then(r => r.json())
      .then(setMessages)

    socket.emit('join', currentRoom)

    socket.off('message')
    socket.on('message', m => {
      setMessages(prev => [...prev, m])
    })
  }, [currentRoom])


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])


  async function send() {
    if (!file && !text.trim()) return

    let fileUrl = ''

    if (file) {
      const fd = new FormData()
      fd.append('file', file)
      const r = await fetch('http://localhost:5001/upload', {
        method: 'POST',
        body: fd
      })
      fileUrl = (await r.json()).url
    }

    socket.emit('message', {
      user,
      room: currentRoom,
      text: text.trim(),
      file: fileUrl
    })

    setText('')
    setFile(null)
  }


  async function createGroup() {
    if (!input.trim()) return
    setGroupLoading(true)

    const r = await fetch('http://localhost:5001/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: input })
    })

    const room = await r.json()
    setRooms(prev => [...prev, room])
    setCurrentRoom(room.name)
    setInput('')
    setModal(null)
    setGroupLoading(false)
  }

  async function joinGroup() {
    if (!input.trim()) return
    setGroupLoading(true)

    const r = await fetch('http://localhost:5001/rooms/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: input })
    })

    if (r.ok) {
      const room = await r.json()
      if (!rooms.find(x => x.name === room.name)) {
        setRooms(prev => [...prev, room])
      }
      setCurrentRoom(room.name)
    }

    setInput('')
    setModal(null)
    setGroupLoading(false)
  }

  function leaveGroup(name) {
    setRooms(prev => prev.filter(r => r.name !== name))
    setCurrentRoom(null)
    setMessages([])
    setModal(null)
  }

  async function deleteGroup(name) {
    await fetch(`http://localhost:5001/rooms/${name}`, { method: 'DELETE' })
    setRooms(prev => prev.filter(r => r.name !== name))
    setCurrentRoom(null)
    setMessages([])
    setModal(null)
  }


  return (
    <div className="layout">
      <div className="sidebar">
        <h3>ChatSync</h3>

        {rooms.length === 0 && (
          <p style={{ opacity: 0.6, fontSize: '14px' }}>
            No groups yet. Create or join one.
          </p>
        )}

        {rooms.map(r => (
          <div
            key={r.code}
            className={`room ${r.name === currentRoom ? 'active' : ''}`}
            onClick={() => {
              setCurrentRoom(r.name)
              setMenuRoom(null)
            }}
          >
            <span>#{r.name}</span>

            <span
              className="room-menu"
              onClick={e => {
                e.stopPropagation()
                setMenuRoom(menuRoom === r.name ? null : r.name)
              }}
            >
              ⋮
            </span>

            {menuRoom === r.name && (
              <>
                <div
                  className="menu-backdrop"
                  onClick={() => setMenuRoom(null)}
                ></div>

                <div className="menu">
                  <div onClick={() => {
                    navigator.clipboard.writeText(r.code)
                    setMenuRoom(null)
                  }}>
                    📋 Copy Invite Code
                  </div>

                  <div onClick={() => {
                    setModal({ type: 'leave', room: r })
                    setMenuRoom(null)
                  }}>
                    🚪 Leave Group
                  </div>

                  <div
                    className="danger"
                    onClick={() => {
                      setModal({ type: 'delete', room: r })
                      setMenuRoom(null)
                    }}
                  >
                    🗑 Delete Group
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        <button onClick={() => setModal({ type: 'create' })}>
          + Create Group
        </button>

        <button onClick={() => setModal({ type: 'join' })}>
          + Join Group
        </button>

        <button className="logout" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="chat-area">
        <h3>{currentRoom}</h3>

        <div className="messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', opacity: 0.6, marginTop: '40px' }}>
              No messages yet. Start the conversation 👋
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`message ${m.user === user ? 'me' : ''}`}>
              <div className="message-user">{m.user}</div>
              {m.text && <div>{m.text}</div>}
              {m.file && (
                m.file.match(/\.(png|jpg|jpeg)$/)
                  ? <img src={`http://localhost:5001${m.file}`} />
                  : <a href={`http://localhost:5001${m.file}`} target="_blank">
                      Download
                    </a>
              )}
            </div>
          ))}

          <div ref={bottomRef}></div>
        </div>

        <div
          className="input"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              send()
            }
          }}
        >
          <input type="file" onChange={e => setFile(e.target.files[0])} />
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a message…"
          />
          <button onClick={send} disabled={!text.trim() && !file}>
            Send
          </button>
        </div>
      </div>

      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {modal.type === 'create' && (
              <>
                <h4>Create Group</h4>
                <input value={input} onChange={e => setInput(e.target.value)} />
                <button onClick={createGroup} disabled={groupLoading}>
                  {groupLoading ? 'Creating...' : 'Create'}
                </button>
              </>
            )}

            {modal.type === 'join' && (
              <>
                <h4>Join Group</h4>
                <input value={input} onChange={e => setInput(e.target.value)} />
                <button onClick={joinGroup} disabled={groupLoading}>
                  {groupLoading ? 'Joining...' : 'Join'}
                </button>
              </>
            )}

            {modal.type === 'leave' && (
              <>
                <h4>Leave Group?</h4>
                <button onClick={() => leaveGroup(modal.room.name)}>
                  Leave
                </button>
              </>
            )}

            {modal.type === 'delete' && (
              <>
                <h4 style={{ color: '#ef4444' }}>Delete Group?</h4>
                <button
                  className="danger"
                  onClick={() => deleteGroup(modal.room.name)}
                >
                  Delete
                </button>
              </>
            )}

            <button onClick={() => setModal(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
