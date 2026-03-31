import { type Epic, ofType } from 'redux-observable'
import { debounceTime, map } from 'rxjs/operators'
import { setSearchQuery, setDebouncedQuery } from './searchSlice'
import type { Action } from '@reduxjs/toolkit'

export const searchDebounceEpic: Epic<Action, Action, unknown> = (action$) =>
  action$.pipe(
    ofType(setSearchQuery.type),
    debounceTime(300),
    map((action) => setDebouncedQuery((action as ReturnType<typeof setSearchQuery>).payload)),
  )
