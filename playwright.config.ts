import { defineConfig } from '@playwright/test';

/**
 * BBC Theme E2E Tests
 * 
 * To test the PREVIEW theme (not yet published):
 * 1. Log into Shopify admin in a browser
 * 2. Copy the session cookie or use browser context
 * 3. Run: BASE_URL="https://bamboobicycleclub.org/?preview_theme_id=191768756598" npm test
 * 
 * To test the LIVE site (current Palo Alto theme):
 * Run: BASE_URL="https://bamboobicycleclub.org" npm test
 * 
 * Default: Uses live site since preview requires auth
 */
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'https://bamboobicycleclub.org',
    trace: 'retain-on-failure',
    extraHTTPHeaders: {
      'Accept-Language': 'en-GB,en;q=0.9',
    },
  },
  testDir: './tests',
  retries: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
});
