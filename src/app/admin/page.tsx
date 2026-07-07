"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldAlert, Store, Users, DollarSign, CheckCircle2, XCircle, Clock, 
  ExternalLink, Search, Plus, Filter, RefreshCw, LogIn, Edit, Trash2, 
  Settings, AlertTriangle, ArrowRight, Lock, Eye, Check, AlertCircle, CreditCard, Globe 
} from 'lucide-react';

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

interface StoreItem {
  id: string;
  name: string;
  slug: string;
  plan_type: 'basic' | 'pro';
  billing_cycle: 'monthly' | 'annual';
  subscription_status: 'active' | 'suspended' | 'pending' | 'trial';
  whatsapp_number: string;
  owner_email: string;
  created_at: string;
  last_payment_date: string;
  amount_usd: number;
  template_id: string;
}

const defaultDemoStores: StoreItem[] = [
  {
    id: "store-demo-101",
    name: "Boutique París UY",
    slug: "boutique-paris",
    plan_type: "basic",
    billing_cycle: "monthly",
    subscription_status: "active",
    whatsapp_number: "59894968558",
    owner_email: "contacto@boutiqueparis.com.uy",
    created_at: "2026-06-15",
    last_payment_date: "2026-07-01",
    amount_usd: 10,
    template_id: "ecommerce"
  },
  {
    id: "store-demo-102",
    name: "Tech Store Montevideo",
    slug: "tech-mvd",
    plan_type: "pro",
    billing_cycle: "annual",
    subscription_status: "active",
    whatsapp_number: "59899123456",
    owner_email: "ventas@techstore.uy",
    created_at: "2026-05-10",
    last_payment_date: "2026-05-10",
    amount_usd: 200,
    template_id: "services"
  },
  {
    id: "store-demo-103",
    name: "Sushi Club Punta del Este",
    slug: "sushi-pde",
    plan_type: "basic",
    billing_cycle: "monthly",
    subscription_status: "suspended",
    whatsapp_number: "59898765432",
    owner_email: "info@sushiclub.com.uy",
    created_at: "2026-04-20",
    last_payment_date: "2026-05-20",
    amount_usd: 10,
    template_id: "gastronomy"
  },
  {
    id: "store-demo-104",
    name: "Gym Fitness Center",
    slug: "fitness-uy",
    plan_type: "pro",
    billing_cycle: "monthly",
    subscription_status: "pending",
    whatsapp_number: "59897112233",
    owner_email: "recepcion@gymfitness.uy",
    created_at: "2026-07-03",
    last_payment_date: "-",
    amount_usd: 100,
    template_id: "appointments"
  }
];

