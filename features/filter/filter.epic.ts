import { type Epic, ofType } from 'redux-observable'
import { debounceTime, map } from 'rxjs/operators'
import type { Action } from '@reduxjs/toolkit'
import { setFilter, setDebouncedFilter } from './filter.slice'

export const filterDebounceEpic: Epic<Action, Action, unknown> = (action$) =>
  action$.pipe(
    ofType(setFilter.type),
    debounceTime(300),
    map((action) => setDebouncedFilter((action as ReturnType<typeof setFilter>).payload)),
  )
