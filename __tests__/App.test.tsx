/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import {AppProvider, useAppContext} from '../src/context/AppContext';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});

test('requires matching passwords before creating an account', async () => {
  let signup: (fullName: string, email: string, password: string, confirmPassword: string) => Promise<boolean>;
  let authMessage = '';

  function TestConsumer() {
    const context = useAppContext();
    signup = context.signup;
    authMessage = context.authMessage;
    return null;
  }

  let result = false;

  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(
      <AppProvider>
        <TestConsumer />
      </AppProvider>,
    );

    result = await signup('Test User', 'test@example.com', 'abc123', 'different');
  });

  expect(result).toBe(false);
  expect(authMessage).toBe('Passwords do not match.');
});

test('sends feeling ids in the expected word-for-feeling payload', async () => {
  const originalFetch = global.fetch;
  const mockedFetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    headers: {get: () => 'application/json'},
    json: async () => ({check_id: 99, feeling_ids: [7], cards: []}),
  });

  global.fetch = mockedFetch as typeof fetch;

  try {
    const {getRecommendations} = await import('../src/api/devotions');
    await getRecommendations([7], 'token-123');

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    const requestBody = JSON.parse((mockedFetch.mock.calls[0] as [RequestInfo, RequestInit])[1].body as string);
    expect(requestBody).toEqual([7]);
  } finally {
    global.fetch = originalFetch;
  }
});
