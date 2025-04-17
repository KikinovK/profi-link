describe('config.ts', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('getEnvVar should return env value if present', async () => {
    process.env.TEST_KEY = 'test_value';

    const { getEnvVar } = await import('@/lib/config');
    expect(getEnvVar('TEST_KEY')).toBe('test_value');
  });

  it('getEnvVar should return fallback if env is not present', async () => {
    delete process.env.TEST_KEY;

    const { getEnvVar } = await import('@/lib/config');
    expect(getEnvVar('TEST_KEY', 'fallback_value')).toBe('fallback_value');
  });

  it('getEnvVar should throw if neither env nor fallback is provided', async () => {
    delete process.env.TEST_KEY;

    const { getEnvVar } = await import('@/lib/config');
    expect(() => getEnvVar('TEST_KEY')).toThrow('Missing env variable: TEST_KEY');
  });

  it('should throw if JWT_SECRET is not defined', async () => {
    delete process.env.JWT_SECRET;

    await expect(import('@/lib/config')).rejects.toThrow('Missing env variable: JWT_SECRET');
  });

  it('should use fallback value if JWT_EXPIRES_IN is not defined', async () => {
    process.env.JWT_SECRET = 'secret';
    delete process.env.JWT_EXPIRES_IN;

    const { config } = await import('@/lib/config');
    expect(config.jwt.expiresIn).toBe('7d');
  });

  it('should return correct env flags', async () => {
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_EXPIRES_IN = '3d';
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
    });

    const { isProduction, isDevelopment, isTest } = await import('@/lib/config');

    expect(isProduction).toBe(true);
    expect(isDevelopment).toBe(false);
    expect(isTest).toBe(false);
  });
});
