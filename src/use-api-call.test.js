import React from 'react';
import { render, screen } from '@testing-library/react';
import UseApiCallTestHarness from 'UseApiCallTestHarness';
import { apiCall } from 'api';

jest.mock('api');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('useApiCall', () => {
  test('sets loading state when apiCall begins', async () => {
    const pendingPromise = new Promise((resolve) =>
      setTimeout(() => resolve('[]'), 100)
    );
    apiCall.mockReturnValue(pendingPromise);

    render(<UseApiCallTestHarness />);

    const loadingMessage = await screen.findByText('loading');
    expect(loadingMessage).toBeVisible();
  });

  test('turns off loading state and makes api return data available when apiCall is successful', async () => {
    const pendingPromise = new Promise((resolve) =>
      setTimeout(() => resolve(['one']), 100)
    );
    apiCall.mockReturnValue(pendingPromise);

    render(<UseApiCallTestHarness />);

    const dataItem = await screen.findByText('one');
    expect(dataItem).toBeVisible();
    expect(screen.queryByText('loading')).toBeNull();
  });

  test('turns loading state off and error state on when apiCall throws', async () => {
    const pendingPromise = new Promise((resolve, reject) =>
      setTimeout(() => reject(Error('broken')), 100)
    );
    apiCall.mockReturnValue(pendingPromise);

    render(<UseApiCallTestHarness />);

    const errorMessage = await screen.findByText('error');
    expect(errorMessage).toBeVisible();
    expect(screen.queryByText('loading')).toBeNull();
  });
});
