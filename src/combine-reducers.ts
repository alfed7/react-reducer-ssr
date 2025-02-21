import { Reducer } from "react";

export type RootState<S> = {[key: string]: S}

export type StateFromReducersMapObject<M> = M[keyof M] extends
  | Reducer<any, any>
  | undefined
  ? {
      [P in keyof M]: M[P] extends Reducer<infer S, any> ? S : never
    }
  : never

export type ReducerFromReducersMapObject<M> = M[keyof M] extends
  | Reducer<any, any>
  | undefined
  ? M[keyof M]
  : never

export type ActionFromReducer<R> = R extends Reducer<any, infer A>
  ? A
  : never

export type ActionFromReducersMapObject<M> = ActionFromReducer<
  ReducerFromReducersMapObject<M>
>

export function combineReducers<M>(
  reducers: M
): M[keyof M] extends Reducer<any, any> | undefined
  ? Reducer<
      StateFromReducersMapObject<M>,
      ActionFromReducersMapObject<M>
    >
  : never
export function combineReducers<S extends Record<string, any>, A>(reducers: {[key: string]: Reducer<S, A>}) {
  return (rootState: S, action: A): S => {
    rootState = rootState || {}
    let wasChanged = false;
    Object.keys(reducers).forEach(k => {
      const nextReducer = reducers[k];
      if(nextReducer) {
        const nextState = nextReducer(rootState[k] || {}, action);
        if(nextState !== rootState[k]) {
          (rootState as Record<string, any>)[k] = nextState;
          wasChanged = true;
        }
      }
    });
    return {...rootState};
  }
}
