import React from 'react';
import { useApiCall } from 'use-api-call';
import { apiCall } from 'api';

const UseApiCallTestHarness = () => {
  const { isProcessing, hasError, data } = useApiCall(apiCall, []);

  if (isProcessing) {
    return <div>loading</div>;
  }

  if (hasError) {
    return <div>error</div>;
  }

  return data.map((item) => <div key={item}>{item}</div>);
};

export default UseApiCallTestHarness;
