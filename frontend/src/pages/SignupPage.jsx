import React, { useState } from 'react';
import { api } from '../api/client';

export function SignupPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.signup(form);
      window.history.replaceState({}, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      setError(err.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return <main className="auth-page"><section className="auth-card"><div className="sidebar-brand-title">CashFlow OS</div><h1>Create your workspace</h1>{error && <div className="auth-error">{error}</div>}<form onSubmit={submit}>
    <div className="form-group"><label className="form-label">Full name</label><input className="form-input" required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /></div>
    <div className="form-group"><label className="form-label">Email</label><input className="form-input" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
    <div className="form-group"><label className="form-label">Password</label><input className="form-input" required minLength="8" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div>
    <div className="form-group"><label className="form-label">Confirm password</label><input className="form-input" required type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /></div>
    <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
    <p className="auth-switch">Already registered? <a href="/login">Sign in</a></p>
  </form></section></main>;
}
