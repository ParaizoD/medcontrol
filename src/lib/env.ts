export const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'MedControl',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '0.1.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  USE_MOCKS: import.meta.env.VITE_USE_MOCKS === 'true',
} as const;
