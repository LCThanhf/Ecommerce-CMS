import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  username: string
  email: string
}

interface AuthState {
  user: AuthUser | null
}

const initialState: AuthState = {
  user: null,
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
  },
})

export const { loginUser, logoutUser } = authSlice.actions
export default authSlice.reducer
