"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Store, ShieldCheck, CheckCircle2, Zap, ArrowRight, Lock, Star, Clock, Gift, CreditCard, Globe, ExternalLink } from 'lucide-react';
import PwaInstallerModal from '@/components/PwaInstallerModal';

function SubscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [storeData, setStoreData] = useState<any>(null);
  const [activating, setActivating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro'>('basic');
  const [isAnnual, setIsAnnual] = useState(false);
  const [gateway, setGateway] = useState<'stripe' | 'mercadopago' | 'paypal'>('stripe');

  useEffect(() => {
    const saved = localStorage.getItem('fluxa_current_store');
    if (!saved) {
      router.push('/register');
      return;
    }
    setStoreData(JSON.parse(saved));

    const planParam = searchParams.get('plan');
    if (planParam === 'pro') setSelectedPlan('pro');
  }, [router, searchParams]);

  const handleSimulatePayment = () => {
    setActivating(true);
    setTimeout(() => {
      const updated = { 
        ...storeData, 
        subscription_status: 'active',
        plan_type: selectedPlan,
        billing_cycle: isAnnual ? 'annual' : 'monthly'
      };
      localStorage.setItem('fluxa_current_store', JSON.stringify(updated));
      router.push('/dashboard');
    }, 1500);
  };

  if (!storeData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative py-12">
      <div className="max-w-2xl w-full glass-panel p-8 md:p-10 relative z-10 text-center border-2 border-[var(--accent-cyan)] shadow-2xl shadow-cyan-500/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-6">
          <Lock size={14} /> Activación de Plataforma Requerida
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-2">¡Casi listo, {storeData.name}!</h2>
        <p className="text-[var(--text-secondary)] text-base mb-6">
          Tu enlace <code className="text-cyan-400 font-mono">tiendas.fluxa.com/t/{storeData.slug}</code> está reservado. Selecciona tu plan para activarlo hoy mismo.
        </p>

        {/* Toggle Mensual / Anual */}
        <div className="inline-flex items-center gap-3 bg-[rgba(13,19,33,0.9)] p-1.5 rounded-2xl border border-[var(--border-glass)] mb-8">
          <button 
            type="button"
            onClick={() => setIsAnnual(false)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${!isAnnual ? 'bg-[var(--accent-cyan)] text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-white'}`}
          >
            Facturación Mensual
          </button>
          <button 
            type="button"
            onClick={() => setIsAnnual(true)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isAnnual ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md' : 'text-[var(--text-secondary)] hover:text-white'}`}
          >
            Pago Anual <span className="bg-black text-amber-400 text-[9px] px-1.5 py-0.5 rounded-full font-black">2 MESES REGALO</span>
          </button>
        </div>

        {/* SELECTOR DE PLANES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
          {/* PLAN 1: BÁSICO */}
          <div 
            onClick={() => setSelectedPlan('basic')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
              selectedPlan === 'basic' 
                ? 'border-[var(--accent-cyan)] bg-[rgba(0,215,192,0.12)] shadow-lg' 
                : 'border-[var(--border-glass)] bg-black/40 opacity-70 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-bold text-cyan-400">PLAN 1</span>
                {selectedPlan === 'basic' && (
                  <span className="bg-[var(--accent-cyan)] text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Seleccionado
                  </span>
                )}
              </div>
              <h4 className="font-black text-white text-lg mb-1">Básico • Autogestión</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Tú creas y gestionas tu tienda con nuestras plantillas.</p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="text-2xl font-black text-white">
                ${isAnnual ? '100' : '10'} <span className="text-xs font-normal text-gray-400">USD / {isAnnual ? 'año' : 'mes'}</span>
              </div>
              {isAnnual && <span className="text-[10px] text-amber-400 font-bold block mt-1">🎁 ¡Ahorras $20 USD al año!</span>}
            </div>
          </div>

          {/* PLAN 2: PRO */}
          <div 
            onClick={() => setSelectedPlan('pro')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
              selectedPlan === 'pro' 
                ? 'border-amber-400 bg-[rgba(245,158,11,0.15)] shadow-lg' 
                : 'border-[var(--border-glass)] bg-black/40 opacity-70 hover:opacity-100'
            }`}
          >
            <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
              ⭐ Llave en Mano
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-bold text-amber-400">PLAN 2</span>
                {selectedPlan === 'pro' && (
                  <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Seleccionado
                  </span>
                )}
              </div>
              <h4 className="font-black text-white text-lg mb-1">PRO • Llave en Mano</h4>
              <p className="text-xs text-amber-300/90 mb-4 font-medium">Te creamos la web y subimos 20 productos en 48hs.</p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="text-2xl font-black text-amber-400">
                ${isAnnual ? '200' : '100'} <span className="text-xs font-normal text-gray-300">USD {isAnnual ? '1er año todo incluido' : 'inicial + $10/mes'}</span>
              </div>
              {isAnnual && <span className="text-[10px] text-amber-400 font-bold block mt-1">🎁 Creación + 1 año (2 cuotas gratis)</span>}
            </div>
          </div>
        </div>

        {/* Resumen del plan elegido */}
        <div className="bg-black/40 rounded-xl p-4 mb-8 border border-white/10 text-left text-xs text-[var(--text-secondary)]">
          <p className="text-white font-bold mb-1 flex items-center gap-1.5">
            {selectedPlan === 'basic' ? <Zap size={14} className="text-cyan-400" /> : <Star size={14} className="text-amber-400" />}
            Estás activando el Plan {selectedPlan === 'basic' ? 'Básico Autogestión' : 'PRO Llave en Mano'} ({isAnnual ? 'Anual con descuento' : 'Mensual'}):
          </p>
          <p>
            {selectedPlan === 'basic' 
              ? 'Tendrás acceso inmediato al panel para configurar tus productos, colores y plantillas sin comisiones por venta.'
              : 'Al activar, nuestro equipo técnico de Fluxa UY te contactará por WhatsApp para pedirte tu logo y fotos, entregándote la web lista en 48 horas.'
            }
          </p>
        </div>

        {/* PASARELA DE PAGO GLOBAL & CORPORATIVA */}
        <div className="bg-[rgba(0,0,0,0.6)] p-6 rounded-2xl border border-[var(--border-glass)] mb-8 text-left">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-[var(--accent-cyan)] flex items-center gap-1.5">
              <Lock size={14} /> Pasarela Cifrada SSL • Nivel Corporativo
            </span>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold">
              <span>PCI-DSS Validated</span> • <span>256-bit AES</span>
            </div>
          </div>

          <p className="text-xs text-gray-300 font-medium mb-4">
            Selecciona el procesador de pago internacional para tu suscripción:
          </p>

          <div className="space-y-3 mb-6">
            {/* STRIPE */}
            <div 
              onClick={() => setGateway('stripe')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                gateway === 'stripe' ? 'bg-indigo-500/15 border-indigo-400 shadow-md' : 'bg-black/40 border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h5 className="text-sm font-black text-white flex items-center gap-2">
                    Stripe Global Checkout <span className="bg-indigo-500/20 text-indigo-300 text-[9px] px-2 py-0.5 rounded font-mono">USD / Global</span>
                  </h5>
                  <p className="text-[11px] text-gray-300">Tarjetas de Crédito y Débito Internacionales (Visa, Mastercard, Amex, Apple Pay).</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${gateway === 'stripe' ? 'border-indigo-400 bg-indigo-400' : 'border-gray-600'}`}>
                {gateway === 'stripe' && <span className="w-2 h-2 rounded-full bg-black" />}
              </div>
            </div>

            {/* MERCADO PAGO / dLocal */}
            <div 
              onClick={() => setGateway('mercadopago')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                gateway === 'mercadopago' ? 'bg-cyan-500/15 border-cyan-400 shadow-md' : 'bg-black/40 border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Globe size={20} />
                </div>
                <div>
                  <h5 className="text-sm font-black text-white flex items-center gap-2">
                    Mercado Pago / dLocal <span className="bg-cyan-500/20 text-cyan-300 text-[9px] px-2 py-0.5 rounded font-mono">Latam / Uruguay</span>
                  </h5>
                  <p className="text-[11px] text-gray-300">Tarjetas locales (OCA, Lider, Visa), RedPagos, Abitab o saldo en moneda local.</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${gateway === 'mercadopago' ? 'border-cyan-400 bg-cyan-400' : 'border-gray-600'}`}>
                {gateway === 'mercadopago' && <span className="w-2 h-2 rounded-full bg-black" />}
              </div>
            </div>

            {/* PAYPAL */}
            <div 
              onClick={() => setGateway('paypal')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                gateway === 'paypal' ? 'bg-blue-500/15 border-blue-400 shadow-md' : 'bg-black/40 border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  P
                </div>
                <div>
                  <h5 className="text-sm font-black text-white flex items-center gap-2">
                    PayPal Corporate <span className="bg-blue-500/20 text-blue-300 text-[9px] px-2 py-0.5 rounded font-mono">Internacional</span>
                  </h5>
                  <p className="text-[11px] text-gray-300">Procesamiento inmediato con saldo PayPal o tarjetas vinculadas.</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${gateway === 'paypal' ? 'border-blue-400 bg-blue-400' : 'border-gray-600'}`}>
                {gateway === 'paypal' && <span className="w-2 h-2 rounded-full bg-black" />}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSimulatePayment}
            disabled={activating}
            className={`w-full justify-center py-4 text-sm font-extrabold rounded-xl shadow-xl transition-all flex items-center gap-2 ${
              gateway === 'stripe' ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20' :
              gateway === 'mercadopago' ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-black hover:brightness-110 shadow-cyan-500/20' :
              'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
            }`}
          >
            {activating 
              ? `Conectando con servidores seguros de ${gateway === 'stripe' ? 'Stripe' : gateway === 'mercadopago' ? 'Mercado Pago' : 'PayPal'}...` 
              : `Proceder al Pago Cifrado con ${gateway === 'stripe' ? 'Stripe Global' : gateway === 'mercadopago' ? 'Mercado Pago Latam' : 'PayPal'} ($${selectedPlan === 'basic' ? (isAnnual ? '100 USD' : '10 USD') : (isAnnual ? '200 USD' : '100 USD')})`
            } <ExternalLink size={16} />
          </button>
        </div>

        {/* DESCARGA DE PWA */}
        <div className="text-left mt-6 pt-6 border-t border-white/10">
          <PwaInstallerModal storeName={storeData.name} />
        </div>

        <p className="text-xs text-[var(--text-secondary)] mt-4 flex items-center justify-center gap-1">
          <ShieldCheck size={14} className="text-green-400" /> Pago seguro cifrado SSL. Sin comisiones bancarias por venta.
        </p>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Cargando planes...</div>}>
      <SubscriptionContent />
    </Suspense>
  );
}
