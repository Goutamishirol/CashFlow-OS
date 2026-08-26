import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      window.history.replaceState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm title="Welcome back" onSubmit={submit} error={error} loading={loading}>
    <Field label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
    <Field label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
    <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
    <p className="auth-switch">New to CashFlow OS? <a href="/signup">Create an account</a></p>
  </AuthForm>;
}

function Field({ label, type, value, onChange }) {
  return <div className="form-group"><label className="form-label">{label}</label><input className="form-input" required type={type} value={value} onChange={(event) => onChange(event.target.value)} /></div>;
}

function AuthForm({ title, onSubmit, error, loading, children }) {
  return <main className="auth-page"><section className="auth-card"><div className="sidebar-brand-title">CashFlow OS</div><h1>{title}</h1>{error && <div className="auth-error">{error}</div>}<form onSubmit={onSubmit}>{children}</form></section></main>;
}
