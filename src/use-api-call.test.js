import React from 'react';
import { render, screen } from '@testing-library/react';
import { useApiCall } from 'use-api-call';

const UseApiCallTestHarness = ({ apiCall }) => {
  const { isProcessing, hasError, data, error } = useApiCall(apiCall, []);

  if (isProcessing) {
    return <div>loading</div>;
  }

  if (hasError) {
    return (
      <div>
        error <span>{error.message}</span>
      </div>
    );
  }

  return (
    <div>
      {data.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  );
};

describe('useApiCall', () => {
  test('sets loading state and then renders data when apiCall succeeds', async () => {
    const apiCall = jest.fn().mockResolvedValue(['a', 'b']);

    render(<UseApiCallTestHarness apiCall={apiCall} />);

    const loadingMessage = await screen.findByText('loading');
    expect(loadingMessage).toBeVisible();

    const dataItem = await screen.findByText('a');
    expect(dataItem).toBeVisible();
    expect(screen.queryByText('loading')).toBeNull();
  });

  test('sets loading state and then sets error state when apiCall throws', async () => {
    const apiCall = jest.fn().mockRejectedValue(Error('broken'));

    render(<UseApiCallTestHarness apiCall={apiCall} />);

    const loadingMessage = await screen.findByText('loading');
    expect(loadingMessage).toBeVisible();

    const errorDisplay = await screen.findByText('error');
    expect(errorDisplay).toBeVisible();
    expect(screen.queryByText('loading')).toBeNull();
  });

  test('captures error object when apiCall throws', async () => {
    const thrownErrorMessage = 'all is borked';
    const apiCall = jest.fn().mockRejectedValue(Error(thrownErrorMessage));

    render(<UseApiCallTestHarness apiCall={apiCall} />);

    const loadingMessage = await screen.findByText('loading');
    expect(loadingMessage).toBeVisible();

    const errorDisplay = await screen.findByText('error');
    expect(errorDisplay).toBeVisible();
    const errorMessage = await screen.findByText(thrownErrorMessage);
    expect(errorMessage).toBeVisible();
  });
});
