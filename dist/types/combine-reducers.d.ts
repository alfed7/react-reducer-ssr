import { Reducer } from "react";
export type RootState<S> = {
    [key: string]: S;
};
export type StateFromReducersMapObject<M> = M[keyof M] extends Reducer<any, any> | undefined ? {
    [P in keyof M]: M[P] extends Reducer<infer S, any> ? S : never;
} : never;
export type ReducerFromReducersMapObject<M> = M[keyof M] extends Reducer<any, any> | undefined ? M[keyof M] : never;
export type ActionFromReducer<R> = R extends Reducer<any, infer A> ? A : never;
export type ActionFromReducersMapObject<M> = ActionFromReducer<ReducerFromReducersMapObject<M>>;
export declare function combineReducers<M>(reducers: M): M[keyof M] extends Reducer<any, any> | undefined ? Reducer<StateFromReducersMapObject<M>, ActionFromReducersMapObject<M>> : never;
//# sourceMappingURL=combine-reducers.d.ts.map