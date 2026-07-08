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

    const inputUser = email.trim();
    const inputPass = password.trim();

    // 0. CUENTA VIP ADMIN PARA PROBAR TODAS LAS TIENDAS CON PERMISOS TOTALES ACTIVOS
    if (inputUser.toLowerCase() === 'admin' || inputUser.toLowerCase() === 'admin@fluxa.com') {
      if (inputPass !== 'Admin' && inputPass.toLowerCase() !== 'admin') {
        setError('Contraseña incorrecta para el usuario admin. Contraseña requerida: Admin');
        return;
      }

      const allStoresRaw = localStorage.getItem('fluxa_all_stores');
      let allStores: any[] = allStoresRaw ? JSON.parse(allStoresRaw) : [];

      // Buscar o crear la tienda VIP Admin de prueba con suscripción activa PRO
      let adminStore = allStores.find(s => s.email?.toLowerCase() === 'admin' || s.id === 'store-admin-vip');
      if (!adminStore) {
        adminStore = {
          id: "store-admin-vip",
          name: "Tienda VIP Admin (Tester)",
          slug: "tienda-admin",
          whatsapp_number: "59894968558",
          email: "admin",
          password: "Admin",
          subscription_status: 'active',
          plan_type: 'pro',
          billing_cycle: 'annual',
          template_id: 'modern',
          theme_color: '#00D7C0',
          font_family: 'modern',
          is_admin_tester: true
        };
        allStores.push(adminStore);
      } else {
        adminStore.subscription_status = 'active';
        adminStore.plan_type = 'pro';
        adminStore.is_admin_tester = true;
      }

      localStorage.setItem('fluxa_all_stores', JSON.stringify(allStores));
      localStorage.setItem('fluxa_current_store', JSON.stringify(adminStore));

      router.push('/dashboard');
      return;
    }

    // 1. Buscar en el catálogo global de tiendas registradas
    const allStoresRaw = localStorage.getItem('fluxa_all_stores');
    const allStores: any[] = allStoresRaw ? JSON.parse(allStoresRaw) : [];
    
    const foundStore = allStores.find(s => s.email?.toLowerCase() === inputUser.toLowerCase());

    if (foundStore) {
      // Verificar contraseña (si fue guardada)
      if (foundStore.password && foundStore.password !== inputPass) {
        setError('Contraseña incorrecta para esta cuenta.');
        return;
      }
      localStorage.setItem('fluxa_current_store', JSON.stringify(foundStore));
      if (foundStore.subscription_status !== 'active') {
        router.push('/subscription');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    // 2. Verificar si hay una tienda en sesión actual cuyo email coincida
    const saved = localStorage.getItem('fluxa_current_store');
    if (saved) {
      const store = JSON.parse(saved);
      if (store.email?.toLowerCase() === inputUser.toLowerCase() || inputUser === 'demo@fluxa.com') {
        if (store.subscription_status !== 'active') {
          router.push('/subscription');
          return;
        }
        router.push('/dashboard');
        return;
      }
    }

    // 3. Si entra con cuenta demo o email de prueba
    if (inputUser === 'demo@fluxa.com' || inputUser.includes('demo')) {
      const demoStore = {
        id: "store-demo-101",
        name: "Panadería San José",
        slug: "panaderia-sanjose",
        whatsapp_number: "59894968558",
        email: inputUser || "demo@fluxa.com",
        subscription_status: 'active'
      };
      localStorage.setItem('fluxa_current_store', JSON.stringify(demoStore));
      router.push('/dashboard');
      return;
    }

    setError(`No se encontró ninguna cuenta registrada con el usuario o correo "${inputUser}". Verifica tu escritura o haz clic abajo en "Regístrate gratis".`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="max-w-md w-full glass-panel p-8 relative z-10 shadow-xl border border-slate-200 bg-white rounded-3xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-2xl text-gradient mb-2">
            <Store size={28} className="text-emerald-600" /> Fluxa Tiendas
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Iniciar Sesión</h2>
          <p className="text-sm text-slate-500 mt-1">Accede a tu panel de administración</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Usuario o Correo Electrónico</label>
            <input 
              type="text" 
              className="form-control bg-slate-50 border-slate-300 text-slate-900 focus:bg-white" 
              placeholder="admin o tu@negocio.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              className="form-control bg-slate-50 border-slate-300 text-slate-900 focus:bg-white" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full !mt-6 justify-center py-3.5 text-base shadow-lg shadow-emerald-500/20 font-bold"
          >
            Entrar al Panel <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 font-medium">
          ¿Aún no tienes tu tienda? <Link href="/register" className="text-emerald-600 font-bold hover:underline">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
}
