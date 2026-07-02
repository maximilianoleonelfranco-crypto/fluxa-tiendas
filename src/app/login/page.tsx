"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Verificar si hay una tienda en sesión o crear una de demostración activa para login
    const saved = localStorage.getItem('fluxa_current_store');
    if (saved) {
      const store = JSON.parse(saved);
      if (store.subscription_status !== 'active') {
        router.push('/subscription');
        return;
      }
      router.push('/dashboard');
    } else {
      // Si entra con cuenta demo
      localStorage.setItem('fluxa_current_store', JSON.stringify({
        id: "store-demo-101",
        name: "Panadería San José",
        slug: "panaderia-sanjose",
        whatsapp_number: "59894968558",
        email: email || "demo@fluxa.com",
        subscription_status: 'active'
      }));
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="max-w-md w-full glass-panel p-8 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-2xl text-gradient mb-2">
            <Store size={28} className="text-[var(--accent-cyan)]" /> Fluxa Tiendas
          </Link>
          <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Accede a tu panel de administración</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="tu@negocio.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full !mt-6 justify-center py-3 text-base shadow-lg"
          >
            Entrar al Panel <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
          ¿Aún no tienes tu tienda? <Link href="/register" className="text-cyan-400 hover:underline">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
}
