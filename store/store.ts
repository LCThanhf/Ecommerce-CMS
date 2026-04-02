import { configureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware } from 'redux-observable'
import type { Action } from '@reduxjs/toolkit'
import searchReducer from './searchSlice'
import filterReducer from './filterSlice'
import { rootEpic } from './epics'

const epicMiddleware = createEpicMiddleware<Action, Action, unknown>()

export const store = configureStore({
  reducer: {
    search: searchReducer,
    filter: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(epicMiddleware),
})

epicMiddleware.run(rootEpic)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
