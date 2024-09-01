import { env } from '$env/dynamic/private';
import { getProtocol } from '$lib';
import { type ActionCodeSettings } from 'firebase/auth';

export const actionCodeSettings = {
  url: `${getProtocol()}://${env.ORIGIN}/auth/email`,
  handleCodeInApp: true,
} satisfies ActionCodeSettings;
