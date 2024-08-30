import { ENV } from '$env/static/private';

export function isProduction(): boolean {
  const env = ENV.toLowerCase();
  return env === 'production' || env === 'prod';
}

export function getENV(): string {
  return ENV
}
