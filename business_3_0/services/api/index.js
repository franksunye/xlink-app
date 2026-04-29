import * as mockApi from './mock.js';

const env = typeof process !== 'undefined' && process.env ? process.env : {};
const mode = env.VUE_APP_BUSINESS_3_API_MODE || 'mock';

export function getRuntimeMode() {
  return mode;
}

export const api = mockApi;
