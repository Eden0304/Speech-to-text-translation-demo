"use client"

import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  password?: string // 仅用于模拟
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean // Add explicit isLoggedIn property
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: Omit<User, "id">) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 模拟用户数据库
const mockUsersDB: User[] = [{ id: "1", name: "Demo User", email: "demo@example.com", password: "demo123" }]

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  // 初始化时从localStorage加载用户
  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (saved) {
      try {
        const userData = JSON.parse(saved)
        setUser(userData)
        setIsLoggedIn(true)
        console.log("User loaded from localStorage:", userData)
      } catch (e) {
        console.error("Failed to parse saved user", e)
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = mockUsersDB.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email }
      setUser(userData)
      setIsLoggedIn(true)
      localStorage.setItem("user", JSON.stringify(userData))

      // Dispatch a custom event to notify components about auth state change
      window.dispatchEvent(new CustomEvent("authStateChange", { detail: { isLoggedIn: true } }))

      console.log("User logged in:", userData)
      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }

  const register = async (userData: Omit<User, "id">) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (mockUsersDB.some((u) => u.email === userData.email)) {
      return { success: false, error: "Email already exists" }
    }

    const newUser = {
      ...userData,
      id: Math.random().toString(36).substring(2, 9),
    }

    mockUsersDB.push(newUser)

    // Remove password from user data stored in state
    const userDataForState = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }

    setUser(userDataForState)
    setIsLoggedIn(true)
    localStorage.setItem("user", JSON.stringify(userDataForState))

    // Dispatch a custom event to notify components about auth state change
    window.dispatchEvent(new CustomEvent("authStateChange", { detail: { isLoggedIn: true } }))

    console.log("User registered:", userDataForState)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("user")

    // Dispatch a custom event to notify components about auth state change
    window.dispatchEvent(new CustomEvent("authStateChange", { detail: { isLoggedIn: false } }))

    console.log("User logged out")
  }

  return <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout }}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
