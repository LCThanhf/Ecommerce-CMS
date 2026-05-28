import { type Epic, ofType } from 'redux-observable'
import { debounceTime, map } from 'rxjs/operators'
import type { Action } from '@reduxjs/toolkit'
import { setSearchQuery, setDebouncedQuery } from './search.slice'

export const searchDebounceEpic: Epic<Action, Action, unknown> = (action$) =>
  action$.pipe(
    ofType(setSearchQuery.type),
    debounceTime(300),
    map((action) => setDebouncedQuery((action as ReturnType<typeof setSearchQuery>).payload)),
  )