export default function SuperAdminPage() {
  const router = useRouter();
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewStoreModal, setShowNewStoreModal] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Configuración de Cuentas de Cobro de Fluxa (Dueño)
  const [showPayModal, setShowPayModal] = useState(false);
  const [payConfig, setPayConfig] = useState<PaymentConfig>(defaultPaymentConfig);
  const [savePaySuccess, setSavePaySuccess] = useState(false);

  // Formulario de nueva tienda manual
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreSlug, setNewStoreSlug] = useState('');
  const [newStoreEmail, setNewStoreEmail] = useState('');
  const [newStorePlan, setNewStorePlan] = useState<'basic' | 'pro'>('basic');
  const [newStorePhone, setNewStorePhone] = useState('598');

  useEffect(() => {
    // Cargar configuración de cobros del dueño
    const savedConfig = localStorage.getItem('fluxa_payment_gateways');
    if (savedConfig) {
      try {
        setPayConfig({ ...defaultPaymentConfig, ...JSON.parse(savedConfig) });
      } catch (e) {}
    }

    // Cargar todas las tiendas
    const savedAll = localStorage.getItem('fluxa_all_stores');
    let loadedStores: StoreItem[] = [];

    if (savedAll) {
      try {
        loadedStores = JSON.parse(savedAll);
      } catch (e) {
        console.error("Error parsing all stores", e);
      }
    }

    if (loadedStores.length === 0) {
      loadedStores = [...defaultDemoStores];
    }

    // Verificar si hay una tienda local actual en el navegador y fusionarla si no está
    const currentLocal = localStorage.getItem('fluxa_current_store');
    if (currentLocal) {
      try {
        const parsed = JSON.parse(currentLocal);
        const existsIndex = loadedStores.findIndex(s => s.id === parsed.id || s.slug === parsed.slug);
        const storeObj: StoreItem = {
          id: parsed.id || "store-local-001",
          name: parsed.name || "Mi Tienda",
          slug: parsed.slug || "mi-tienda",
          plan_type: parsed.plan_type || "basic",
          billing_cycle: parsed.billing_cycle || "monthly",
          subscription_status: parsed.subscription_status === 'active' ? 'active' : 'suspended',
          whatsapp_number: parsed.whatsapp_number || "59800000000",
          owner_email: parsed.owner_email || "cliente@fluxauy.com",
          created_at: new Date().toISOString().split('T')[0],
          last_payment_date: parsed.paid_at ? parsed.paid_at.split('T')[0] : "Hoy",
          amount_usd: parsed.plan_type === 'pro' ? 100 : 10,
          template_id: parsed.template_id || "ecommerce"
        };

        if (existsIndex >= 0) {
          loadedStores[existsIndex] = { ...loadedStores[existsIndex], ...storeObj };
        } else {
          loadedStores.unshift(storeObj);
        }
      } catch (e) {
        console.error(e);
      }
    }

    setStores(loadedStores);
    localStorage.setItem('fluxa_all_stores', JSON.stringify(loadedStores));
  }, []);

  const saveStoresToStorage = (updated: StoreItem[]) => {
    setStores(updated);
    localStorage.setItem('fluxa_all_stores', JSON.stringify(updated));
  };

  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => {
      setActionMessage(null);
    }, 3500);
  };

  const handleSavePayConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('fluxa_payment_gateways', JSON.stringify(payConfig));
    setSavePaySuccess(true);
    showNotification("💾 Pasarelas de cobro oficiales conectadas y guardadas. Ahora el dinero de tus clientes irá directo a tus cuentas.");
    setTimeout(() => {
      setSavePaySuccess(false);
      setShowPayModal(false);
    }, 2000);
  };

  // Cambiar estado de suscripción (Activar o Suspender por falta de pago)
  const handleToggleStatus = (storeId: string, newStatus: 'active' | 'suspended') => {
    const updated = stores.map(s => {
      if (s.id === storeId) {
        const updatedStore: StoreItem = {
          ...s,
          subscription_status: newStatus,
          last_payment_date: newStatus === 'active' ? new Date().toISOString().split('T')[0] : s.last_payment_date
        };

        // Si es la tienda que está actualmente iniciada en localStorage, sincronizar el corte al instante
        const currentLocal = localStorage.getItem('fluxa_current_store');
        if (currentLocal) {
          const parsed = JSON.parse(currentLocal);
          if (parsed.id === s.id || parsed.slug === s.slug) {
            localStorage.setItem('fluxa_current_store', JSON.stringify({
              ...parsed,
              subscription_status: newStatus
            }));
          }
        }

        return updatedStore;
      }
      return s;
    });

    saveStoresToStorage(updated);
    if (newStatus === 'active') {
      showNotification("🟢 ¡Tienda ACTIVADA! El cliente tiene acceso al admin y la web pública está al aire.");
    } else {
      showNotification("🔴 Tienda SUSPENDIDA por falta de pago. El cliente fue bloqueado y su tienda pública muestra aviso de corte.");
    }
  };

  // Entrar como el cliente (Impersonate)
  const handleImpersonate = (store: StoreItem) => {
    const currentLocal = localStorage.getItem('fluxa_current_store');
    let baseData: any = {};
    if (currentLocal) {
      try { baseData = JSON.parse(currentLocal); } catch (e) {}
    }

    const impersonatedData = {
      ...baseData,
      id: store.id,
      name: store.name,
      slug: store.slug,
      plan_type: store.plan_type,
      billing_cycle: store.billing_cycle,
      subscription_status: store.subscription_status,
      whatsapp_number: store.whatsapp_number,
      owner_email: store.owner_email,
      template_id: store.template_id
    };

    localStorage.setItem('fluxa_current_store', JSON.stringify(impersonatedData));
    showNotification(`🚀 Entrando al panel de "${store.name}"...`);
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  // Eliminar tienda del sistema
  const handleDeleteStore = (storeId: string, storeName: string) => {
    if (confirm(`¿Estás seguro de eliminar permanentemente la tienda "${storeName}" del sistema?`)) {
      const updated = stores.filter(s => s.id !== storeId);
      saveStoresToStorage(updated);
      showNotification(`🗑️ Tienda "${storeName}" eliminada.`);
    }
  };

  // Crear tienda manual
  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName || !newStoreSlug) return;

    const newObj: StoreItem = {
      id: `store-${Date.now()}`,
      name: newStoreName,
      slug: newStoreSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      plan_type: newStorePlan,
      billing_cycle: 'monthly',
      subscription_status: 'active',
      whatsapp_number: newStorePhone,
      owner_email: newStoreEmail || "cliente@fluxa.uy",
      created_at: new Date().toISOString().split('T')[0],
      last_payment_date: new Date().toISOString().split('T')[0],
      amount_usd: newStorePlan === 'pro' ? 100 : 10,
      template_id: "ecommerce"
    };

    const updated = [newObj, ...stores];
    saveStoresToStorage(updated);
    setShowNewStoreModal(false);
    setNewStoreName('');
    setNewStoreSlug('');
    setNewStoreEmail('');
    showNotification(`✨ Tienda "${newObj.name}" creada y activada con éxito.`);
  };

  // Cálculos financieros para el dueño
  const activeStoresCount = stores.filter(s => s.subscription_status === 'active').length;
  const suspendedStoresCount = stores.filter(s => s.subscription_status === 'suspended').length;
  const monthlyRecurringRevenue = stores
    .filter(s => s.subscription_status === 'active')
    .reduce((acc, curr) => acc + (curr.billing_cycle === 'annual' ? Math.round(curr.amount_usd / 12) : curr.amount_usd), 0);
  const totalStoresCount = stores.length;

  const filteredStores = stores.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.owner_email.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && s.subscription_status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      {/* HEADER DEL DUEÑO DE FLUXA */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold mb-2">
              <ShieldAlert size={14} /> PANEL SUPERADMIN • DUEÑO DE FLUXA UY
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Administración Central de Tiendas
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Control total de clientes, activación de suscripciones, cortes por falta de pago e ingresos recurrentes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPayModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 shadow-md"
            >
              <CreditCard size={15} className="text-emerald-400" /> Cuentas de Cobro (Stripe/MP/PayPal)
            </button>
            <button
              onClick={() => setShowNewStoreModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Plus size={16} /> Crear Tienda Cliente
            </button>
          </div>
        </div>

        {/* NOTIFICACIÓN EN VIVO */}
        {actionMessage && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={18} /> {actionMessage}
            </span>
            <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* MÉTRICAS FINANCIERAS (MRR & CLIENTES) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Ingreso Recurrente (MRR)</span>
              <DollarSign className="text-emerald-400" size={18} />
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              ${monthlyRecurringRevenue} <span className="text-xs font-bold text-slate-400 font-sans">USD / mes</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-500" /> Facturación estimada en vivo
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Tiendas Al Día (Activas)</span>
              <Store className="text-cyan-400" size={18} />
            </div>
            <div className="text-3xl font-black text-white font-mono">
              {activeStoresCount} <span className="text-xs font-bold text-slate-400 font-sans">de {totalStoresCount}</span>
            </div>
            <p className="text-[11px] text-cyan-400 mt-2 font-semibold">
              🟢 Operando y vendiendo al 100%
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Impagos / Suspendidas</span>
              <AlertTriangle className="text-rose-400" size={18} />
            </div>
            <div className="text-3xl font-black text-rose-400 font-mono">
              {suspendedStoresCount} <span className="text-xs font-bold text-slate-400 font-sans">tiendas</span>
            </div>
            <p className="text-[11px] text-rose-400 mt-2 font-semibold">
              🔴 Servicio cortado por falta de pago
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                <span>Pasarelas de Cobro</span>
                <Globe className="text-indigo-400" size={18} />
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Conecta tus cuentas para que las suscripciones mensuales te caigan directo.
              </p>
            </div>
            <button
              onClick={() => setShowPayModal(true)}
              className="text-xs font-extrabold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-2 text-left"
            >
              ⚙️ Configurar pasarelas <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* FILTROS Y BUSCADOR DE CLIENTES */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar tienda, slug o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <span className="text-xs text-slate-400 font-bold mr-1 flex items-center gap-1">
              <Filter size={14} /> Filtro:
            </span>
            {[
              { id: 'all', label: 'Todas las Tiendas' },
              { id: 'active', label: '🟢 Activas / Al día' },
              { id: 'suspended', label: '🔴 Cortadas / Morosos' },
              { id: 'pending', label: '🟡 Pendiente' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filterStatus === tab.id 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TABLA DE TIENDAS Y GESTIÓN DE SUSCRIPCIONES */}
        <div className="mt-6 rounded-3xl bg-slate-800/90 border border-slate-700/90 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Tienda / Cliente</th>
                  <th className="p-4">Plan & Cuota</th>
                  <th className="p-4">Estado de Pago</th>
                  <th className="p-4">Último Pago</th>
                  <th className="p-4 text-center">Control de Servicio</th>
                  <th className="p-4 pr-6 text-right">Acciones del Dueño</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-xs font-medium">
                {filteredStores.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      No se encontraron tiendas con el filtro seleccionado.
                    </td>
                  </tr>
                ) : (
                  filteredStores.map(store => (
                    <tr key={store.id} className="hover:bg-slate-700/40 transition-colors">
                      {/* TIENDA / CLIENTE */}
                      <td className="p-4 pl-6">
                        <div className="font-extrabold text-white text-sm flex items-center gap-2">
                          {store.name}
                          <a 
                            href={`/t/${store.slug}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-0.5"
                            title="Ver web pública en vivo"
                          >
                            <ExternalLink size={13} />
                          </a>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          tiendas.fluxauy.com/t/{store.slug}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          📧 {store.owner_email} | 📞 +{store.whatsapp_number}
                        </div>
                      </td>

                      {/* PLAN & CUOTA */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono ${
                          store.plan_type === 'pro' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'bg-slate-700 text-slate-200'
                        }`}>
                          {store.plan_type === 'pro' ? '⭐ PLAN PRO' : '⚡ BÁSICO'}
                        </span>
                        <div className="text-white font-extrabold text-xs mt-1">
                          ${store.amount_usd} USD <span className="text-[10px] text-slate-400 font-normal">/ {store.billing_cycle === 'annual' ? 'año' : 'mes'}</span>
                        </div>
                      </td>

                      {/* ESTADO DE PAGO */}
                      <td className="p-4">
                        {store.subscription_status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Activa (Al día)
                          </span>
                        ) : store.subscription_status === 'suspended' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold text-xs">
                            <span className="w-2 h-2 rounded-full bg-rose-500" /> Suspendida (Impago)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-xs">
                            <Clock size={12} /> Pendiente
                          </span>
                        )}
                      </td>

                      {/* ÚLTIMO PAGO */}
                      <td className="p-4 text-slate-300 font-mono text-xs">
                        {store.last_payment_date}
                      </td>

                      {/* CONTROL DE SERVICIO (CORTE O ACTIVACIÓN) */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {store.subscription_status !== 'active' ? (
                            <button
                              onClick={() => handleToggleStatus(store.id, 'active')}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow flex items-center gap-1"
                              title="El cliente te pagó la cuota mensual. Marcar como al día y encender tienda."
                            >
                              <Check size={14} /> Activar Tienda
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleStatus(store.id, 'suspended')}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-300 border border-rose-500/30 font-bold text-xs transition-all flex items-center gap-1"
                              title="El cliente no pagó el mes. Cortar acceso al panel y apagar tienda en vivo."
                            >
                              <Lock size={14} /> Suspender / Cortar
                            </button>
                          )}
                        </div>
                      </td>

                      {/* ACCIONES DEL DUEÑO */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleImpersonate(store)}
                            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-all flex items-center gap-1 text-xs font-bold"
                            title="Entrar al panel de administración del cliente (para soporte o armado web)"
                          >
                            <LogIn size={14} className="text-cyan-400" /> Entrar al Admin
                          </button>
                          
                          <button
                            onClick={() => handleDeleteStore(store.id, store.name)}
                            className="p-2 rounded-xl bg-slate-700/50 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-all"
                            title="Eliminar tienda"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* INFO PIE DE PÁGINA */}
        <div className="mt-8 p-6 rounded-3xl bg-slate-800/50 border border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Control Automático de Morosidad</p>
              <p>Al hacer clic en <strong className="text-rose-400">"Suspender / Cortar"</strong>, el comercio pierde el acceso al panel y sus clientes ven un aviso de suspensión.</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-all text-xs"
          >
            ← Volver a Mi Vista de Cliente
          </Link>
        </div>
      </div>

      {/* MODAL DE CREACIÓN MANUAL DE TIENDA */}
      {showNewStoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl max-w-md w-full p-6 md:p-8 border border-slate-700 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="text-emerald-400" size={20} /> Alta de Nueva Tienda
              </h3>
              <button 
                onClick={() => setShowNewStoreModal(false)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-6">
              Crea una tienda manualmente para un cliente. Quedará activada de inmediato en la plataforma.
            </p>

            <form onSubmit={handleCreateStore} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Nombre del Comercio:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Zapatería Italiana"
                  value={newStoreName}
                  onChange={(e) => {
                    setNewStoreName(e.target.value);
                    if (!newStoreSlug) {
                      setNewStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Enlace (Slug web):</label>
                <div className="flex items-center">
                  <span className="bg-slate-700 text-slate-400 px-3 py-2.5 rounded-l-xl text-xs font-mono border border-r-0 border-slate-700">
                    /t/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="zapateria-italiana"
                    value={newStoreSlug}
                    onChange={(e) => setNewStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-r-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Email del Cliente (Propietario):</label>
                <input
                  type="email"
                  placeholder="cliente@correo.com"
                  value={newStoreEmail}
                  onChange={(e) => setNewStoreEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">WhatsApp del Comercio:</label>
                <input
                  type="text"
                  placeholder="59899123456"
                  value={newStorePhone}
                  onChange={(e) => setNewStorePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Plan de Suscripción:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewStorePlan('basic')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      newStorePlan === 'basic' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    ⚡ Básico ($10/m)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStorePlan('pro')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      newStorePlan === 'pro' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    ⭐ PRO ($100/m)
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
                >
                  ✓ Crear y Activar Tienda
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewStoreModal(false)}
                  className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold text-xs rounded-xl transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIGURACIÓN DE PASARELAS DE COBRO PARA TUS CLIENTES */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 md:p-8 border border-slate-700 shadow-2xl relative my-8 text-left">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-tight">Configuración de Cuentas de Cobro</h3>
                  <p className="text-xs text-slate-400">Pega aquí tus enlaces para que las tiendas creadas te paguen directamente.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition-all font-bold"
              >
                ✕
              </button>
            </div>

            {savePaySuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={18} /> ¡Listo! Pasarelas conectadas. Tus clientes pagarán a estas cuentas a partir de ahora.
              </div>
            )}

            <form onSubmit={handleSavePayConfig} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* MERCADO PAGO URUGUAY */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm border-b border-slate-700 pb-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> Mercado Pago (Uruguay / Latam)
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Tu Alias o CVU/CBU principal:</label>
                  <input
                    type="text"
                    value={payConfig.mercadopagoAlias}
                    onChange={(e) => setPayConfig({...payConfig, mercadopagoAlias: e.target.value})}
                    placeholder="Ej: FLUXA.TIENDAS.UY"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Link Plan Básico ($10 USD / mes):</label>
                    <input
                      type="text"
                      value={payConfig.mercadopagoLinkBasicMonthly}
                      onChange={(e) => setPayConfig({...payConfig, mercadopagoLinkBasicMonthly: e.target.value})}
                      placeholder="https://link.mercadopago.com.uy/..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Link Plan PRO ($100 USD inicial):</label>
                    <input
                      type="text"
                      value={payConfig.mercadopagoLinkProMonthly}
                      onChange={(e) => setPayConfig({...payConfig, mercadopagoLinkProMonthly: e.target.value})}
                      placeholder="https://link.mercadopago.com.uy/..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* STRIPE GLOBAL */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm border-b border-slate-700 pb-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" /> Stripe Global (Tarjetas Internacionales / Apple Pay)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Link Stripe Plan Básico ($10 USD):</label>
                    <input
                      type="text"
                      value={payConfig.stripeLinkBasicMonthly}
                      onChange={(e) => setPayConfig({...payConfig, stripeLinkBasicMonthly: e.target.value})}
                      placeholder="https://buy.stripe.com/..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Link Stripe Plan PRO ($100 USD):</label>
                    <input
                      type="text"
                      value={payConfig.stripeLinkProMonthly}
                      onChange={(e) => setPayConfig({...payConfig, stripeLinkProMonthly: e.target.value})}
                      placeholder="https://buy.stripe.com/..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* PAYPAL CORPORATE */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm border-b border-slate-700 pb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> PayPal Corporativo (Clientes USA & Europa)
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Tu Correo Electrónico de PayPal:</label>
                  <input
                    type="email"
                    value={payConfig.paypalEmail}
                    onChange={(e) => setPayConfig({...payConfig, paypalEmail: e.target.value})}
                    placeholder="cobros@fluxauy.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Guardar Pasarelas en Vivo
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
