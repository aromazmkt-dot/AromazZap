'use client'

import { useState } from 'react'

type Message = { role: 'bot' | 'user'; text: string }

export default function AgentAssistantWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hola, soy Agente Aromaz. Estoy dentro del panel para ayudarte con vendedores, ventas, leads, productos, proveedores e instaladores.' },
  ])

  async function askAgent(prompt?: string) {
    const question = (prompt ?? input).trim()
    if (!question || busy) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setBusy(true)
    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: question }),
      })
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'bot', text: data.answer ?? 'No pude procesar esa consulta.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'No pude conectar con el agente interno. Intenta de nuevo.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ position: 'fixed', right: 22, bottom: 22, zIndex: 80 }}>
      {open && (
        <div style={{ width: 'min(390px, calc(100vw - 28px))', height: 520, maxHeight: 'calc(100vh - 44px)', background: '#fff', border: '1px solid #E7ECF3', borderRadius: 22, boxShadow: '0 30px 90px -28px rgba(12,36,64,.55)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: 'linear-gradient(135deg,#0C3556,#1E7FCC)', color: '#fff', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div><div style={{ fontWeight: 800, fontSize: 14 }}>Agente Aromaz</div><div style={{ fontSize: 11, opacity: .82 }}>Asistente operativo dentro del panel</div></div>
            <button type="button" onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.18)', color: '#fff', borderRadius: 9, width: 30, height: 30, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 14, background: 'linear-gradient(180deg,#F8FAFC,#EEF4FB)' }}>
            {messages.map((message, index) => (
              <div key={index} style={{ maxWidth: '88%', padding: '10px 12px', borderRadius: 14, marginBottom: 9, fontSize: 12.5, lineHeight: 1.45, whiteSpace: 'pre-wrap', marginLeft: message.role === 'user' ? 'auto' : 0, background: message.role === 'user' ? '#1E7FCC' : '#fff', color: message.role === 'user' ? '#fff' : '#334155', border: message.role === 'user' ? 'none' : '1px solid #E7ECF3' }}>{message.text}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '10px 12px', borderTop: '1px solid #E7ECF3' }}>
            {['Lista de vendedores', 'Resumen de ventas', 'Proveedores principales', 'Productos con bajo stock'].map(prompt => (
              <button key={prompt} type="button" onClick={() => askAgent(prompt)} style={{ border: '1px solid #D3E6F7', background: '#EAF3FB', color: '#155A91', borderRadius: 999, padding: '6px 9px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer' }}>{prompt.replace('Lista de ', '')}</button>
            ))}
          </div>
          <form onSubmit={event => { event.preventDefault(); void askAgent() }} style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #E7ECF3' }}>
            <input value={input} onChange={event => setInput(event.target.value)} placeholder="Pregúntame sobre la operación…" style={{ flex: 1, border: '1px solid #E7ECF3', borderRadius: 12, padding: '10px 11px', font: 'inherit', fontSize: 13, outline: 'none' }} />
            <button type="submit" disabled={busy} style={{ border: 0, background: '#1E7FCC', color: '#fff', borderRadius: 12, padding: '0 14px', fontWeight: 800, cursor: 'pointer', opacity: busy ? .7 : 1 }}>{busy ? '...' : 'Enviar'}</button>
          </form>
        </div>
      )}
      {!open && <button type="button" onClick={() => setOpen(true)} aria-label="Abrir Agente Aromaz" style={{ width: 62, height: 62, borderRadius: 20, border: 0, background: 'linear-gradient(135deg,#1E7FCC,#0C3556)', color: '#fff', boxShadow: '0 18px 40px -16px rgba(12,36,64,.8)', cursor: 'pointer', fontWeight: 900 }}>AA</button>}
    </div>
  )
}
