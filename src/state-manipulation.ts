import { Dispatch, Reducer } from 'react';
export interface Action<T = any> {
  type: T
}
export interface AnyAction extends Action {
  [extraProps: string]: any
}
export type EmptyState = Record<string, never> | {};
export type SelectorFunction<T> = (root: T) => any | null
export type ActionFunction = (dispatch: DispatchFunction, state: any, extraArgument: any) 
  => Promise<AnyAction> | Promise<void> | AnyAction | void | any
export interface ActionCreator<A, P extends any[] = any[]> {
  (...args: P): A | Promise<void> | any
}
export type DispatchFunction = ((action: AnyAction 
  | Promise<Action> | ActionCreator<Action> | any) => void)

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
  services?: any
  dispatch: DispatchFunction
}
export function createServerStore<T>(
  reducer: Reducer<T, AnyAction>, customParams?: any, initialState?: T): IStateStore<T> {
  const ssrDispatch = (action: AnyAction) => {
    store.root = reducer(store.root, action);
  };
  const store: IStateStore<T> = { 
    root: initialState || {} as any,
    dispatch: wrapDispatchWithAsync(ssrDispatch, customParams)
  };
  return store;
}

export function NullDispatch<T>(s: T) {}

export function isPromise(v: any): v is Promise<any> { 
  return v && typeof v.then === 'function';
}

export function wrapDispatchWithAsync<T>(dispatch: Dispatch<T>, customParams?: any) {
  return (nextState: Promise<T> | T): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      if(isPromise(nextState)) {
        nextState
          .then((s: T) => {
            if(typeof s === 'function') {
              const r = (s as ActionFunction)(dispatch as DispatchFunction, {}, customParams);
              if(isPromise(r)) {
                r
                  .then(((s: T) => {
                    //dispatch(s);
                    resolve();
                  }) as any)
                  .catch((err: any) => reject(err));
              }
              else {
                //dispatch(r as T);
                resolve();
              }
            }
            else {
              dispatch(s);
              resolve();
            }
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