'use client';

import { signIn, signOut } from 'next-auth/react';

export default function AuthButtons({ session }) {
  if (session?.user) {
    return (
      <div className="top-actions">
        <span className="badge">{session.user.name || session.user.email}</span>
        <button className="ghost-btn" onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="top-actions">
      <button className="ghost-btn" onClick={() => signIn('google')}>Sign in with Google</button>
    </div>
  );
}
