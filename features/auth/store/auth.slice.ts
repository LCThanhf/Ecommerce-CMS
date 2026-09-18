import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  id: number
  username: string
  email: string
  role: string
  avatar?: string
}

interface AuthState {
  user: AuthUser | null
  hasHydrated: boolean
}

const initialState: AuthState = {
  user: null,
  hasHydrated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
    },
    logoutUser(state) {
      state.user = null
    },
    updateUserAvatar(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.avatar = action.payload
      }
    },
    markAuthHydrated(state) {
      state.hasHydrated = true
    },
  },
})

export const { loginUser, logoutUser, updateUserAvatar, markAuthHydrated } = authSlice.actions
export default authSlice.reducer
