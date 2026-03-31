import { configureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware } from 'redux-observable'
import type { Action } from '@reduxjs/toolkit'
import searchReducer from './searchSlice'
import { searchDebounceEpic } from './epics'

const epicMiddleware = createEpicMiddleware<Action, Action, unknown>()

export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(epicMiddleware),
})

epicMiddleware.run(searchDebounceEpic)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
