export interface AuthUser {
  id: number
  username: string
  email: string
  role: string
}

export interface AuthState {
  user: AuthUser | null
  hasHydrated: boolean
}

export interface StoredUser {
  username: string
  email: string
  password: string
}

export interface SessionUser {
  id: number
  username: string
  email: string
  role: string
}
