export interface AuthUser {
  username: string
  email: string
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
  username: string
  email: string
}
