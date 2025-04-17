describe('JWT Helpers - config edge cases', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should throw an error if JWT_SECRET is not defined', () => {
    jest.doMock('../../../lib/config', () => ({
      config: {
        jwt: {
          secret: '',
          expiresIn: '1h',
        },
      },
    }));

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../../../lib/auth/jwt');
    }).toThrowError('JWT_SECRET is not defined in environment variables');
  });

  it('should throw an error if JWT_EXPIRES_IN is invalid', () => {
    jest.doMock('../../../lib/config', () => ({
      config: {
        jwt: {
          secret: 'testsecret',
          expiresIn: 'not-valid',
        },
      },
    }));

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('../../../lib/auth/jwt');
    }).toThrowError('Invalid JWT_EXPIRES_IN format: not-valid');
  });
});
