'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaSignInAlt } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default function DashboardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('staff@parquehipico.cl');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || 'No se pudo iniciar sesión');
        return;
      }

      router.replace('/dashboard');
      router.refresh();
    } catch {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center">
            <FaLock className="text-xl" />
          </div>
          <p className="text-amber-500 text-xs font-bold uppercase tracking-[0.24em]">Parque Hípico La Montaña</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">Acceso al dashboard</h1>
          <p className="mt-2 text-base text-slate-400">Ingresa con tu correo y contraseña de trabajo.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-300 mb-2">
              Correo
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              autoComplete="email"
              required
              disabled={loading}
              className="w-full min-h-12 rounded-xl bg-slate-800 border border-slate-700 text-white px-4 text-base outline-none focus:border-amber-500 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-slate-300 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
              className="w-full min-h-12 rounded-xl bg-slate-800 border border-slate-700 text-white px-4 text-base outline-none focus:border-amber-500 disabled:opacity-60"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-12 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-extrabold transition-colors flex items-center justify-center gap-2"
          >
            <FaSignInAlt />
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
