"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Store, ShieldCheck, CheckCircle2, Zap, ArrowRight, Lock, Star, Clock, Gift, CreditCard, Globe, ExternalLink, Settings, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
import PwaInstallerModal from '@/components/PwaInstallerModal';

interface PaymentConfig {
  mercadopagoLinkBasicMonthly: string;
  mercadopagoLinkBasicAnnual: string;
  mercadopagoLinkProMonthly: string;
  mercadopagoLinkProAnnual: string;
  mercadopagoAlias: string;
  stripeLinkBasicMonthly: string;
  stripeLinkBasicAnnual: string;
  stripeLinkProMonthly: string;
  stripeLinkProAnnual: string;
  paypalEmail: string;
}

const defaultPaymentConfig: PaymentConfig = {
  mercadopagoLinkBasicMonthly: "https://link.mercadopago.com.uy/fluxatiendas",
  mercadopagoLinkBasicAnnual: "https://link.mercadopago.com.uy/fluxatiendas",
  mercadopagoLinkProMonthly: "https://link.mercadopago.com.uy/fluxatiendas",
  mercadopagoLinkProAnnual: "https://link.mercadopago.com.uy/fluxatiendas",
  mercadopagoAlias: "FLUXA.TIENDAS.UY",
  stripeLinkBasicMonthly: "https://buy.stripe.com/test",
  stripeLinkBasicAnnual: "https://buy.stripe.com/test",
  stripeLinkProMonthly: "https://buy.stripe.com/test",
  stripeLinkProAnnual: "https://buy.stripe.com/test",
  paypalEmail: "cobros@fluxauy.com"
};

function SubscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [storeData, setStoreData] = useState<any>(null);
  const [activating, setActivating] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro'>('basic');
  const [isAnnual, setIsAnnual] = useState(false);
  const [gateway, setGateway] = useState<'mercadopago'>('mercadopago');
  
  // Modal para configurar cuentas de cobro de Fluxa
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [payConfig, setPayConfig] = useState<PaymentConfig>(defaultPaymentConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [redirectingUrl, setRedirectingUrl] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('fluxa_current_store');
    if (!saved) {
      router.push('/register');
      return;
    }
    setStoreData(JSON.parse(saved));

    const planParam = searchParams.get('plan');
    if (planParam === 'pro') setSelectedPlan('pro');

    const savedConfig = localStorage.getItem('fluxa_payment_gateways');
    if (savedConfig) {
      try {
        setPayConfig({ ...defaultPaymentConfig, ...JSON.parse(savedConfig) });
      } catch (e) {
        console.error("Error loading payment config", e);
      }
    }
  }, [router, searchParams]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('fluxa_payment_gateways', JSON.stringify(payConfig));
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowConfigModal(false);
    }, 1500);
  };

  const getPrice = () => {
    if (selectedPlan === 'basic') {
      return isAnnual ? 100 : 10;
    } else {
      return isAnnual ? 200 : 100;
    }
  };

  const handleSimulatePayment = () => {
    setActivating(true);
    const amount = getPrice();

    // Determinar la URL real de Mercado Pago configurada por el dueño
    let targetUrl = '';
    if (selectedPlan === 'basic' && !isAnnual && payConfig.mercadopagoLinkBasicMonthly && !payConfig.mercadopagoLinkBasicMonthly.includes('test')) {
      targetUrl = payConfig.mercadopagoLinkBasicMonthly;
    } else if (selectedPlan === 'basic' && isAnnual && payConfig.mercadopagoLinkBasicAnnual && !payConfig.mercadopagoLinkBasicAnnual.includes('test')) {
      targetUrl = payConfig.mercadopagoLinkBasicAnnual;
    } else if (selectedPlan === 'pro' && !isAnnual && payConfig.mercadopagoLinkProMonthly && !payConfig.mercadopagoLinkProMonthly.includes('test')) {
      targetUrl = payConfig.mercadopagoLinkProMonthly;
    } else if (selectedPlan === 'pro' && isAnnual && payConfig.mercadopagoLinkProAnnual && !payConfig.mercadopagoLinkProAnnual.includes('test')) {
      targetUrl = payConfig.mercadopagoLinkProAnnual;
    } else {
      // Enlace de cobro oficial por defecto
      targetUrl = payConfig.mercadopagoLinkBasicMonthly || "https://link.mercadopago.com.uy/fluxatiendas";
    }

    setRedirectingUrl(targetUrl);

    setTimeout(() => {
      // ⚠️ IMPORTANTE: Mantener en estado 'pending'. NUNCA activar automáticamente ni dar acceso al panel sin pagar.
      const updated = { 
        ...storeData, 
        subscription_status: 'pending',
        plan_type: selectedPlan,
        billing_cycle: isAnnual ? 'annual' : 'monthly',
        gateway_used: 'mercadopago',
        pending_amount: amount,
        last_checkout_attempt: new Date().toISOString()
      };
      localStorage.setItem('fluxa_current_store', JSON.stringify(updated));
      
      // Sincronizar en el catálogo global para que el dueño lo vea y apruebe en /admin en cuanto reciba el pago
      const allStoresRaw = localStorage.getItem('fluxa_all_stores');
      if (allStoresRaw) {
        try {
          let allStores = JSON.parse(allStoresRaw);
          allStores = allStores.map((s: any) => s.id === updated.id ? { ...s, ...updated } : s);
          localStorage.setItem('fluxa_all_stores', JSON.stringify(allStores));
        } catch (e) {}
      }
      
      // REDIRECCIÓN DIRECTA EN LA MISMA PESTAÑA HACIA LA PASARELA DE COBRO DE MERCADO PAGO
      window.location.href = targetUrl;
    }, 1200);
  };

  if (!storeData) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative py-12 bg-slate-50">
      <div className="max-w-2xl w-full glass-panel p-8 md:p-10 relative z-10 text-center border border-slate-200 bg-white shadow-2xl rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Lock size={14} /> Activación Formal de Tienda
          </div>
          <button
            onClick={() => setShowConfigModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-300"
            title="Configurar Cuentas de Cobro para recibir los pagos"
          >
            <Settings size={14} /> Configurar Mis Cobros
          </button>
        </div>

        {storeData.subscription_status === 'pending' && storeData.last_checkout_attempt && (
          <div className="mb-8 p-6 rounded-3xl bg-amber-50 border-2 border-amber-400 text-left shadow-lg animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <h3 className="font-black text-amber-900 text-base">⚠️ Pago Pendiente de Confirmación en Mercado Pago</h3>
            </div>
            <p className="text-xs text-amber-800 mb-4 leading-relaxed font-medium">
              Tu intento de pago por el <strong>Plan {storeData.plan_type === 'pro' ? 'PRO' : 'Básico'} (${storeData.pending_amount || (storeData.plan_type === 'pro' ? 100 : 10)} USD)</strong> está registrado. En cuanto completes el pago en Mercado Pago y el dueño lo verifique, tu panel se activará.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/59894968558?text=${encodeURIComponent(`Hola! Ya pagué la cuota de mi tienda "${storeData.name}" (${storeData.slug}) por Mercado Pago. ¿Me activas el acceso al panel?`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
              >
                📲 Enviar Comprobante por WhatsApp al Dueño
              </a>
              <button
                onClick={() => {
                  const saved = localStorage.getItem('fluxa_current_store');
                  if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.subscription_status === 'active') {
                      router.push('/dashboard');
                    } else {
                      alert("Tu tienda aún sigue en estado pendiente. Si ya pagaste, por favor notifica al dueño por WhatsApp para que apruebe tu acceso en el panel de administración.");
                    }
                  }
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                🔄 Ya me aprobaron, Entrar al Panel
              </button>
            </div>
          </div>
        )}

        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Activa tu Tienda Oficial, {storeData.name}</h2>
        <p className="text-slate-600 text-base mb-6 font-medium">
          Tu dominio en vivo <code className="text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">tiendas.fluxauy.com/t/{storeData.slug}</code> está reservado. Selecciona tu plan y pasarela oficial de pago.
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
              <p className="text-xs text-slate-600 mb-4 font-medium">Tú creas y gestionas tu tienda con nuestras plantillas y herramientas IA.</p>
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
              <p className="text-xs text-amber-800 mb-4 font-bold">Te creamos la web y subimos 20 productos en 48hs por un equipo experto.</p>
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
              <Lock size={14} /> Pasarela Bancaria Cifrada SSL • Nivel Corporativo
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
              <span>PCI-DSS Validated</span> • <span>256-bit AES</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-medium mb-4">
            Procesador de cobro oficial seleccionado para tu suscripción:
          </p>

          <div className="space-y-3 mb-6">
            {/* MERCADO PAGO (URUGUAY / LATAM) */}
            <div className="p-4 rounded-2xl border bg-cyan-50/80 border-cyan-500 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold">
                  <Globe size={20} />
                </div>
                <div>
                  <h5 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    Mercado Pago Oficial <span className="bg-cyan-100 text-cyan-800 font-bold text-[9px] px-2 py-0.5 rounded-full font-mono">Uruguay & Latam</span>
                  </h5>
                  <p className="text-[11px] text-slate-600 font-medium">Tarjetas locales Uruguay (OCA, Visa, Master, Lider), RedPagos, Abitab o saldo Mercado Pago.</p>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full border border-cyan-600 bg-cyan-600 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSimulatePayment}
            disabled={activating}
            className="w-full justify-center py-4 text-sm font-extrabold rounded-2xl shadow-xl transition-all flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/20"
          >
            {activating 
              ? <span className="flex items-center gap-2"><RefreshCw className="animate-spin" size={16} /> Redirigiendo a la pasarela de cobro de Mercado Pago Uruguay...</span>
              : `Proceder al Pago Seguro con Mercado Pago ($${selectedPlan === 'basic' ? (isAnnual ? '100 USD' : '10 USD') : (isAnnual ? '200 USD' : '100 USD')})`
            } <ExternalLink size={16} />
          </button>
        </div>

        {/* DESCARGA DE PWA */}
        <div className="text-left mt-6 pt-6 border-t border-slate-200">
          <PwaInstallerModal storeName={storeData.name} />
        </div>

        <p className="text-xs text-slate-500 mt-4 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck size={16} className="text-emerald-600" /> Cobro directo a tu cuenta bancaria o monedero digital. Transacción 100% encriptada y protegida.
        </p>
      </div>

      {/* MODAL DE CONFIGURACIÓN DE COBROS PARA EL DUEÑO DE LA PLATAFORMA (MAXIMILIANO) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="text-emerald-600" size={20} /> Configuración de Cuentas de Cobro
              </h3>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-100 px-2.5 py-1 rounded-lg"
              >
                ✕ Cerrar
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-6 text-left">
              Ingresa aquí tus enlaces de cobro o correos para que el dinero de las suscripciones de las tiendas caiga <strong>directamente a tu cuenta bancaria de Uruguay o internacional</strong>.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-left">
              {/* MERCADO PAGO URUGUAY */}
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200">
                <h4 className="text-xs font-black text-cyan-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Globe size={14} className="text-cyan-600" /> Mercado Pago Uruguay / Latam (Links de Cobro)
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Link o Alias para Plan Básico ($10 USD / mes):</label>
                    <input 
                      type="text"
                      value={payConfig.mercadopagoLinkBasicMonthly}
                      onChange={(e) => setPayConfig({...payConfig, mercadopagoLinkBasicMonthly: e.target.value})}
                      placeholder="Ej: https://link.mercadopago.com.uy/... o tu ALIAS"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Link o Alias para Plan PRO ($100 USD inicial):</label>
                    <input 
                      type="text"
                      value={payConfig.mercadopagoLinkProMonthly}
                      onChange={(e) => setPayConfig({...payConfig, mercadopagoLinkProMonthly: e.target.value})}
                      placeholder="Ej: https://link.mercadopago.com.uy/... o tu ALIAS"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* STRIPE GLOBAL */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CreditCard size={14} className="text-indigo-600" /> Stripe Global (Payment Links)
                </h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Stripe Payment Link (Plan Básico Mensual):</label>
                    <input 
                      type="text"
                      value={payConfig.stripeLinkBasicMonthly}
                      onChange={(e) => setPayConfig({...payConfig, stripeLinkBasicMonthly: e.target.value})}
                      placeholder="Ej: https://buy.stripe.com/..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Stripe Payment Link (Plan PRO Mensual):</label>
                    <input 
                      type="text"
                      value={payConfig.stripeLinkProMonthly}
                      onChange={(e) => setPayConfig({...payConfig, stripeLinkProMonthly: e.target.value})}
                      placeholder="Ej: https://buy.stripe.com/..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* PAYPAL CORPORATE */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-blue-600" /> PayPal Corporate (Mundo Entero)
                </h4>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Correo electrónico de tu cuenta PayPal:</label>
                  <input 
                    type="email"
                    value={payConfig.paypalEmail}
                    onChange={(e) => setPayConfig({...payConfig, paypalEmail: e.target.value})}
                    placeholder="ejemplo@fluxauy.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                >
                  {saveSuccess ? '✓ ¡Guardado Correctamente!' : 'Guardar Configuración de Cobros'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-900 font-bold">Cargando pasarelas oficiales...</div>}>
      <SubscriptionContent />
    </Suspense>
  );
}

