import { env } from '$env/dynamic/private';
import { type ActionCodeSettings } from 'firebase/auth';

export const actionCodeSettings = {
  url: `${env.ORIGIN}/auth/email`,
  handleCodeInApp: true,
} satisfies ActionCodeSettings;
