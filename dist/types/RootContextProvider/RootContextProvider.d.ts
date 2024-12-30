import { Dispatch, ReactNode, Reducer } from 'react';
import { AnyAction, DispatchFunction, EmptyState, SelectorFunction } from '../state-manipulation';
export interface IRootContextProps<T extends EmptyState> {
    children: ReactNode;
    reducer: Reducer<T, AnyAction>;
    customParams?: any;
    initialState: T;
}
export declare function RootContextProvider<T extends EmptyState>({ children, reducer, customParams, initialState }: IRootContextProps<T>): import("react").JSX.Element;
export declare function useStateSelectorT<T>(selector: SelectorFunction<T>): any | null;
export declare function useStateDispatch<T>(): Dispatch<T>;
export declare function useCustomParams(): any;
export declare function useLocalReducer<T extends EmptyState>(reducer: Reducer<T, AnyAction>, initialState?: T): [T, DispatchFunction];
//# sourceMappingURL=RootContextProvider.d.ts.map