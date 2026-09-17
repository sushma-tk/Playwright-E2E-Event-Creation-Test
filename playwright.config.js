// @ts-check
import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
  testDir: './tests',
  timeout : 100 * 1000,
  expect : {timeout : 6000,},
  reporter: 'html',
  
  use: {
    browserName : 'chromium',
    headless : false,
    //navigationTimeout: 60000,
    screenshot : 'on',
    // trace : 'on',
    trace : 'retain-on-failure'
  },

});

