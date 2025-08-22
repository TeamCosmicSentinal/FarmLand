import React from 'react';
import LoginPage from './LoginPage';

export default function LoginPageWrapper() {
  return (
    <section className="bg-gradient-to-br from-sky via-background to-sky-light text-olive rounded-2xl shadow-lg min-h-[40vh]">
      <div className="max-w-6xl mx-auto pt-4 pb-6 px-4 md:px-8">
        <div className="mb-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center justify-center gap-3 mb-2">
            <span role="img" aria-label="login" className="text-4xl md:text-5xl">🔐</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-leaf to-accent">Login</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">Sign in to your account to access personalized agricultural insights.</p>
        </div>
        <div className="divider w-1/2 mx-auto mb-6" />
        <LoginPage />
      </div>
    </section>
  );
}