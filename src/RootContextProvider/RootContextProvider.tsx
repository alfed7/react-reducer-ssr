import { Dispatch, ReactNode, Reducer, createContext, useContext, useReducer } from 'react';
import { AnyAction, EmptyState, NullDispatch, SelectorFunction, wrapDispatchWithAsync } from '../state-manipulation';

const RootContext = createContext(null);
const DispatchContext = createContext(null);

export interface IRootContextProps<T extends EmptyState> {
  children: ReactNode
  reducer: Reducer<T, AnyAction>
  initialState: T
}

export function RootContextProvider<T extends EmptyState>(
  { children, reducer, initialState }: IRootContextProps<T>) {
  const [root, dispatch] = useReducer<Reducer<T, AnyAction>>(
    reducer,
    initialState
  );

  return (
    <RootContext.Provider value={root as any}>
      <DispatchContext.Provider value={wrapDispatchWithAsync(dispatch) as any}>
        {children}
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
