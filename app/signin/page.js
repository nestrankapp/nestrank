'use client';

import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <main className="page-shell">
      <section className="panel" style={{ maxWidth: '520px', margin: '60px auto' }}>
        <p className="eyebrow">NestRank</p>
        <h1>Sign in</h1>
        <p className="helper">Use Google sign-in to save searches and keep your neighborhood rankings across sessions.</p>
        <div className="stack" style={{ marginTop: '16px' }}>
          <button className="primary-btn" onClick={() => signIn('google', { callbackUrl: '/' })}>Continue with Google</button>
        </div>
      </section>
    </main>
  );
}
