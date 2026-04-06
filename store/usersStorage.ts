export interface StoredUser {
  username: string
  email: string
  password: string
}

const USERS_KEY = 'ms-users'
const SESSION_KEY = 'ms-session'

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
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') as { username: string; email: string } | null
  } catch {
    return null
  }
}

export const saveSession = (user: { username: string; email: string }): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY)
}
