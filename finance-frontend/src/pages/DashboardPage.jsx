import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Wallet, Activity, RefreshCw } from 'lucide-react'
import { dashAPI } from '../services/api'
import { useToast } from '../context/ToastContext'
import StatCard from '../components/StatCard'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const PIE_COLORS = ['#f5a623','#06b6d4','#10b981','#8b5cf6','#f43f5e','#fb923c','#84cc16','#ec4899']
const fmt = v => `₹${new Intl.NumberFormat('en-IN').format(Math.round(v || 0))}`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
      {label && <div style={{ color: 'var(--text-3)', marginBottom: 4, fontSize: 11 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--text-1)', fontFamily: "'DM Mono',monospace", fontWeight: 500 }}>
          {p.name && <span style={{ color: 'var(--text-3)', marginRight: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 11 }}>{p.name}</span>}
          {fmt(p.value)}
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [catData, setCatData] = useState([])
  const [loading, setLoading] = useState(true)
  const { show } = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const [s, m, c] = await Promise.all([dashAPI.summary(), dashAPI.monthly(), dashAPI.category()])
      setSummary(s.data)
      // monthly: { "APRIL-2026": 5000 } -> [{name, value}]
      const mData = Object.entries(m.data || {}).map(([k, v]) => ({ name: k.split('-')[0].slice(0,3), full: k, value: v }))
      setMonthly(mData)
      const cData = Object.entries(c.data || {}).map(([k, v]) => ({ name: k, value: v }))
      setCatData(cData)
    } catch (e) {
      show('Failed to load dashboard data', 'error')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const recentTx = summary?.recentTransactions || []

  if (loading) return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[1,2,3].map(i => <div key={i} className="card skeleton" style={{ height: 110 }}/>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[1,2].map(i => <div key={i} className="card skeleton" style={{ height: 280 }}/>)}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'grid', gap: 22 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="fade-up" style={{ fontFamily: "'DM Serif Display',serif", fontSize: '1.8rem', color: 'var(--text-1)' }}>Overview</h1>
          <p className="fade-up d1" style={{ color: 'var(--text-3)', fontSize: 13, marginTop: 3 }}>Financial summary at a glance</p>
        </div>
        <button className="btn btn-ghost fade-up d2" onClick={load}><RefreshCw size={14}/>Refresh</button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px,1fr))', gap: 14 }}>
        <StatCard label="Total Income" value={summary?.totalIncome} icon={TrendingUp} color="var(--green)" delay="d1"/>
        <StatCard label="Total Expenses" value={summary?.totalExpenses} icon={TrendingDown} color="var(--rose)" delay="d2"/>
        <StatCard label="Net Balance" value={summary?.netBalance} icon={Wallet} color="var(--gold)" sub={(summary?.netBalance >= 0) ? '↑ Positive balance' : '↓ Negative balance'} delay="d3"/>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        {/* Monthly trends */}
        <div className="card fade-up d3" style={{ padding: '22px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Activity size={15} color="var(--gold)"/>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Monthly Trends</h3>
          </div>
          {monthly.length === 0 ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 13 }}>No trend data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthly} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="value" stroke="var(--gold)" strokeWidth={2} fill="url(#goldGrad)" name="Amount"/>
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category breakdown */}
        <div className="card fade-up d4" style={{ padding: '22px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Activity size={15} color="var(--cyan)"/>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>By Category</h3>
          </div>
          {catData.length === 0 ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 13 }}>No category data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                </Pie>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{v}</span>}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Category bar chart */}
      {catData.length > 0 && (
        <div className="card fade-up d5" style={{ padding: '22px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Activity size={15} color="var(--violet)"/>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Category Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="value" radius={[5, 5, 0, 0]} name="Total">
                {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent transactions */}
      {recentTx.length > 0 && (
        <div className="card fade-up" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Recent Transactions</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th><th>Type</th><th>Category</th><th>Notes</th><th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.slice(0, 8).map(tx => (
                <tr key={tx.id}>
                  <td style={{ color: 'var(--text-3)', fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{tx.date}</td>
                  <td><span className={`badge ${tx.type === 'INCOME' ? 'b-income' : 'b-expense'}`}>{tx.type}</span></td>
                  <td>{tx.category}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.notes || '—'}</td>
                  <td style={{ textAlign: 'right', fontFamily: "'DM Mono',monospace", color: tx.type === 'INCOME' ? 'var(--green)' : 'var(--rose)', fontWeight: 500 }}>
                    {tx.type === 'INCOME' ? '+' : '-'}{fmt(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
