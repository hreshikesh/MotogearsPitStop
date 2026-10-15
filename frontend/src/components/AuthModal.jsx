// frontend/src/components/AuthModal.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event?.preventDefault();
    setError('');

    if (!form.password) return setError('Please fill all fields');
    if (!form.name.trim()) return setError('Name is required');
    if (!form.phone.trim()) return setError('Phone number is required');
    if (form.phone.replace(/\D/g, '').length < 10) {
      return setError('Please enter a valid phone number');
    }

    if (mode === 'register') {
      if (form.password.length < 6) {
        return setError('Password must be at least 6 characters');
      }
      if (!/[a-z]/.test(form.password)) {
        return setError('Password must include at least one lowercase letter');
      }
    }

    const result =
      mode === 'login'
        ? await login({
            name: form.name.trim(),
            phone: form.phone.trim(),
            password: form.password
          })
        : await register({
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim() || undefined,
            password: form.password
          });

    if (result.success) {
      await onSuccess?.();
      onClose();
    } else {
      setError(result.message || 'Something went wrong');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 px-4 py-4">
      <button
        type="button"
        aria-label="Close login modal"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-black p-5 shadow-2xl sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 text-xl text-white hover:text-[#e63946]"
          aria-label="Close"
        >
          x
        </button>

        <h2 className="mb-4 pr-8 text-xl font-bold text-white sm:text-2xl">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </h2>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <div className="mb-3">
          <label className="mb-1 block text-sm text-white">Full Name *</label>
          <input
            autoComplete="name"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white focus:border-red-500 focus:outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
          />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-sm text-white">Phone Number *</label>
          <input
            type="tel"
            autoComplete="tel"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white focus:border-red-500 focus:outline-none"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
        </div>

        {mode === 'register' && (
          <div className="mb-3">
            <label className="mb-1 block text-sm text-white">
              Email Address <span className="font-normal text-yellow-400">(optional)</span>
            </label>
            <input
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white focus:border-red-500 focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm text-white">Password *</label>
          <div className="relative">
            <input
              type={mode === 'login' && showPassword ? 'text' : 'password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className={`w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white focus:border-red-500 focus:outline-none ${
                mode === 'login' ? 'pr-12' : ''
              }`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
            />
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-3 flex items-center text-zinc-400 transition hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
          {mode === 'register' && (
            <p className="mt-1.5 text-[11px] leading-snug text-zinc-400 sm:text-xs">
              Min. 6 characters, one lowercase letter.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mb-3 w-full rounded-full bg-zinc-800 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
        </button>

        {mode === 'login' && (
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/forgot-password');
            }}
            className="mb-3 w-full text-center text-sm text-white underline transition hover:text-[#e63946]"
          >
            Forgot your password?
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError('');
          }}
          className={`w-full py-1 text-center text-sm font-medium transition-colors ${
            mode === 'register'
              ? 'text-yellow-400 hover:text-yellow-300'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {mode === 'login' ? 'Create account' : 'Already have an account? Log in'}
        </button>
      </form>
    </div>,
    document.body
  );
}
