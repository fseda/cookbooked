import { env as p_env } from '$env/dynamic/public';
import { auth } from '$lib/server/auth/firebase';
import { actionCodeSettings } from '$lib/server/auth/firebase/emailActionCode.js';
import { emailSignIn } from '$lib/server/data/auth.js';
import { error, redirect } from '@sveltejs/kit';
import { getAdditionalUserInfo, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, type AdditionalUserInfo } from "firebase/auth";
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const emailCookieName = 'emailForSignIn';

const schema = z.object({
  email: z.string().email(),
});

export async function load({ url, cookies }) {
  const form = await superValidate(zod(schema));

  if (!isSignInWithEmailLink(auth, url.href)) {
    redirect(303, '/auth');
  }

  const email = cookies.get(emailCookieName);
  if (!email) {
    return { form };
  }

  let userInfo: AdditionalUserInfo;
  try {
    const credentials = await signInWithEmailLink(auth, email, url.href);
    
    cookies.delete(emailCookieName, { path: '/' });

    userInfo = getAdditionalUserInfo(credentials)!;
    
    const sessionCookie = await emailSignIn(email);
    if (!sessionCookie) {
      return { form };
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
    const form = await superValidate(request, zod(schema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const email = form.data.email;

    try {
      await sendSignInLinkToEmail(auth, email.toString(), actionCodeSettings);
      cookies.set(emailCookieName, email.toString(), { 
        path: '',
        domain: p_env.PUBLIC_DOMAIN,
      });
    } catch (ex: unknown) {
      const e = ex as { code: number, message: string }

      const errorCode = e.code;
      const errorMessage = e.message;
      console.log(errorCode, errorMessage);
    } 

    return { form };
  },

  "set": async ({ request, cookies }) => {

    console.log('set')
    const form = await superValidate(request, zod(schema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const email = form.data.email;

    if (email) {
      cookies.set(emailCookieName, email, { 
        path: '',
        domain: p_env.PUBLIC_DOMAIN,
      });
    }

    return { form };
  }
}
