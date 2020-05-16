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

  return data.map((item) => <div key={item}>{item}</div>);
};

describe('useApiCall', () => {
  test('sets loading state when apiCall begins', async () => {
    const apiCall = jest
      .fn()
      .mockReturnValue(
        new Promise((resolve) => setTimeout(() => resolve([]), 50))
      );

    render(<UseApiCallTestHarness apiCall={apiCall} />);

    const loadingMessage = await screen.findByText('loading');
    expect(loadingMessage).toBeVisible();
  });

  test('turns off loading state and makes api return data available when apiCall is successful', async () => {
    const apiCall = jest
      .fn()
      .mockReturnValue(
        new Promise((resolve) => setTimeout(() => resolve(['one']), 50))
      );

    render(<UseApiCallTestHarness apiCall={apiCall} />);

    const dataItem = await screen.findByText('one');
    expect(dataItem).toBeVisible();
    expect(screen.queryByText('loading')).toBeNull();
  });

  test('turns loading state off and error state on when apiCall throws', async () => {
    const apiCall = jest
      .fn()
      .mockReturnValue(
        new Promise((_, reject) =>
          setTimeout(() => reject(Error('broken')), 50)
        )
      );

    render(<UseApiCallTestHarness apiCall={apiCall} />);

    const errorMessage = await screen.findByText('error');
    expect(errorMessage).toBeVisible();
    expect(screen.queryByText('loading')).toBeNull();
  });

  test('captures error object when apiCall throws', async () => {
    const apiCall = jest
      .fn()
      .mockReturnValue(
        new Promise((_, reject) =>
          setTimeout(() => reject(Error('expected error message')), 50)
        )
      );

    render(<UseApiCallTestHarness apiCall={apiCall} />);

    const errorMessage = await screen.findByText('expected error message');
    expect(errorMessage).toBeVisible();
    expect(screen.queryByText('loading')).toBeNull();
  });
});
