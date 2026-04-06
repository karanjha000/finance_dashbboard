import React, { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext(null)
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('fin_token')
    const username = localStorage.getItem('fin_username')
    const role = localStorage.getItem('fin_role')
    return token ? { token, username, role } : null
  })
  const login = useCallback((token, username, role) => {
    localStorage.setItem('fin_token', token)
    localStorage.setItem('fin_username', username)
    localStorage.setItem('fin_role', role)
    setAuth({ token, username, role })
  }, [])
  const logout = useCallback(() => {
    ['fin_token','fin_username','fin_role'].forEach(k => localStorage.removeItem(k))
    setAuth(null)
  }, [])
  return (
    <Ctx.Provider value={{
      auth,
      login,
      logout,
      isAdmin: auth?.role === 'ADMIN',
      isAnalyst: auth?.role === 'ANALYST' || auth?.role === 'ADMIN',
    }}>
      {children}
    </Ctx.Provider>
  )
}
export const useAuth = () => useContext(Ctx)
