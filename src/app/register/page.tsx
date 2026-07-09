"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, ArrowRight, ShieldCheck, Smartphone, Check, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { STORE_TEMPLATES, DEFAULT_TEMPLATE } from '@/lib/templates';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [slug, setSlug] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(DEFAULT_TEMPLATE);

  // Generar slug automáticamente al escribir el nombre
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStoreName(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quitar acentos
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const allStoresRaw = localStorage.getItem('fluxa_all_stores');
      const allStores: any[] = allStoresRaw ? JSON.parse(allStoresRaw) : [];

      // Validar si el email ya está registrado para no pisar/sobrescribir cuentas
      const existingEmail = allStores.find(s => s.email?.toLowerCase() === email.toLowerCase());
      if (existingEmail) {
        throw new Error(`Ya existe una tienda registrada con el correo "${email}". Por favor, haz clic abajo en "Inicia Sesión aquí" para administrarla sin crear otra encima.`);
      }

      // Validar si el slug (dirección web) ya está ocupado por otro comercio
      const existingSlug = allStores.find(s => s.slug?.toLowerCase() === slug.toLowerCase());
      if (existingSlug) {
        throw new Error(`El enlace "tiendas.fluxauy.com/t/${slug}" ya se encuentra registrado y ocupado por otro negocio. Por favor elige una variación (ej. "${slug}-uy" o "${slug}-oficial").`);
      }

      const mockStoreId = "store-" + Math.random().toString(36).substring(2, 9);
      const tmpl = STORE_TEMPLATES[selectedTemplate] || STORE_TEMPLATES[DEFAULT_TEMPLATE];
      
      const newStore = {
        id: mockStoreId,
        name: storeName,
        slug: slug,
        whatsapp_number: whatsapp,
        email: email,
        password: password,
        template_id: selectedTemplate,
        theme_color: tmpl.themeColor,
        font_family: tmpl.fontFamily === 'font-serif' ? 'elegant' : tmpl.fontFamily === 'font-mono' ? 'playful' : 'modern',
        enabled_payment_methods: [], // POR DEFECTO NINGUNO ACTIVADO
        subscription_status: 'pending' // SUSCRIPCIÓN OBLIGATORIA PENDIENTE
      };

      // Guardar en el catálogo general de tiendas y como tienda activa actual
      allStores.push(newStore);
      localStorage.setItem('fluxa_all_stores', JSON.stringify(allStores));
      localStorage.setItem('fluxa_current_store', JSON.stringify(newStore));

      // Redirigir a la pantalla de pago de suscripción obligatoria
      router.push('/subscription');
    } catch (err: any) {
      setError(err.message || 'Error al registrar la tienda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative py-12">
      <div className="max-w-4xl w-full glass-panel p-8 relative z-10 shadow-xl border border-slate-200 bg-white rounded-3xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-2xl text-gradient mb-2">
            <Store size={28} className="text-emerald-600" /> Fluxa Tiendas
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900">Crea tu Plataforma Web</h2>
          <p className="text-base text-slate-500 mt-1">Elige tu plantilla ideal según el tipo de negocio y estarás en vivo en 2 minutos</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          {/* PASO 1: SELECCIÓN DE PLANTILLA */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-emerald-600" size={20} /> PASO 1: Selecciona el Tipo de Negocio
              </h3>
              <span className="text-xs text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full font-bold">
                6 Plantillas Inteligentes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.values(STORE_TEMPLATES).map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                
                // Configuración de colores por rubro para dar distinción visual sin recargar
                const accentStyles: Record<string, { bg: string, text: string, border: string, ring: string, badge: string }> = {
                  ecommerce: { bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'border-emerald-500', ring: 'ring-emerald-500/20', badge: 'bg-emerald-600 text-white' },
                  gastronomy: { bg: 'bg-amber-500/10', text: 'text-amber-700', border: 'border-amber-500', ring: 'ring-amber-500/20', badge: 'bg-amber-600 text-white' },
                  appointments: { bg: 'bg-pink-500/10', text: 'text-pink-700', border: 'border-pink-500', ring: 'ring-pink-500/20', badge: 'bg-pink-600 text-white' },
                  booking: { bg: 'bg-teal-500/10', text: 'text-teal-700', border: 'border-teal-500', ring: 'ring-teal-500/20', badge: 'bg-teal-600 text-white' },
                  services: { bg: 'bg-indigo-500/10', text: 'text-indigo-700', border: 'border-indigo-500', ring: 'ring-indigo-500/20', badge: 'bg-indigo-600 text-white' },
                  repairs: { bg: 'bg-blue-500/10', text: 'text-blue-700', border: 'border-blue-500', ring: 'ring-blue-500/20', badge: 'bg-blue-600 text-white' },
                };
                
                const theme = accentStyles[tmpl.id] || accentStyles.ecommerce;

                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-5 rounded-3xl border text-left transition-all duration-300 flex flex-col justify-between relative group ${
                      isSelected 
                        ? `${theme.border} bg-gradient-to-b from-white to-slate-50/80 shadow-xl ring-4 ${theme.ring} scale-[1.02] z-10` 
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <div>
                      {/* Cabecera de la tarjeta: Icono colorizado y Badge de Selección */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 shadow-sm border border-slate-100 ${theme.bg}`}>
                          {tmpl.icon}
                        </div>
                        {isSelected ? (
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 ${theme.badge}`}>
                            <Check size={12} strokeWidth={3} /> Elegida
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-slate-400 transition-colors" />
                        )}
                      </div>

                      {/* Título y Rubro ordenados */}
                      <h4 className="font-black text-slate-900 text-base leading-snug mb-1.5 group-hover:text-black transition-colors">
                        {tmpl.name}
                      </h4>
                      <div className="mb-3">
                        <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${theme.bg} ${theme.text}`}>
                          {tmpl.category}
                        </span>
                      </div>

                      {/* Descripción breve y clara */}
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium mb-4">
                        {tmpl.description}
                      </p>
                    </div>

                    {/* Footer con preview real del botón de acción */}
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-semibold">Botón en tu web:</span>
                      <span className={`px-3 py-1 rounded-xl font-bold text-[10px] shadow-sm flex items-center gap-1 transition-transform group-hover:scale-105 ${
                        isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                      }`}>
                        {tmpl.actionButtonText} ↗
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 2: DATOS DEL NEGOCIO */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">PASO 2: Datos de tu Negocio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de tu Negocio *</label>
                <input 
                  type="text" 
                  className="form-control bg-slate-50 border-slate-300 text-slate-900 focus:bg-white" 
                  placeholder="Ej. Panadería San José / Estética Glamour" 
                  value={storeName}
                  onChange={handleNameChange}
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tu Enlace Personalizado</label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-300 px-3 py-3 rounded-l-lg text-sm text-slate-600 font-mono font-bold">
                    tiendas.fluxa.com/t/
                  </span>
                  <input 
                    type="text" 
                    className="form-control !rounded-l-none font-mono text-emerald-700 font-bold bg-slate-50 border-slate-300 focus:bg-white" 
                    placeholder="mi-negocio" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp para Pedidos/Turnos *</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    className="form-control pl-10 bg-slate-50 border-slate-300 text-slate-900 focus:bg-white" 
                    placeholder="59894968558" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required 
                  />
                  <Smartphone size={18} className="absolute left-3 top-3.5 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Aquí te llegarán los pedidos y reservas de clientes.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                <input 
                  type="email" 
                  className="form-control bg-slate-50 border-slate-300 text-slate-900 focus:bg-white" 
                  placeholder="dueño@negocio.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña *</label>
                <input 
                  type="password" 
                  className="form-control bg-slate-50 border-slate-300 text-slate-900 focus:bg-white" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  minLength={6}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full justify-center py-4 text-lg font-extrabold shadow-xl shadow-emerald-500/20"
          >
            {loading ? "Creando tu Web por Plantilla..." : `Siguiente: Activar ${STORE_TEMPLATES[selectedTemplate]?.name || 'Mi Web'}`} <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 font-medium">
          ¿Ya tienes tu tienda o plataforma en Fluxa? <Link href="/login" className="text-emerald-600 font-bold hover:underline">Inicia Sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}
