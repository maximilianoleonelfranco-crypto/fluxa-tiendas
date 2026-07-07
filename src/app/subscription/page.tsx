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
      <div className="max-w-2xl w-full glass-panel p-8 md:p-10 relative z-10 text-center border border-slate-200 bg-white shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-6">
          <Lock size={14} /> Activación de Plataforma Requerida
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">¡Casi listo, {storeData.name}!</h2>
        <p className="text-slate-600 text-base mb-6 font-medium">
          Tu enlace <code className="text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded">tiendas.fluxauy.com/t/{storeData.slug}</code> está reservado. Selecciona tu plan para activarlo hoy mismo.
        </p>

        {/* Toggle Mensual / Anual */}
        <div className="inline-flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-300 mb-8">
          <button 
            type="button"
            onClick={() => setIsAnnual(false)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${!isAnnual ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Facturación Mensual
          </button>
          <button 
            type="button"
            onClick={() => setIsAnnual(true)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isAnnual ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
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
                ? 'border-emerald-600 bg-emerald-50/70 shadow-lg scale-[1.02]' 
                : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-bold text-emerald-700">PLAN 1</span>
                {selectedPlan === 'basic' && (
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    Seleccionado
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-1">Básico • Autogestión</h4>
              <p className="text-xs text-slate-600 mb-4 font-medium">Tú creas y gestionas tu tienda con nuestras plantillas.</p>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="text-2xl font-black text-slate-900">
                ${isAnnual ? '100' : '10'} <span className="text-xs font-bold text-slate-500">USD / {isAnnual ? 'año' : 'mes'}</span>
              </div>
              {isAnnual && <span className="text-[10px] text-amber-600 font-bold block mt-1">🎁 ¡Ahorras $20 USD al año!</span>}
            </div>
          </div>

          {/* PLAN 2: PRO */}
          <div 
            onClick={() => setSelectedPlan('pro')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
              selectedPlan === 'pro' 
                ? 'border-amber-500 bg-amber-50/70 shadow-lg scale-[1.02]' 
                : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
              ⭐ Llave en Mano
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs font-bold text-amber-600">PLAN 2</span>
                {selectedPlan === 'pro' && (
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    Seleccionado
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg mb-1">PRO • Llave en Mano</h4>
              <p className="text-xs text-amber-800 mb-4 font-bold">Te creamos la web y subimos 20 productos en 48hs.</p>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <div className="text-2xl font-black text-slate-900">
                ${isAnnual ? '200' : '100'} <span className="text-xs font-bold text-slate-500">USD {isAnnual ? '1er año todo incluido' : 'inicial + $10/mes'}</span>
              </div>
              {isAnnual && <span className="text-[10px] text-amber-600 font-bold block mt-1">🎁 Creación + 1 año (2 cuotas gratis)</span>}
            </div>
          </div>
        </div>

        {/* Resumen del plan elegido */}
        <div className="bg-slate-50 rounded-2xl p-5 mb-8 border border-slate-200 text-left text-xs text-slate-600 font-medium">
          <p className="text-slate-900 font-bold mb-1 flex items-center gap-1.5">
            {selectedPlan === 'basic' ? <Zap size={16} className="text-emerald-600" /> : <Star size={16} className="text-amber-500" />}
            Estás activando el Plan {selectedPlan === 'basic' ? 'Básico Autogestión' : 'PRO Llave en Mano'} ({isAnnual ? 'Anual con descuento' : 'Mensual'}):
          </p>
          <p className="leading-relaxed">
            {selectedPlan === 'basic' 
              ? 'Tendrás acceso inmediato al panel para configurar tus productos, colores y plantillas sin comisiones por venta.'
              : 'Al activar, nuestro equipo técnico de Fluxa UY te contactará por WhatsApp para pedirte tu logo y fotos, entregándote la web lista en 48 horas.'
            }
          </p>
        </div>

        {/* PASARELA DE PAGO GLOBAL & CORPORATIVA */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 mb-8 text-left shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Lock size={14} /> Pasarela Cifrada SSL • Nivel Corporativo
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
              <span>PCI-DSS Validated</span> • <span>256-bit AES</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-medium mb-4">
            Selecciona el procesador de pago internacional para tu suscripción:
          </p>

          <div className="space-y-3 mb-6">
            {/* STRIPE */}
            <div 
              onClick={() => setGateway('stripe')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                gateway === 'stripe' ? 'bg-indigo-50/80 border-indigo-500 shadow-md scale-[1.01]' : 'bg-slate-50 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h5 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    Stripe Global Checkout <span className="bg-indigo-100 text-indigo-800 font-bold text-[9px] px-2 py-0.5 rounded-full font-mono">USD / Global</span>
                  </h5>
                  <p className="text-[11px] text-slate-600 font-medium">Tarjetas de Crédito y Débito Internacionales (Visa, Mastercard, Amex, Apple Pay).</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${gateway === 'stripe' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white'}`}>
                {gateway === 'stripe' && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {/* MERCADO PAGO / dLocal */}
            <div 
              onClick={() => setGateway('mercadopago')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                gateway === 'mercadopago' ? 'bg-cyan-50/80 border-cyan-500 shadow-md scale-[1.01]' : 'bg-slate-50 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold">
                  <Globe size={20} />
                </div>
                <div>
                  <h5 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    Mercado Pago / dLocal <span className="bg-cyan-100 text-cyan-800 font-bold text-[9px] px-2 py-0.5 rounded-full font-mono">Latam / Uruguay</span>
                  </h5>
                  <p className="text-[11px] text-slate-600 font-medium">Tarjetas locales (OCA, Lider, Visa), RedPagos, Abitab o saldo en moneda local.</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${gateway === 'mercadopago' ? 'border-cyan-600 bg-cyan-600' : 'border-slate-300 bg-white'}`}>
                {gateway === 'mercadopago' && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            {/* PAYPAL */}
            <div 
              onClick={() => setGateway('paypal')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                gateway === 'paypal' ? 'bg-blue-50/80 border-blue-500 shadow-md scale-[1.01]' : 'bg-slate-50 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-lg">
                  P
                </div>
                <div>
                  <h5 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    PayPal Corporate <span className="bg-blue-100 text-blue-800 font-bold text-[9px] px-2 py-0.5 rounded-full font-mono">Internacional</span>
                  </h5>
                  <p className="text-[11px] text-slate-600 font-medium">Procesamiento inmediato con saldo PayPal o tarjetas vinculadas.</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${gateway === 'paypal' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}>
                {gateway === 'paypal' && <span className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSimulatePayment}
            disabled={activating}
            className={`w-full justify-center py-4 text-sm font-extrabold rounded-2xl shadow-xl transition-all flex items-center gap-2 ${
              gateway === 'stripe' ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20' :
              gateway === 'mercadopago' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20' :
              'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
            }`}
          >
            {activating 
              ? `Conectando con servidores seguros de ${gateway === 'stripe' ? 'Stripe' : gateway === 'mercadopago' ? 'Mercado Pago' : 'PayPal'}...` 
              : `Proceder al Pago Cifrado con ${gateway === 'stripe' ? 'Stripe Global' : gateway === 'mercadopago' ? 'Mercado Pago Latam' : 'PayPal'} ($${selectedPlan === 'basic' ? (isAnnual ? '100 USD' : '10 USD') : (isAnnual ? '200 USD' : '100 USD')})`
            } <ExternalLink size={16} />
          </button>
        </div>

        {/* DESCARGA DE PWA */}
        <div className="text-left mt-6 pt-6 border-t border-slate-200">
          <PwaInstallerModal storeName={storeData.name} />
        </div>

        <p className="text-xs text-slate-500 mt-4 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck size={16} className="text-emerald-600" /> Pago seguro cifrado SSL. Sin comisiones bancarias por venta.
        </p>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-900 font-bold">Cargando planes...</div>}>
      <SubscriptionContent />
    </Suspense>
  );
}
