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
