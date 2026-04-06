import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { txAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

const CATS = ['Salary','Food','Rent','Transport','Entertainment','Healthcare','Shopping','Utilities','Education','Investment','Other']
const empty = { amount: '', type: 'INCOME', category: 'Salary', date: new Date().toISOString().split('T')[0], notes: '' }

export default function TransactionModal({ tx, onClose, onSaved }) {
  const [form, setForm] = useState(tx ? { amount: tx.amount, type: tx.type, category: tx.category, date: tx.date, notes: tx.notes || '' } : empty)
  const [loading, setLoading] = useState(false)
  const { show } = useToast()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.amount || isNaN(form.amount)) return show('Enter a valid amount', 'error')
    if (!form.date) return show('Select a date', 'error')
    setLoading(true)
    try {
      if (tx) await txAPI.update(tx.id, { ...form, amount: parseFloat(form.amount) })
      else await txAPI.create({ ...form, amount: parseFloat(form.amount) })
      show(tx ? 'Transaction updated!' : 'Transaction created!', 'success')
      onSaved()
    } catch (e) {
      show(e.response?.data?.message || 'Failed to save', 'error')
    } finally { setLoading(false) }
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.4rem', color: 'var(--text-1)' }}>{tx ? 'Edit Transaction' : 'New Transaction'}</h2>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: 7 }}><X size={16}/></button>
        </div>
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label className="label">Amount (₹)</label>
            <input className="input" type="number" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="INCOME">INCOME</option>
                <option value="EXPENSE">EXPENSE</option>
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Date</label>
            <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)}/>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={3} placeholder="Optional notes..." value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical' }}/>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button className="btn btn-gold" onClick={submit} disabled={loading}>
              {loading ? <><span className="spinner"/> Saving…</> : (tx ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
