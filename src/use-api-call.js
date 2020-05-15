import { useEffect, useReducer } from 'react';
import { createSlice } from '@reduxjs/toolkit';

const apiCallSlice = createSlice({
  name: 'apiCall',
  reducers: {
    callBegan: (state) => ({ ...state, isProcessing: true, hasError: false }),
    callSuccess: (state, action) => ({
      ...state,
      isProcessing: false,
      hasError: false,
      data: action.payload,
    }),
    callFailed: (state) => ({ ...state, isProcessing: false, hasError: true }),
  },
});
const { callBegan, callSuccess, callFailed } = apiCallSlice.actions;

export const useApiCall = (apiServiceCall, initialData) => {
  const initialState = {
    isProcessing: false,
    hasError: false,
    data: initialData,
  };
  const [apiCallState, dispatch] = useReducer(
    apiCallSlice.reducer,
    initialState
  );

  function useApiCallEffect() {
    let hostIsMounted = true;
    const safeDispatch = (action) => hostIsMounted && dispatch(action);

    const processApiCall = async () => {
      dispatch(callBegan());
      try {
        const result = await apiServiceCall();
        safeDispatch(callSuccess(result));
      } catch (error) {
        safeDispatch(callFailed());
      }
    };

    processApiCall();

    return () => (hostIsMounted = false);
  }

  useEffect(useApiCallEffect, [apiServiceCall]);

  return apiCallState;
};
