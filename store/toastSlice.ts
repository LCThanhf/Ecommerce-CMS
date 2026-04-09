import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type ToastState = {
  message: string | null
  visible: boolean
}

const initialState: ToastState = {
  message: null,
  visible: false,
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<string>) {
      state.message = action.payload
      state.visible = true
    },
    hideToast(state) {
      state.visible = false
      state.message = null
    },
  },
})

export const { showToast, hideToast } = toastSlice.actions
export default toastSlice.reducer
