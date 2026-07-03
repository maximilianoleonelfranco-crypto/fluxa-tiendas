"use client";

import React from 'react';
import Link from 'next/link';
import { Store, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/15">
            <Store size={22} />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">Fluxa Tiendas</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-slate-600 font-semibold text-sm">
          <Link href="/#beneficios" className="hover:text-emerald-600 transition-colors">Beneficios</Link>
          <Link href="/#como-funciona" className="hover:text-emerald-600 transition-colors">¿Cómo funciona?</Link>
          <Link href="/#precios" className="hover:text-emerald-600 transition-colors">Precios</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-slate-600 hover:text-slate-900 font-semibold text-sm px-4 py-2 transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/register" 
            className="btn-primary text-sm !px-5 !py-2.5 shadow-md font-bold"
          >
            Crear mi Tienda <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
