'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE_NAME, createSessionCookieValue } from '@/lib/auth';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 días

export async function login(formData: FormData) {
  const password = String(formData.get('password') ?? '');
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
    redirect('/admin/login?error=1');
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect('/admin');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/admin/login');
}
