import { test, expect } from '@playwright/test';

test.describe.serial('Auth routes', () => {
  const timestamp = Date.now();
  const testUser = {
    name: 'Test User',
    email: `testuser+${timestamp}@example.com`,
    password: 'StrongPassword123!',
    role: 'CUSTOMER',
  };


  test('should register a new user', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: testUser,
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.user.email).toBe(testUser.email);
  });

  test('should login with registered user', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.user.email).toBe(testUser.email);
  });

  test('should return current user after login', async ({ request }) => {
    const loginRes = await request.post('/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    const cookie = loginRes.headers()['set-cookie'];
    expect(cookie).toBeTruthy();

    const meRes = await request.get('/api/auth/me', {
      headers: {
        cookie,
      },
    });

    const meBody = await meRes.json();
    expect(meBody.user.email).toBe(testUser.email);
  });

  test('should logout the user', async ({ request }) => {
    const loginRes = await request.post('/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    const cookie = loginRes.headers()['set-cookie'];

    const logoutRes = await request.post('/api/auth/logout', {
      headers: {
        cookie,
      },
    });
    expect(logoutRes.status()).toBe(200);
  });



  test.afterAll(async ({ request }) => {
    await request.delete(`/api/testing/users/${encodeURIComponent(testUser.email)}`);
  });
});
