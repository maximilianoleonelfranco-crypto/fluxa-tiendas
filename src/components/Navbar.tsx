"use client";

import React from 'react';
import Link from 'next/link';
import { Store, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-[var(--border-glass)] bg-[rgba(13,19,33,0.8)] backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-blue)] flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Store size={22} />
          </div>
          <span className="text-gradient font-extrabold text-2xl">Fluxa Tiendas</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[var(--text-secondary)] font-medium">
          <Link href="#beneficios" className="hover:text-white transition-colors">Beneficios</Link>
          <Link href="#como-funciona" className="hover:text-white transition-colors">¿Cómo funciona?</Link>
          <Link href="#precios" className="hover:text-white transition-colors">Precios</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-[var(--text-secondary)] hover:text-white font-semibold text-sm px-4 py-2 transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/register" 
            className="btn-primary text-sm !padding-x-4 !padding-y-2 shadow-md"
          >
            Crear mi Tienda <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
