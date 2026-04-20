import { configureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware } from 'redux-observable'
import type { Action } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'
import { rootEpic } from './rootEpic'

const epicMiddleware = createEpicMiddleware<Action, Action, unknown>()

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(epicMiddleware),
})

epicMiddleware.run(rootEpic)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
