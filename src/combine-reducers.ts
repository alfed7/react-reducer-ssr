import { produce } from "immer";
import { Reducer } from "react";

export type RootState<S> = {[key: string]: S}
export type ImmerReducer<S, A> = (s: S, a: A) => void

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
export function combineReducers<S extends Record<string, any>, A>(reducers: {[key: string]: ImmerReducer<S, A>}) {
  return (rootState: S, action: A): S => {
    rootState = rootState || {}
    const rootStateUpdated = {...rootState};
    Object.keys(reducers).forEach(k => {
      const nextReducer = reducers[k];
      if(nextReducer) {
        if(!(k in rootState)) (rootState as any)[k] = {}
        const nextState = produce(rootState[k] || {}, (draft: any) => {
          nextReducer(draft || {}, action);
        });
        (rootStateUpdated as Record<string, any>)[k] = nextState
      }}
    );
    return rootStateUpdated;
  }
}
