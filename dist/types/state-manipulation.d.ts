import { Dispatch, Reducer } from 'react';
export interface Action<T = any> {
    type: T;
}
export interface AnyAction extends Action {
    [extraProps: string]: any;
}
export type EmptyState = Record<string, never> | {};
export type SelectorFunction<T> = (root: T) => any | null;
export type ActionFunction = (dispatch: DispatchFunction, state: any, extraArgument: any) => Promise<AnyAction> | Promise<void> | AnyAction | void | any;
export interface ActionCreator<A, P extends any[] = any[]> {
    (...args: P): A | Promise<void> | any;
}
export type DispatchFunction = ((action: AnyAction | Promise<Action> | ActionCreator<Action> | any) => void);
export interface TypedUseSelectorHook<TState> {
    <TSelected>(selector: (state: TState) => TSelected): TSelected;
    <Selected = unknown>(selector: (state: TState) => Selected): Selected;
}
export interface IStateStore<T> {
    root: T;
    services?: any;
    dispatch: DispatchFunction;
}
export declare function createServerStore<T>(reducer: Reducer<T, AnyAction>, services?: any, initialState?: T): IStateStore<T>;
export declare function NullDispatch<T>(s: T): void;
export declare function isPromise(v: any): v is Promise<any>;
export declare function wrapDispatchWithAsync<T>(dispatch: Dispatch<T>, services?: any): (nextState: Promise<T> | T) => Promise<void>;
//# sourceMappingURL=state-manipulation.d.ts.map