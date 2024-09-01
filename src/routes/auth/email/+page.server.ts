import { invalidate } from '$app/navigation';
import { auth } from '$lib/server/auth/firebase';
import { actionCodeSettings } from '$lib/server/auth/firebase/emailActionCode.js';
import { isSignedIn } from '$lib/server/auth';
import { emailSignIn } from '$lib/server/data/auth.js';
import { error, redirect } from '@sveltejs/kit';
import { getAdditionalUserInfo, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, type AdditionalUserInfo } from "firebase/auth";

const emailCookieName = 'emailForSignIn';

export async function load({ url, cookies, locals }) {
  if (isSignedIn(locals)) {
    redirect(303, '/');
  }

  if (!isSignInWithEmailLink(auth, url.href)) {
    redirect(303, '/auth');
  }

  const email = cookies.get(emailCookieName);
  if (!email) {
    console.log('no email');
    return;
  }

  let userInfo: AdditionalUserInfo;
  try {
    const credentials = await signInWithEmailLink(auth, email, url.href);
    
    cookies.delete(emailCookieName, { path: '/' });

    userInfo = getAdditionalUserInfo(credentials)!;
    
    const sessionCookie = await emailSignIn(email);
    if (!sessionCookie) {
      return;
    }

    const { path, domain, expires, httpOnly, sameSite, secure } = sessionCookie.attributes;
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: path || '/',
      domain,
      expires,
      httpOnly,
      sameSite,
      secure
    });

  } catch (ex: unknown) {
    const e = ex as { code: number, message: string }
    error(404, { message: e.code+" "+e.message });
  }

  const redirectPath = userInfo.isNewUser ? 'profile' : '/';

  redirect(303, redirectPath);
}

export const actions = {
  "send": async ({ request, cookies }) => {
    const data = await request.formData();

    const email = data.get('email')!.toString();

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      cookies.set(emailCookieName, email, { path: '' });
    } catch (ex: unknown) {
      const e = ex as { code: number, message: string }

      const errorCode = e.code;
      const errorMessage = e.message;
      console.log(errorCode, errorMessage);
    } 

    return {
      email: email,
    };
  },

  "set": async ({ request, cookies }) => {
    const data = await request.formData();

    const email = data.get('email')?.toString();
    if (email) {
      cookies.set(emailCookieName, email, { path: '/' });
      await invalidate('/auth/email');
    }
  }
}
