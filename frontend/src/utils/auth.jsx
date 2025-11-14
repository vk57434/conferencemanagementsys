import React, { createContext } from 'react'

export const AuthContext = createContext(null)
export function AuthProvider({ children }){
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const user = token ? { token, role } : null
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}