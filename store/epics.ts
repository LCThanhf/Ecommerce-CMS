import { type Epic, ofType, combineEpics } from 'redux-observable'
import { debounceTime, map } from 'rxjs/operators'
import { setSearchQuery, setDebouncedQuery } from './searchSlice'
import { setFilter, setDebouncedFilter } from './filterSlice'
import type { Action } from '@reduxjs/toolkit'

export const searchDebounceEpic: Epic<Action, Action, unknown> = (action$) =>
  action$.pipe(
    ofType(setSearchQuery.type),
    debounceTime(300),
    map((action) => setDebouncedQuery((action as ReturnType<typeof setSearchQuery>).payload)),
  )

export const filterDebounceEpic: Epic<Action, Action, unknown> = (action$) =>
  action$.pipe(
    ofType(setFilter.type),
    debounceTime(300),
    map((action) => setDebouncedFilter((action as ReturnType<typeof setFilter>).payload)),
  )

export const rootEpic = combineEpics(searchDebounceEpic, filterDebounceEpic)
