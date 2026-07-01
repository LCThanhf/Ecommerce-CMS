import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Language = 'en' | 'vi'

interface LanguageState {
  language: Language
  hasHydrated: boolean
}

const initialState: LanguageState = {
  language: 'en',
  hasHydrated: false,
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('ms-language', action.payload)
      }
    },
    hydrateLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload
      state.hasHydrated = true
    },
    markLanguageHydrated(state) {
      state.hasHydrated = true
    },
  },
})

export const { setLanguage, hydrateLanguage, markLanguageHydrated } = languageSlice.actions
export default languageSlice.reducer
