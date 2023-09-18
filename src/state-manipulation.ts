import { Dispatch, Reducer } from 'react';
export interface Action<T = any> {
  type: T
}
export interface AnyAction extends Action {
  [extraProps: string]: any
}
export type EmptyState = Record<string, never> | {};
export type SelectorFunction<T> = (root: T) => any | null
export type DispatchFunction = (action: AnyAction) => void

export interface TypedUseSelectorHook<TState> {
  <TSelected>(
    selector: (state: TState) => TSelected
  ): TSelected
  <Selected = unknown>(
    selector: (state: TState) => Selected
  ): Selected
}

export interface IStateStore<T> {
  root: T
  dispatch: DispatchFunction
}
export function createServerStore<T>(
  reducer: Reducer<T, AnyAction>, initialState?: T): IStateStore<T> {
  const ssrDispatch = (action: AnyAction) => {
    store.root = reducer(store.root, action);
  };
  const store: IStateStore<T> = { root: initialState || {} as any, dispatch: wrapDispatchWithAsync(ssrDispatch) };
  return store;
}

export function NullDispatch<T>(s: T) {}

export function isPromise(v: any): v is Promise<any> { 
  return v && typeof v.then === 'function';
}

export function wrapDispatchWithAsync<T>(dispatch: Dispatch<T>) {
  return (nextState: Promise<T> | T): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      if(isPromise(nextState)) {
        nextState
          .then((s: T) => {
            dispatch(s);
            resolve();
          })
          .catch((err: any) => reject(err));
      }
      else {
        dispatch(nextState);
        resolve();
      }
    });
  }
}