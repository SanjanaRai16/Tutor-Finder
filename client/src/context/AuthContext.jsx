import { createContext, useContext, useState } from 'react'
const AuthContext = createContext()
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const loginUser  = (data) => { setUser(data); localStorage.setItem('user', JSON.stringify(data)) }
  const logoutUser = ()     => { setUser(null);  localStorage.removeItem('user') }
  return <AuthContext.Provider value={{ user, loginUser, logoutUser }}>{children}</AuthContext.Provider>
}
export function useAuth() { return useContext(AuthContext) }