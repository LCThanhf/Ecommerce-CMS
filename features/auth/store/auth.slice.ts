import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  username: string
  email: string
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
    markAuthHydrated(state) {
      state.hasHydrated = true
    },
  },
})

export const { loginUser, logoutUser, markAuthHydrated } = authSlice.actions
export default authSlice.reducer
