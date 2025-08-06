import { test, expect } from '@playwright/test';

test('Tesing users API', async ({ request }) => {
  const response = await request.get('https://dummyjson.com/users');
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.users.length).toBeGreaterThan(0);
  expect(data.users[0].firstName).toEqual("Emily")
});