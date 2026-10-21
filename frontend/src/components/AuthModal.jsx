// frontend/src/components/AuthModal.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../store/authStore';
import IndianPhoneInput from '@/components/IndianPhoneInput';
import { toIndianLocalDigits } from '@/utils/phoneUtils';

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

    if (!form.name.trim()) return setError('Full name is required');

    const phoneDigits = toIndianLocalDigits(form.phone);
    if (!phoneDigits) return setError('Phone number is required');
    if (phoneDigits.length < 10) {
      return setError('Please enter a valid 10-digit mobile number');
    }

    if (!form.password) return setError('Password is required');

    if (mode === 'register') {
      const email = form.email.trim();
      if (!email) return setError('Email is required');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return setError('Please enter a valid email address');
      }
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
            phone: phoneDigits,
            password: form.password
          })
        : await register({
            name: form.name.trim(),
            phone: phoneDigits,
            email: form.email.trim(),
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
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#CA8A04]/50 bg-[#FDE047] p-5 shadow-2xl sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 text-xl font-bold text-[#0a0a0a] transition hover:text-[#e63946]"
          aria-label="Close"
        >
          x
        </button>

        <h2 className="mb-4 pr-8 text-xl font-bold text-[#0a0a0a] sm:text-2xl">
          {mode === 'login' ? 'Login' : 'Create Account'}
        </h2>

        {error && <p className="mb-3 text-sm font-medium text-[#e63946]">{error}</p>}

        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium text-[#0a0a0a]">Full Name *</label>
          <input
            autoComplete="name"
            className="w-full rounded-lg border border-[#0a0a0a]/15 bg-white/90 px-3 py-2.5 text-[#0a0a0a] placeholder:text-gray-500 focus:border-[#e63946] focus:outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
          />
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-sm font-medium text-[#0a0a0a]">Phone Number *</label>
          <IndianPhoneInput
            value={form.phone}
            onChange={(phone) => setForm({ ...form, phone })}
            containerClassName="border-[#0a0a0a]/15 bg-white/90"
            prefixClassName="border-[#0a0a0a]/15 bg-[#F7F7F5]"
            inputClassName="text-[#0a0a0a] placeholder:text-gray-500"
          />
        </div>

        {mode === 'register' && (
          <div className="mb-3">
            <label className="mb-1 block text-sm font-medium text-[#0a0a0a]">Email Address *</label>
            <input
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-[#0a0a0a]/15 bg-white/90 px-3 py-2.5 text-[#0a0a0a] placeholder:text-gray-500 focus:border-[#e63946] focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-[#0a0a0a]">Password *</label>
          <div className="relative">
            <input
              type={mode === 'login' && showPassword ? 'text' : 'password'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className={`w-full rounded-lg border border-[#0a0a0a]/15 bg-white/90 px-3 py-2.5 text-[#0a0a0a] placeholder:text-gray-500 focus:border-[#e63946] focus:outline-none ${
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
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 transition hover:text-[#0a0a0a]"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
          {mode === 'register' && (
            <p className="mt-1.5 text-[11px] leading-snug text-[#0a0a0a]/65 sm:text-xs">
              Min. 6 characters, one lowercase letter.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mb-3 w-full rounded-full bg-[#e63946] py-2.5 text-sm font-bold text-white transition hover:bg-[#c1121f] disabled:opacity-50"
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
            className="mb-3 w-full text-center text-sm font-medium text-[#0a0a0a] underline transition hover:text-[#e63946]"
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
          className="w-full py-1 text-center text-sm font-medium text-[#0a0a0a]/75 transition-colors hover:text-[#e63946]"
        >
          {mode === 'login' ? 'Create account' : 'Already have an account? Log in'}
        </button>
      </form>
    </div>,
    document.body
  );
}
