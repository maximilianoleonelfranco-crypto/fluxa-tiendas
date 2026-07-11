"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Store, ChevronDown, Utensils, ShoppingBag, Scissors, 
  Building2, BarChart3, Receipt, Users, Layers, Globe, ArrowRight, Menu, X 
} from 'lucide-react';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-amber-400 font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            FX
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl text-slate-900 tracking-tight leading-none">
              Fluxa<span className="text-amber-500">.</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Sistema de Gestión & POS
            </span>
          </div>
        </Link>

        {/* Menú Desktop */}
        <div className="hidden lg:flex items-center gap-7 text-slate-700 font-bold text-sm">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Inicio
          </Link>

          {/* Categorías de Negocios Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setOpenDropdown('categorias')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors py-2">
              Categorías de negocios <ChevronDown size={14} className={`transition-transform ${openDropdown === 'categorias' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'categorias' && (
              <div className="absolute top-full left-0 w-64 pt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-3 space-y-1">
                  <Link href="/#categorias" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Utensils size={18} className="text-amber-500" />
                    <span className="text-xs font-bold text-slate-800">Negocios gastronómicos</span>
                  </Link>
                  <Link href="/#categorias" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <ShoppingBag size={18} className="text-cyan-500" />
                    <span className="text-xs font-bold text-slate-800">Comercios y Tiendas</span>
                  </Link>
                  <Link href="/#categorias" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Scissors size={18} className="text-pink-500" />
                    <span className="text-xs font-bold text-slate-800">Servicios y Profesionales</span>
                  </Link>
                  <Link href="/#categorias" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Building2 size={18} className="text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800">Mercados y Almacenes</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Funcionalidades Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setOpenDropdown('funcionalidades')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1.5 hover:text-slate-900 transition-colors py-2">
              Funcionalidades <ChevronDown size={14} className={`transition-transform ${openDropdown === 'funcionalidades' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'funcionalidades' && (
              <div className="absolute top-full left-0 w-72 pt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-3 space-y-1">
                  <Link href="/#funcionalidades" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Layers size={18} className="text-amber-500" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Control de inventarios</span>
                      <span className="text-[10px] text-slate-500 font-normal">Stock, alertas y variantes</span>
                    </div>
                  </Link>
                  <Link href="/#funcionalidades" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Receipt size={18} className="text-emerald-500" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Registro de ventas y gastos</span>
                      <span className="text-[10px] text-slate-500 font-normal">Flujo de caja y libro diario</span>
                    </div>
                  </Link>
                  <Link href="/#funcionalidades" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <BarChart3 size={18} className="text-blue-500" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Reportes y estadísticas</span>
                      <span className="text-[10px] text-slate-500 font-normal">Métricas en tiempo real</span>
                    </div>
                  </Link>
                  <Link href="/#funcionalidades" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <Users size={18} className="text-purple-500" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Gestión de clientes y deudas</span>
                      <span className="text-[10px] text-slate-500 font-normal">Cuentas corrientes y cobranza</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/#precios" className="hover:text-slate-900 transition-colors">
            Planes y precios
          </Link>

          {/* País / Uruguay */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-extrabold text-slate-700">
            <span>🇺🇾</span> Uruguay
          </div>
        </div>

        {/* Botones Derecha */}
        <div className="hidden sm:flex items-center gap-3">
          <Link 
            href="/login" 
            className="text-slate-700 hover:text-slate-900 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
          >
            Inicio de sesión
          </Link>
          <Link 
            href="/register" 
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-1.5"
          >
            Prueba gratis <ArrowRight size={16} />
          </Link>
        </div>

        {/* Menú Móvil Botón */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú Móvil Desplegado */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-5 space-y-4 shadow-lg">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-bold text-slate-800 text-sm"
          >
            Inicio
          </Link>
          <Link 
            href="/#categorias" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-bold text-slate-800 text-sm"
          >
            Categorías de negocios
          </Link>
          <Link 
            href="/#funcionalidades" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-bold text-slate-800 text-sm"
          >
            Funcionalidades del Sistema
          </Link>
          <Link 
            href="/#precios" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-bold text-slate-800 text-sm"
          >
            Planes y precios ($2 USD más barato)
          </Link>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <Link 
              href="/login" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-center font-bold text-slate-700 bg-slate-100 rounded-xl"
            >
              Inicio de sesión
            </Link>
            <Link 
              href="/register" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-center font-extrabold text-white bg-slate-900 rounded-xl shadow"
            >
              Prueba gratis ahora
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
