import React from 'react'

export default function StatCard({ label, value, icon: Icon, color, sub, delay = '' }) {
  const fmt = v => {
    if (v === null || v === undefined) return '—'
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)
  }
  return (
    <div className={`card fade-up ${delay}`} style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `${color}09`, borderRadius: '0 0 0 80px' }}/>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
        <div style={{ width: 36, height: 36, background: `${color}18`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color}/>
        </div>
      </div>
      <div className="mono" style={{ fontSize: 26, fontWeight: 500, color: 'var(--text-1)', letterSpacing: '-0.02em', lineHeight: 1 }}>{fmt(value)}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 8 }}>{sub}</div>}
    </div>
  )
}
