'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import styles from './LoginPage.module.css';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    if (!email || !password) {
      alert('Email and password are required');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = '/dashboard';
  }

  return (
    <div className={styles.page}>
      {/* Left image section */}
      <div className={styles.leftPanel} />

      {/* Right login section */}
      <div className={styles.rightPanel}>
        <form onSubmit={login} className={styles.card}>
          {/* Logo */}
          <div className={styles.logoWrapper}>
            <img
              src="/LOGO-W.png"
              alt="Company logo"
              className={styles.logo}
            />
          </div>

          <h2 className={styles.title}>Welcome</h2>
          <p className={styles.subtitle}>
            Sign in to your admin account
          </p>

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                name="email"
                className={styles.input}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={styles.input}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitButton}>
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
