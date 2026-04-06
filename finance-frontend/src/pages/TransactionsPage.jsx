import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Filter, ChevronLeft, ChevronRight, Edit2, Trash2, X } from 'lucide-react'
import { txAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import TransactionModal from '../components/TransactionModal'
import ConfirmDialog from '../components/ConfirmDialog'

const CATS = ['All','Salary','Food','Rent','Transport','Entertainment','Healthcare','Shopping','Utilities','Education','Investment','Other']
const fmt = v => `₹${new Intl.NumberFormat('en-IN').format(Math.round(v || 0))}`

export default function TransactionsPage() {
  const { isAnalyst, isAdmin } = useAuth()
  const { show } = useToast()
  const [txs, setTxs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [modalTx, setModalTx] = useState(undefined)
  const [delTx, setDelTx] = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const [filters, setFilters] = useState({ type: '', category: 'All', startDate: '', endDate: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      let res

      if (filters.type) {
        res = await txAPI.byType(filters.type)
      } else if (filters.category && filters.category !== 'All') {
        res = await txAPI.byCategory(filters.category)
      } else if (filters.startDate && filters.endDate) {
        res = await txAPI.byDate(filters.startDate, filters.endDate)
      } else {
        res = await txAPI.getAll(page, 10)
      }

      const data = res.data
      if (Array.isArray(data)) {
        setTxs(data)
        setTotalPages(1)
      } else {
        setTxs(data.content || [])
        setTotalPages(data.totalPages || 1)
      }
    } catch (e) {
      show('Failed to load transactions', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => { load() }, [load])

  const handleTypeChange = (e) => {
    const type = e.target.value
    setFilters({ type, category: 'All', startDate: '', endDate: '' })
    setPage(0)
  }

  const handleCategoryChange = (e) => {
    const category = e.target.value
    setFilters({ type: '', category, startDate: '', endDate: '' })
    setPage(0)
  }

  const handleStartDate = (e) => {
    setFilters(f => ({ ...f, type: '', category: 'All', startDate: e.target.value }))
    setPage(0)
  }

  const handleEndDate = (e) => {
    setFilters(f => ({ ...f, type: '', category: 'All', endDate: e.target.value }))
    setPage(0)
  }

  const clearFilters = () => {
    setFilters({ type: '', category: 'All', startDate: '', endDate: '' })
    setPage(0)
  }

  const isFiltered = filters.type || (filters.category && filters.category !== 'All') || (filters.startDate && filters.endDate)

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await txAPI.remove(delTx.id)
      show('Transaction deleted', 'success')
      setDelTx(null)
      load()
    } catch (e) {
      show('Failed to delete', 'error')
    } finally { setDelLoading(false) }
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.8rem', color: 'var(--text-1)' }}>Transactions</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 3 }}>Manage your financial records</p>
        </div>
        {isAnalyst && (
          <button className="btn btn-gold" onClick={() => setModalTx(null)}><Plus size={15}/>New Transaction</button>
        )}
      </div>

      {/* Filters */}
      <div className="card fade-up d1" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <Filter size={14} color="var(--text-3)"/>
          <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Filters</span>
          {isFiltered && (
            <button className="btn btn-ghost" style={{ marginLeft: 'auto', fontSize: 12, padding: '4px 10px' }} onClick={clearFilters}><X size={12}/>Clear</button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 10 }}>
          {/* Type filter */}
          <div>
            <label className="label">Type</label>
            <select className="input" value={filters.type} onChange={handleTypeChange}>
              <option value="">All Types</option>
              <option value="INCOME">INCOME</option>
              <option value="EXPENSE">EXPENSE</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="label">Category</label>
            <select className="input" value={filters.category} onChange={handleCategoryChange}>
              {CATS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Date range filter */}
          <div>
            <label className="label">Start Date</label>
            <input className="input" type="date" value={filters.startDate} onChange={handleStartDate}/>
          </div>
          <div>
            <label className="label">End Date</label>
            <input className="input" type="date" value={filters.endDate} onChange={handleEndDate}/>
          </div>
        </div>

        {isFiltered && (
          <div style={{ marginTop: 10, padding: '7px 12px', background: 'rgba(245,166,35,0.08)', borderRadius: 8, border: '1px solid rgba(245,166,35,0.2)', fontSize: 12, color: 'var(--gold)' }}>
            Active filter: <strong>
              {filters.type ? `Type = ${filters.type}` :
               filters.category !== 'All' ? `Category = ${filters.category}` :
               `Date: ${filters.startDate} → ${filters.endDate}`}
            </strong>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card fade-up d2" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 20, display: 'grid', gap: 10 }}>
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 44 }}/>)}
          </div>
        ) : txs.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-3)' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 14 }}>No transactions found</div>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th><th>Date</th><th>Type</th><th>Category</th><th>Notes</th><th>Created By</th><th style={{ textAlign: 'right' }}>Amount</th>
                {isAnalyst && <th style={{ textAlign: 'center' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {txs.map(tx => (
                <tr key={tx.id}>
                  <td className="mono" style={{ fontSize: 12, color: 'var(--text-3)' }}>#{tx.id}</td>
                  <td className="mono" style={{ fontSize: 12, color: 'var(--text-3)' }}>{tx.date}</td>
                  <td><span className={`badge ${tx.type === 'INCOME' ? 'b-income' : 'b-expense'}`}>{tx.type}</span></td>
                  <td>{tx.category}</td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.notes || '—'}</td>
                  <td style={{ color: 'var(--text-3)', fontSize: 13 }}>{tx.createdBy}</td>
                  <td style={{ textAlign: 'right', fontFamily: "'DM Mono',monospace", color: tx.type === 'INCOME' ? 'var(--green)' : 'var(--rose)', fontWeight: 500 }}>
                    {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
                  </td>
                  {isAnalyst && (
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button className="btn btn-ghost" onClick={() => setModalTx(tx)}><Edit2 size={13}/></button>
                        {isAdmin && <button className="btn btn-red" onClick={() => setDelTx(tx)}><Trash2 size={13}/></button>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination - only show when no filter active */}
        {!isFiltered && totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-ghost" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14}/>Prev</button>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Page {page + 1} of {totalPages}</span>
            <button className="btn btn-ghost" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next<ChevronRight size={14}/></button>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalTx !== undefined && (
        <TransactionModal tx={modalTx} onClose={() => setModalTx(undefined)} onSaved={() => { setModalTx(undefined); load() }}/>
      )}
      {delTx && (
        <ConfirmDialog
          title="Delete Transaction"
          message={`Delete this ${delTx.type} of ${fmt(delTx.amount)}? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDelTx(null)}
          loading={delLoading}
        />
      )}
    </div>
  )
}