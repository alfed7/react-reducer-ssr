import { Dispatch, ReactNode, Reducer, createContext, useContext, useMemo, useReducer } from 'react';
import { AnyAction, DispatchFunction, EmptyState, NullDispatch, SelectorFunction, wrapDispatchWithAsync } from '../state-manipulation';

const RootContext = createContext(null);
const DispatchContext = createContext(null);
const CustomParamsContext = createContext(null);

export interface IRootContextProps<T extends EmptyState> {
  children: ReactNode
  reducer: Reducer<T, AnyAction>
  customParams?: any
  initialState: T
}

export function RootContextProvider<T extends EmptyState>(
  { children, reducer, customParams, initialState }: IRootContextProps<T>) {
  const [root, dispatch] = useReducer<Reducer<T, AnyAction>>(
    reducer,
    initialState || reducer(initialState, { type: '@@INIT' })
  );

  const memoizedDispatch = useMemo(
    () => wrapDispatchWithAsync(dispatch, root as any, customParams),
    [dispatch, customParams]
  );

  return (
    <RootContext.Provider value={root as any}>
        <DispatchContext.Provider value={memoizedDispatch as any}>
          <CustomParamsContext.Provider value={customParams}>
            {children}
          </CustomParamsContext.Provider>
        </DispatchContext.Provider>
    </RootContext.Provider>
  );
}

export function useStateSelectorT<T>(selector: SelectorFunction<T>): any | null {
  const root = useContext(RootContext);
  if(selector && root) {
    return selector(root);
  }
  else {
    return root;
  }
}

export function useStateDispatch<T>(): Dispatch<T> {
  return useContext(DispatchContext) || NullDispatch;
}

export function useCustomParams(): any {
  return useContext(CustomParamsContext);
}

export function useLocalReducer<T extends EmptyState>(
  reducer: Reducer<T, AnyAction>,
  initialState: T = {} as T
): [T, DispatchFunction] {
  const [state, dispatch] = useReducer<Reducer<T, AnyAction>>(
    reducer,
    initialState || reducer(initialState, { type: '@@INIT' })
  );
  const customParams = useCustomParams();

  const memoizedDispatch = useMemo(
    () => wrapDispatchWithAsync(dispatch, state as any, customParams),
    [dispatch, customParams]
  );

  return [state, memoizedDispatch];
}