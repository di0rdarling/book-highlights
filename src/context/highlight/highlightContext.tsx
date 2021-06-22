import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { getHighlights } from '../../integration/highlights';
import { Highlight } from '../../models/highlight';
import { HighlightStoreAction, highlightStoreReducer } from './highlightStoreReducer';


export type HighlightStore = Highlight[] | undefined;
export type HighlightStoreDispatch = (action: HighlightStoreAction) => void;

let HighlightStoreStateContext = createContext<HighlightStore | undefined>(undefined);
let HighlightStoreDispatchContext = createContext<HighlightStoreDispatch | undefined>(undefined);

export interface HighlightStoreProps {
  children?: React.ReactNode;
}

export function HighlightStoreProvider(props: HighlightStoreProps) {
  let { children } = props;
  let [state, dispatch] = useReducer(highlightStoreReducer, []);

  useEffect(() => {
    async function getUserHighlights() {
      try {
        let response = await getHighlights();
        if (response.status === 200 && response.data) {
          dispatch({
            type: 'set highlights',
            payload: response.data
          })
        }
      } catch (err) {
        console.log({ err });
      }
    }
    getUserHighlights();
  }, []);

  return (
    <HighlightStoreStateContext.Provider value={state}>
      <HighlightStoreDispatchContext.Provider value={dispatch}>
        {children}
      </HighlightStoreDispatchContext.Provider>
    </HighlightStoreStateContext.Provider>
  );
}

export function useHighlightStore(): [HighlightStore, HighlightStoreDispatch] {
  return [useHighlightStoreState(), useHighlightStoreDispatch()];
}

export function useHighlightStoreState() {
  const context = useContext(HighlightStoreStateContext);
  if (context === undefined) {
    throw new Error(
      "useHighlightStoreState must be used within a HighlightStoreProvider"
    );
  }
  return context;
}

export function useHighlightStoreDispatch() {
  const context = useContext(HighlightStoreDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useHighlightStoreDispatch must be used within a HighlightStoreProvider"
    );
  }
  return context;
}