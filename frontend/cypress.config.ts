import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
  },
  env: {
    apiUrl: 'http://localhost:8080/',
  },
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
});