export interface StoredUser {
  username: string
  email: string
  password: string
}

const USERS_KEY = 'ms-users'
const SESSION_KEY = 'ms-session'
const TEMP_SESSION_KEY = 'ms-session-temp'

export const getUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as StoredUser[]
  } catch {
    return []
  }
}

export const saveUser = (user: StoredUser): void => {
  const users = getUsers()
  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const findUser = (username: string, password: string): StoredUser | undefined => {
  return getUsers().find((u) => u.username === username && u.password === password)
}

export const getSession = (): { username: string; email: string } | null => {
  if (typeof window === 'undefined') return null
  try {
    const persistentSession = localStorage.getItem(SESSION_KEY)
    if (persistentSession) {
      return JSON.parse(persistentSession) as { username: string; email: string }
    }

    return JSON.parse(sessionStorage.getItem(TEMP_SESSION_KEY) ?? 'null') as { username: string; email: string } | null
  } catch {
    return null
  }
}

export const saveSession = (user: { username: string; email: string }, rememberLogin: boolean): void => {
  if (rememberLogin) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    sessionStorage.removeItem(TEMP_SESSION_KEY)
    return
  }

  sessionStorage.setItem(TEMP_SESSION_KEY, JSON.stringify(user))
  localStorage.removeItem(SESSION_KEY)
}

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(TEMP_SESSION_KEY)
}
