import { ENV } from '$env/static/private';

export function isProduction(): boolean {
  const env = ENV.toLowerCase();
  return env === 'production' || env === 'prod';
}

export function isLocal(): boolean {
  const env = ENV.toLowerCase();
  return env === 'local';
}

export function getENV(): string {
  return ENV
}

export function getProtocol(): string {
  if (isLocal()) {
    return 'http';
  }
  return 'https';
}
