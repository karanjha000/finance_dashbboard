import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const w = collapsed ? 68 : 236
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)}/>
      <main style={{ marginLeft: w, flex: 1, transition: 'margin-left 0.28s ease', minHeight: '100vh', padding: '30px 32px', background: 'var(--bg-primary)' }}>
        <Outlet/>
      </main>
    </div>
  )
}
