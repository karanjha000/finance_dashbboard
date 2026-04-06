import React, { useEffect, useState } from 'react'
import { RefreshCw, Trash2, Shield } from 'lucide-react'
import { usersAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from '../components/ConfirmDialog'

export default function UsersPage() {
  const { isAdmin } = useAuth()
  const { show } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [delUser, setDelUser] = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await usersAPI.getAll()
      setUsers(Array.isArray(data) ? data : data.users || [])
    } catch { show('Failed to load users', 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleRoleChange = async (id, role) => {
    setUpdatingId(id)
    try {
      await usersAPI.updateRole(id, role)
      show('Role updated', 'success')
      setUsers(u => u.map(x => x.id === id ? { ...x, role } : x))
    } catch { show('Failed to update role', 'error') }
    finally { setUpdatingId(null) }
  }

  const handleToggle = async (id) => {
    setUpdatingId(id)
    try {
      await usersAPI.toggle(id)
      show('Status updated', 'success')
      setUsers(u => u.map(x => x.id === id ? { ...x, enabled: !x.enabled, active: !x.active } : x))
    } catch { show('Failed to toggle status', 'error') }
    finally { setUpdatingId(null) }
  }

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await usersAPI.remove(delUser.id)
      show('User deleted', 'success')
      setDelUser(null)
      load()
    } catch { show('Failed to delete user', 'error') }
    finally { setDelLoading(false) }
  }

  const isActive = u => u.enabled !== false && u.active !== false

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.8rem', color: 'var(--text-1)' }}>Users</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 3 }}>Manage platform access & roles</p>
        </div>
        <button className="btn btn-ghost fade-up d1" onClick={load}><RefreshCw size={14}/>Refresh</button>
      </div>

      {/* Stats */}
      <div className="fade-up d1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
        {[
          { label: 'Total Users', value: users.length, color: 'var(--cyan)' },
          { label: 'Active', value: users.filter(isActive).length, color: 'var(--green)' },
          { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, color: 'var(--gold)' },
          { label: 'Analysts', value: users.filter(u => u.role === 'ANALYST').length, color: 'var(--cyan)' },
          { label: 'Viewers', value: users.filter(u => u.role === 'VIEWER').length, color: 'var(--violet)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }}/>
            <div>
              <div className="mono" style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-1)' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card fade-up d2" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 20, display: 'grid', gap: 10 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 52 }}/>)}
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>No users found</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const active = isActive(u)
                const busy = updatingId === u.id
                return (
                  <tr key={u.id}>
                    <td className="mono" style={{ fontSize: 12, color: 'var(--text-3)' }}>#{u.id}</td>
                    <td style={{ fontWeight: 500, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--gold)', border: '1px solid var(--border-light)' }}>
                        {u.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      {u.username}
                    </td>
                    <td style={{ color: 'var(--text-3)', fontSize: 13 }}>{u.email || '—'}</td>
                    <td>
                      <select
                        className="input"
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                        disabled={busy}
                        style={{ width: 'auto', padding: '5px 10px', fontSize: 12 }}
                      >
                        <option value="VIEWER">VIEWER</option>
                        <option value="ANALYST">ANALYST</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td><span className={`badge ${active ? 'b-active' : 'b-inactive'}`}>{active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button className="btn btn-ghost" onClick={() => handleToggle(u.id)} disabled={busy} style={{ fontSize: 12, padding: '5px 10px' }}>
                          {busy ? <span className="spinner"/> : (active ? 'Disable' : 'Enable')}
                        </button>
                        <button className="btn btn-red" onClick={() => setDelUser(u)} disabled={busy}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {delUser && (
        <ConfirmDialog
          title="Delete User"
          message={`Permanently delete "${delUser.username}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDelUser(null)}
          loading={delLoading}
        />
      )}
    </div>
  )
}
