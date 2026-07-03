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
      <div className="max-w-4xl w-full glass-panel p-8 relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-2xl text-gradient mb-2">
            <Store size={28} className="text-[var(--accent-cyan)]" /> Fluxa Tiendas
          </Link>
          <h2 className="text-3xl font-extrabold text-white">Crea tu Plataforma Web</h2>
          <p className="text-base text-[var(--text-secondary)] mt-1">Elige tu plantilla ideal según el tipo de negocio y estarás en vivo en 2 minutos</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          {/* PASO 1: SELECCIÓN DE PLANTILLA */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="text-[var(--accent-cyan)]" size={20} /> PASO 1: Selecciona el Tipo de Negocio
              </h3>
              <span className="text-xs text-[var(--accent-cyan)] bg-[rgba(0,215,192,0.1)] px-3 py-1 rounded-full font-semibold">
                6 Plantillas Inteligentes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(STORE_TEMPLATES).map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                      isSelected 
                        ? 'border-[var(--accent-cyan)] bg-[rgba(0,215,192,0.12)] shadow-lg shadow-cyan-500/10 scale-[1.02]' 
                        : 'border-[var(--border-glass)] bg-black/30 hover:bg-black/50 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-10 -mt-10 opacity-20 transition-transform group-hover:scale-150" style={{ backgroundColor: tmpl.themeColor }} />
                    
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{tmpl.icon}</span>
                        {isSelected && (
                          <span className="bg-[var(--accent-cyan)] text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Seleccionada
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-base leading-tight mb-1">{tmpl.name}</h4>
                      <p className="text-[11px] text-cyan-300 font-semibold mb-2">{tmpl.category}</p>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">{tmpl.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--border-glass)] flex items-center justify-between text-[11px] font-semibold text-gray-300">
                      <span>Botón: <strong className="text-white">{tmpl.actionButtonText}</strong></span>
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: tmpl.themeColor }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PASO 2: DATOS DEL NEGOCIO */}
          <div className="pt-6 border-t border-[var(--border-glass)]">
            <h3 className="text-lg font-bold text-white mb-4">PASO 2: Datos de tu Negocio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">Nombre de tu Negocio *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej. Panadería San José / Estética Glamour" 
                  value={storeName}
                  onChange={handleNameChange}
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">Tu Enlace Personalizado</label>
                <div className="flex items-center">
                  <span className="bg-[rgba(71,85,105,0.3)] border border-r-0 border-[var(--border-glass)] px-3 py-3 rounded-l-lg text-sm text-cyan-400 font-mono">
                    tiendas.fluxa.com/t/
                  </span>
                  <input 
                    type="text" 
                    className="form-control !rounded-l-none font-mono text-cyan-300" 
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
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">WhatsApp para Pedidos/Turnos *</label>
                <div className="relative">
                  <input 
                    type="tel" 
                    className="form-control pl-10" 
                    placeholder="59894968558" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required 
                  />
                  <Smartphone size={18} className="absolute left-3 top-3.5 text-green-400" />
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Aquí te llegarán los pedidos y reservas de clientes.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">Correo Electrónico *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="dueño@negocio.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">Contraseña *</label>
                <input 
                  type="password" 
                  className="form-control" 
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
            className="btn-primary w-full justify-center py-4 text-lg font-extrabold shadow-xl shadow-cyan-500/20"
          >
            {loading ? "Creando tu Web por Plantilla..." : `Siguiente: Activar ${STORE_TEMPLATES[selectedTemplate]?.name || 'Mi Web'}`} <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center text-xs text-[var(--text-secondary)] mt-6">
          ¿Ya tienes tu tienda o plataforma en Fluxa? <Link href="/login" className="text-cyan-400 hover:underline">Inicia Sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}
