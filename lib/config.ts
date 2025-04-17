export const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key] || fallback;
  if (!value) throw new Error(`Missing env variable: ${key}`);
  return value;
};

export const config = {
  jwt: {
    secret: getEnvVar('JWT_SECRET'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'), // e.g., '7d'
  },
  env: getEnvVar('NODE_ENV', 'development'),
};

export const isProduction = config.env === 'production';
export const isDevelopment = config.env === 'development';
export const isTest = config.env === 'test';
