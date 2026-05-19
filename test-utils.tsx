import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { rootReducer } from '@/store/rootReducer'
import type { RootReducerState } from '@/store/rootReducer'

type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T

/**
 * Creates a real Redux store pre-loaded with optional partial state.
 * Does NOT include the epic middleware to keep unit tests synchronous.
 */
export function createTestStore(preloadedState?: DeepPartial<RootReducerState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootReducerState | undefined,
  })
}

export type TestStore = ReturnType<typeof createTestStore>

interface RenderWithStoreOptions extends RenderOptions {
  preloadedState?: DeepPartial<RootReducerState>
  store?: TestStore
}

/**
 * Custom render that wraps the component in a Redux Provider.
 * Returns the store alongside all @testing-library utilities.
 */
export function renderWithStore(
  ui: React.ReactElement,
  { preloadedState, store = createTestStore(preloadedState), ...renderOptions }: RenderWithStoreOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
