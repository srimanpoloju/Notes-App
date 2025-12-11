import React, { useEffect, useState } from 'react'
import axios from 'axios'

type Note = {
  id: string
  title: string
  content?: string
  createdAt: string
  updatedAt?: string
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/notes`)
      setNotes(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function createNote() {
    if (!title.trim()) {
      setMessage('Title is required')
      return
    }
    try {
      const res = await axios.post(`${API_BASE}/notes`, { title, content })
      setNotes((s) => [res.data, ...s])
      setTitle('')
      setContent('')
      setMessage('Note created')
      setTimeout(() => setMessage(null), 2300)
    } catch (err) {
      console.error(err)
      setMessage('Failed to create note')
    }
  }

  async function deleteNote(id: string) {
    if (!confirm('Delete this note?')) return
    try {
      await axios.delete(`${API_BASE}/notes/${id}`)
      setNotes((s) => s.filter((n) => n.id !== id))
      setMessage('Note deleted')
      setTimeout(() => setMessage(null), 2000)
    } catch (err) {
      console.error(err)
      setMessage('Failed to delete')
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content || '')
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim()) {
      setMessage('Title is required')
      return
    }
    try {
      const res = await axios.put(`${API_BASE}/notes/${id}`, { title: editTitle, content: editContent })
      setNotes((s) => s.map((n) => (n.id === id ? res.data : n)))
      setEditingId(null)
      setEditTitle('')
      setEditContent('')
      setMessage('Note updated')
      setTimeout(() => setMessage(null), 2000)
    } catch (err) {
      console.error(err)
      setMessage('Failed to update')
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setEditTitle('')
    setEditContent('')
  }

  return (
    <div className="app">
      <header>
        <h1>Notes</h1>
      </header>

      <section className="composer">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content (optional)" />
        <button onClick={createNote}>Add Note</button>
      </section>

      <section className="notes">
        {loading ? (
          <p>Loading...</p>
        ) : notes.length === 0 ? (
          <p>No notes yet — add one above.</p>
        ) : (
          notes.map((n) => (
            <article key={n.id} className="note">
              <div className="meta">
                <small>{new Date(n.createdAt).toLocaleString()}</small>
                <div>
                  <button onClick={() => startEdit(n)} style={{marginRight:8}}>Edit</button>
                  <button onClick={() => deleteNote(n.id)}>Delete</button>
                </div>
              </div>
              {editingId === n.id ? (
                <div>
                  <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                  <div style={{marginTop:8}}>
                    <button onClick={() => saveEdit(n.id)} style={{marginRight:8}}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{n.title}</h3>
                  {n.content && <p style={{whiteSpace:'pre-wrap'}}>{n.content}</p>}
                </>
              )}
            </article>
          ))
        )}
      </section>

      {message && (
        <div className="toast">{message}</div>
      )}

      <footer>
        <small>Notes app — simple demo</small>
      </footer>
    </div>
  )
}
