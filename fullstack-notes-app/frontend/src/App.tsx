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
  const [spreadIndex, setSpreadIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [animDirection, setAnimDirection] = useState<'next' | 'prev' | null>(null)

  useEffect(() => {
    fetchNotes()
    // reset to first spread when notes change
  }, [])

  useEffect(() => {
    setSpreadIndex(0)
  }, [notes])
 

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

  function chunkNotes(notesArr: Note[], per = 2) {
    const out: Note[][] = []
    for (let i = 0; i < notesArr.length; i += per) out.push(notesArr.slice(i, i + per))
    return out
  }

  const spreads = chunkNotes(notes, 2)
  const totalSpreads = Math.max(1, spreads.length)

  const ANIM_DURATION = 800 // ms

  function prevSpread() {
    if (animating) return
    if (spreadIndex === 0) return
    setAnimDirection('prev')
    setAnimating(true)
    // wait for animation then change index
    setTimeout(() => {
      setSpreadIndex((s) => Math.max(0, s - 1))
      setAnimating(false)
      setAnimDirection(null)
    }, ANIM_DURATION)
  }

  function nextSpread() {
    if (animating) return
    if (spreadIndex >= totalSpreads - 1) return
    setAnimDirection('next')
    setAnimating(true)
    setTimeout(() => {
      setSpreadIndex((s) => Math.min(totalSpreads - 1, s + 1))
      setAnimating(false)
      setAnimDirection(null)
    }, ANIM_DURATION)
  }

  return (
    <div className="app">
      <header>
        <h1>Notes</h1>
      </header>

      {/* Decorative animated butterflies */}
      <div className="butterflies" aria-hidden>
        {Array.from({ length: 7 }).map((_, i) => {
          const varStyle = ({ ['--i']: i } as unknown) as React.CSSProperties
          return <div key={i} className="butterfly" style={varStyle} />
        })}
      </div>

      <section className="composer">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content (optional)" />
        <button onClick={createNote}>Add Note</button>
      </section>

      <section className="book">
        {/* 3D cover scene */}
        <div className="scene" aria-hidden>
          <div className="book-cover">
            <div className="cover-front">
              <div className="cover-title">My Notes</div>
            </div>
            <div className="cover-spine" />
            <div className="cover-back" />
          </div>
        </div>

        {/* debug status - shows number of notes loaded */}
        <div className="debug-status">Notes loaded: {notes.length}</div>
        <div className="book-controls">
          <button className="btn btn-ghost" onClick={prevSpread} disabled={spreadIndex === 0}>◀ Prev</button>
          <div className="spread-info">{spreadIndex + 1} / {totalSpreads}</div>
          <button className="btn btn-ghost" onClick={nextSpread} disabled={spreadIndex >= totalSpreads - 1}>Next ▶</button>
        </div>

  <div className={`book-spread ${animating && animDirection ? `turn-${animDirection}` : ''}`} role="region" aria-label="Notes book">
          {/* left page */}
          <div className="page left">
            {loading ? <p>Loading...</p> : (
              (spreads[spreadIndex] && spreads[spreadIndex][0]) ? (
                (() => {
                  const n = spreads[spreadIndex][0]
                  return (
                    <article className="note-page">
                      <h3>{n.title}</h3>
                      <small className="meta">{new Date(n.createdAt).toLocaleString()}</small>
                      {editingId === n.id ? (
                        <div>
                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                          <div style={{marginTop:8}}>
                            <button onClick={() => saveEdit(n.id)} className="btn btn-primary" style={{marginRight:8}}>Save</button>
                            <button onClick={cancelEdit} className="btn btn-ghost">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="content">{n.content && <p style={{whiteSpace:'pre-wrap'}}>{n.content}</p>}</div>
                          <div className="page-actions">
                            <button onClick={() => startEdit(n)} className="btn btn-ghost">Edit</button>
                            <button onClick={() => deleteNote(n.id)} className="btn btn-ghost">Delete</button>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })()
              ) : (
                <div className="note-page empty">(blank)</div>
              )
            )}
          </div>

          {/* right page */}
          <div className="page right">
            {loading ? <p>Loading...</p> : (
              (spreads[spreadIndex] && spreads[spreadIndex][1]) ? (
                (() => {
                  const n = spreads[spreadIndex][1]
                  return (
                    <article className="note-page">
                      <h3>{n.title}</h3>
                      <small className="meta">{new Date(n.createdAt).toLocaleString()}</small>
                      {editingId === n.id ? (
                        <div>
                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                          <div style={{marginTop:8}}>
                            <button onClick={() => saveEdit(n.id)} className="btn btn-primary" style={{marginRight:8}}>Save</button>
                            <button onClick={cancelEdit} className="btn btn-ghost">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="content">{n.content && <p style={{whiteSpace:'pre-wrap'}}>{n.content}</p>}</div>
                          <div className="page-actions">
                            <button onClick={() => startEdit(n)} className="btn btn-ghost">Edit</button>
                            <button onClick={() => deleteNote(n.id)} className="btn btn-ghost">Delete</button>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })()
              ) : (
                <div className="note-page empty">(blank)</div>
              )
            )}
          </div>
        </div>
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
