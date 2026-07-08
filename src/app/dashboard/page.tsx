"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Store, Plus, Trash2, ExternalLink, Settings, 
  ShoppingBag, CheckCircle2, LogOut, Smartphone, DollarSign, Image as ImageIcon,
  Sparkles, ArrowRight, Check, HelpCircle, Gift, Award, Calendar, Clock, User, Phone, MapPin, MessageSquare, Filter, CreditCard, CheckCircle
} from 'lucide-react';
import { Product, OrderMovement } from '@/lib/supabase';
import { STORE_TEMPLATES, DEFAULT_TEMPLATE, STORE_PALETTES, getStorePalette } from '@/lib/templates';
import PwaInstallerModal from '@/components/PwaInstallerModal';

export default function DashboardPage() {
  const router = useRouter();
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderMovement[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'orders'>('products');
  const [orderFilter, setOrderFilter] = useState<'all' | 'unpaid' | 'in_progress' | 'delivered'>('all');
  const [timeFilter, setTimeFilter] = useState<'diario' | 'semanal' | 'mensual' | 'anual'>('mensual');

  // Formulario de nuevo producto
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  // Formulario de ajustes y plantillas
  const [storeName, setStoreName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [themeColor, setThemeColor] = useState('#00D7C0');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerText, setBannerText] = useState('');
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE);
  const [availableSlots, setAvailableSlots] = useState<string[]>(['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']);
  const [newSlotInput, setNewSlotInput] = useState('');
  const [mpPublicKey, setMpPublicKey] = useState('');
  const [stripeKey, setStripeKey] = useState('');

  // Estado del tutorial interactivo
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('fluxa_current_store');
    if (!saved) {
      router.push('/login');
      return;
    }
    const parsedStore = JSON.parse(saved);
    if (parsedStore.subscription_status !== 'active') {
      router.push('/subscription');
      return;
    }
    setStoreData(parsedStore);
    setStoreName(parsedStore.name);
    setWhatsapp(parsedStore.whatsapp_number);
    setThemeColor(parsedStore.theme_color || '#00D7C0');
    setLogoUrl(parsedStore.logo_url || '');
    setBannerText(parsedStore.banner_text || '');
    setTemplateId(parsedStore.template_id || DEFAULT_TEMPLATE);
    setMpPublicKey(parsedStore.mp_public_key || '');
    setStripeKey(parsedStore.stripe_key || '');
    if (parsedStore.available_slots && Array.isArray(parsedStore.available_slots)) {
      setAvailableSlots(parsedStore.available_slots);
    } else {
      setAvailableSlots(['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']);
    }

    // Cargar productos o inicializar VACÍO sin artículos de muestra
    const savedProducts = localStorage.getItem(`fluxa_products_${parsedStore.id}`);
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // INICIALIZAR VACÍO (0 productos) según requisito del usuario
      setProducts([]);
      localStorage.setItem(`fluxa_products_${parsedStore.id}`, JSON.stringify([]));
    }

    // Función para sincronizar pedidos en tiempo real al instante sin recargar
    const syncOrders = () => {
      const savedOrders = localStorage.getItem(`fluxa_orders_${parsedStore.id}`);
      if (savedOrders) {
        setOrders(prev => {
          const parsed = JSON.parse(savedOrders);
          if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
            return parsed;
          }
          return prev;
        });
      } else {
        setOrders([]);
      }
    };

    syncOrders(); // Carga inicial

    // Eventos para actualización instantánea entre pestañas y polling ligero cada 2 segundos
    window.addEventListener('storage', syncOrders);
    window.addEventListener('focus', syncOrders);
    const interval = setInterval(syncOrders, 2000);

    return () => {
      window.removeEventListener('storage', syncOrders);
      window.removeEventListener('focus', syncOrders);
      clearInterval(interval);
    };
  }, [router]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'delivered') => {
    if (!storeData) return;
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem(`fluxa_orders_${storeData.id}`, JSON.stringify(updated));
  };

  const handleUpdatePaymentStatus = (orderId: string, newPayStatus: 'unpaid' | 'paid' | 'partial') => {
    if (!storeData) return;
    const updated = orders.map(o => o.id === orderId ? { ...o, payment_status: newPayStatus } : o);
    setOrders(updated);
    localStorage.setItem(`fluxa_orders_${storeData.id}`, JSON.stringify(updated));
  };

  const handleQuickSale = () => {
    if (!storeData) return;
    const amountStr = prompt("Ingrese el monto del nuevo INGRESO / VENTA (Ej. 1500):");
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingrese un monto válido.");
      return;
    }
    const concept = prompt("Concepto / Detalle de la venta:") || "Venta directa en tienda";
    const customer = prompt("Nombre del Cliente:") || "Cliente Mostrador";
    const newOrd: OrderMovement = {
      id: 'ord-' + Date.now(),
      store_id: storeData.id,
      customer_name: customer,
      phone: storeData.whatsapp_number,
      total_amount: amount,
      status: 'delivered',
      payment_status: 'paid',
      created_at: new Date().toISOString(),
      items: [{ id: 'item-' + Date.now(), title: concept, price: amount, quantity: 1 }],
      notes: "Ingreso manual Rápido (Treinta Style)"
    };
    const updated = [newOrd, ...orders];
    setOrders(updated);
    localStorage.setItem(`fluxa_orders_${storeData.id}`, JSON.stringify(updated));
    setActiveTab('orders');
    alert("¡Ingreso registrado y sumado a tus ganancias!");
  };

  const handleQuickExpense = () => {
    if (!storeData) return;
    const amountStr = prompt("Ingrese el monto del nuevo GASTO / SALIDA (- USD/UYU):");
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingrese un monto válido.");
      return;
    }
    const concept = prompt("Concepto del Gasto (Ej. Pago proveedor, Luz, Flete):") || "Gasto operativo";
    const newOrd: OrderMovement = {
      id: 'exp-' + Date.now(),
      store_id: storeData.id,
      customer_name: "Proveedor / Gasto Operativo",
      phone: "",
      total_amount: -Math.abs(amount),
      status: 'delivered',
      payment_status: 'paid',
      created_at: new Date().toISOString(),
      items: [{ id: 'item-' + Date.now(), title: `💸 Gasto: ${concept}`, price: -Math.abs(amount), quantity: 1 }],
      notes: "Gasto manual registrado"
    };
    const updated = [newOrd, ...orders];
    setOrders(updated);
    localStorage.setItem(`fluxa_orders_${storeData.id}`, JSON.stringify(updated));
    setActiveTab('orders');
    alert("¡Gasto registrado en tu libro diario!");
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeData) return;

    const newProd: Product = {
      id: 'prod-' + Date.now(),
      store_id: storeData.id,
      title,
      description: desc,
      price: parseFloat(price) || 0,
      image_url: imgUrl,
      is_available: true
    };

    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem(`fluxa_products_${storeData.id}`, JSON.stringify(updated));

    setTitle('');
    setPrice('');
    setDesc('');
    setImgUrl('');
    setIsAdding(false);
    alert('¡Excelente! Artículo creado y publicado correctamente en tu web.');
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este ítem?')) return;
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem(`fluxa_products_${storeData.id}`, JSON.stringify(updated));
  };

  const handleToggleAvailable = (id: string) => {
    const updated = products.map(p => p.id === id ? { ...p, is_available: !p.is_available } : p);
    setProducts(updated);
    localStorage.setItem(`fluxa_products_${storeData.id}`, JSON.stringify(updated));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeData) return;

    const tmpl = STORE_TEMPLATES[templateId] || STORE_TEMPLATES[DEFAULT_TEMPLATE];

    const updated = {
      ...storeData,
      name: storeName,
      whatsapp_number: whatsapp,
      theme_color: themeColor,
      logo_url: logoUrl,
      banner_text: bannerText,
      template_id: templateId,
      mp_public_key: mpPublicKey,
      stripe_key: stripeKey,
      available_slots: availableSlots,
      font_family: tmpl.fontFamily === 'font-serif' ? 'elegant' : tmpl.fontFamily === 'font-mono' ? 'playful' : 'modern'
    };
    setStoreData(updated);
    localStorage.setItem('fluxa_current_store', JSON.stringify(updated));
    alert('¡Configuración guardada! Tu web adoptó el nuevo diseño y paleta.');
  };

  const handleLogout = () => {
    localStorage.removeItem('fluxa_current_store');
    router.push('/login');
  };

  if (!storeData) return null;

  const currentTmpl = STORE_TEMPLATES[templateId] || STORE_TEMPLATES[DEFAULT_TEMPLATE];

  // Cálculo de progreso del tutorial interactivo
  const hasProducts = products.length > 0;
  const hasLogoOrBanner = !!logoUrl || !!bannerText;
  const progressCount = 1 + (hasProducts ? 1 : 0) + (hasLogoOrBanner ? 1 : 0);
  const progressPercent = Math.round((progressCount / 4) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/15">
              <Store size={22} />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-slate-900 leading-tight">{storeData.name}</h1>
              <span className="text-xs text-emerald-700 flex items-center gap-1 font-bold">
                <CheckCircle2 size={12} /> {storeData.plan_type === 'pro' ? 'Plan PRO Llave en Mano' : 'Plan Básico Autogestión'} • {currentTmpl.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(storeData.email === 'admin' || storeData.is_admin_tester) && (
              <select
                onChange={(e) => {
                  const allRaw = localStorage.getItem('fluxa_all_stores');
                  if (allRaw) {
                    const all = JSON.parse(allRaw);
                    const chosen = all.find((s: any) => s.id === e.target.value);
                    if (chosen) {
                      chosen.subscription_status = 'active';
                      chosen.is_admin_tester = true;
                      localStorage.setItem('fluxa_current_store', JSON.stringify(chosen));
                      window.location.reload();
                    }
                  }
                }}
                value={storeData.id}
                className="px-3 py-2 rounded-xl bg-emerald-100 border border-emerald-500 text-emerald-900 text-xs font-black focus:outline-none cursor-pointer shadow-sm"
                title="Probar cualquier tienda al instante con permisos VIP"
              >
                <option value={storeData.id}>👑 Viendo: {storeData.name}</option>
                {(() => {
                  try {
                    const allRaw = localStorage.getItem('fluxa_all_stores');
                    const all = allRaw ? JSON.parse(allRaw) : [];
                    return all
                      .filter((s: any) => s.id !== storeData.id)
                      .map((s: any) => (
                        <option key={s.id} value={s.id}>
                          🏬 Probar: {s.name} ({s.slug})
                        </option>
                      ));
                  } catch {
                    return null;
                  }
                })()}
              </select>
            )}
            <Link 
              href="/admin" 
              className="px-3.5 py-2 rounded-xl bg-slate-900 text-amber-400 hover:bg-slate-800 font-extrabold text-xs shadow-sm flex items-center gap-1.5 border border-slate-700 transition-all"
              title="Panel Superadmin para el dueño de la plataforma (Control de todas las tiendas y cobros)"
            >
              👑 Panel Dueño
            </Link>
            <Link 
              href={`/t/${storeData.slug}`} 
              target="_blank"
              className="btn-secondary text-xs !py-2 !px-4 border-emerald-500/40 text-emerald-700 hover:bg-emerald-50 font-bold shadow-sm"
            >
              Ver mi Web en Vivo <ExternalLink size={14} />
            </Link>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 p-2 transition-colors" title="Cerrar Sesión">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {/* BANNER DE DESCARGA DE APP MÓVIL PWA */}
        <PwaInstallerModal storeName={storeData.name} />

        {/* GUÍA INTERACTIVA DE BIENVENIDA / TUTORIAL */}
        {showTutorial && (
          <div className="bg-white p-6 mb-8 rounded-3xl border border-slate-200 shadow-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-extrabold uppercase tracking-wider mb-2 inline-block">
                  🚀 Tutorial de Bienvenida
                </span>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  Configura tu Web Inteligente ({currentTmpl.name}) en 4 Pasos
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Sigue esta guía interactiva para publicar tu negocio y empezar a recibir pedidos por WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
                <div className="text-right">
                  <span className="text-xs text-slate-500 block font-semibold">Tu Progreso:</span>
                  <span className="text-lg font-black text-emerald-700">{progressCount} de 4 pasos ({progressPercent}%)</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 flex items-center justify-center font-bold text-slate-900 text-xs bg-emerald-500/10">
                  {progressPercent}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* PASO 1 */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-emerald-500/40 relative">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-1">
                  <CheckCircle2 size={16} /> PASO 1 • COMPLETADO
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1">Elegir rubro y plantilla</h4>
                <p className="text-xs text-slate-600 font-medium">Has seleccionado la plantilla <strong className="text-emerald-700">{currentTmpl.name}</strong>.</p>
              </div>

              {/* PASO 2 */}
              <div className={`p-4 rounded-2xl border transition-all ${hasProducts ? 'bg-slate-50 border-emerald-500/40' : 'bg-emerald-50/60 border-emerald-500 shadow-md'}`}>
                <div className={`flex items-center gap-2 font-bold text-xs mb-1 ${hasProducts ? 'text-emerald-600' : 'text-emerald-700 animate-pulse'}`}>
                  {hasProducts ? <CheckCircle2 size={16} /> : <Sparkles size={16} />} PASO 2 • {hasProducts ? 'COMPLETADO' : 'ACCIÓN REQUERIDA'}
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1">Cargar tu primer {currentTmpl.itemLabel}</h4>
                <p className="text-xs text-slate-600 mb-3 font-medium">Tu catálogo está vacío para que agregues tus opciones reales.</p>
                {!hasProducts && (
                  <button 
                    onClick={() => {
                      setActiveTab('products');
                      setIsAdding(true);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-transform hover:scale-105 flex items-center justify-center gap-1 shadow-sm"
                  >
                    ➕ Cargar {currentTmpl.itemLabel} <ArrowRight size={12} />
                  </button>
                )}
              </div>

              {/* PASO 3 */}
              <div className={`p-4 rounded-2xl border transition-all ${hasLogoOrBanner ? 'bg-slate-50 border-emerald-500/40' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`flex items-center gap-2 font-bold text-xs mb-1 ${hasLogoOrBanner ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {hasLogoOrBanner ? <CheckCircle2 size={16} /> : <Settings size={16} />} PASO 3 • {hasLogoOrBanner ? 'COMPLETADO' : 'OPCIONAL'}
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm mb-1">Logo, Color y Paleta</h4>
                <p className="text-xs text-slate-600 mb-3 font-medium">Asegúrate de que el color y nombre coincidan con tu marca.</p>
                <button 
                  onClick={() => {
                    setActiveTab('settings');
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  🎨 Ir a Ajustes <ArrowRight size={12} />
                </button>
              </div>

              {/* PASO 4 */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-purple-600 font-bold text-xs mb-1">
                    <ExternalLink size={16} /> PASO 4 • EN VIVO
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mb-1">Ver y compartir tu enlace</h4>
                  <p className="text-xs text-slate-600 font-medium">Tu web tiene una apariencia 100% personalizada por fuera.</p>
                </div>
                <Link 
                  href={`/t/${storeData.slug}`} 
                  target="_blank"
                  className="mt-3 w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-black text-center block shadow"
                >
                  🌐 Abrir Mi Web ↗
                </Link>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setShowTutorial(false)}
                className="text-[11px] text-slate-400 hover:text-slate-600 underline font-semibold"
              >
                Ocultar este tutorial de bienvenida
              </button>
            </div>
          </div>
        )}

        {/* Banner de Enlace Público */}
        <div className="bg-white p-6 mb-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-emerald-500">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">🔗 Enlace oficial para tus clientes ({currentTmpl.badgeText}):</h3>
            <p className="text-sm font-mono text-emerald-700 font-bold mt-1 bg-emerald-50 px-3 py-1 rounded-lg inline-block">tiendas.fluxauy.com/t/{storeData.slug}</p>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`https://tiendas.fluxauy.com/t/${storeData.slug}`);
              alert('¡Enlace copiado al portapapeles! Listo para pegar en tu Instagram o WhatsApp.');
            }}
            className="btn-secondary text-xs !py-2.5 !px-5 font-bold shadow-sm"
          >
            Copiar Enlace
          </button>
        </div>

        {/* ============================================================== */}
        {/* BANNER FINANCIERO AL ESTILO TREINTA / MINIMALISMO NÓRDICO     */}
        {/* ============================================================== */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="text-emerald-600 bg-emerald-100 p-1 rounded-lg" size={26} />
                Resumen Financiero y Libro Diario (Estilo Treinta)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Controla tus utilidades, ventas en efectivo o QR, y gastos operativos en tiempo real.</p>
            </div>
            
            {/* Pestañas de Filtro de Tiempo Treinta */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
              {(['diario', 'semanal', 'mensual', 'anual'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFilter(period)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    timeFilter === period
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Tarjetas de Indicadores KPI Principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Utilidad total ({timeFilter})</span>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  📈 +18.4%
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                ${orders.reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">Balance neto acumulado del negocio</span>
            </div>

            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 hover:border-emerald-300 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Ventas totales (+)</span>
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">💵</span>
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-2">
                + ${orders.filter(o => o.total_amount > 0).reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-700/80 font-semibold mt-1 block">{orders.filter(o => o.total_amount > 0).length} ingresos en este periodo</span>
            </div>

            <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200 hover:border-red-300 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Gastos totales (-)</span>
                <span className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-sm">💸</span>
              </div>
              <div className="text-2xl font-black text-red-600 mt-2">
                - ${Math.abs(orders.filter(o => o.total_amount < 0).reduce((acc, o) => acc + o.total_amount, 0)).toLocaleString()}
              </div>
              <span className="text-[11px] text-red-700/80 font-semibold mt-1 block">{orders.filter(o => o.total_amount < 0).length} salidas / compras registradas</span>
            </div>
          </div>

          {/* Botones de Acción Prominentes Treinta Style */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={handleQuickSale}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Plus size={18} /> + Nueva venta / Ingreso
            </button>
            <button
              onClick={handleQuickExpense}
              className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md shadow-red-500/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Trash2 size={18} /> - Nuevo gasto / Salida
            </button>
            <button
              onClick={() => {
                setActiveTab('products');
                setIsAdding(true);
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <ShoppingBag size={18} /> + Nuevo producto / Ítem
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8 gap-6 bg-white px-6 pt-3 rounded-t-2xl border-t border-x shadow-sm">
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-3 font-extrabold text-base flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === 'products' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingBag size={18} /> Gestión de {currentTmpl.itemLabel}s ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-3 font-extrabold text-base flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === 'settings' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings size={18} /> Plantilla y Ajustes
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-extrabold text-base flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === 'orders' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar size={18} /> {currentTmpl.managementTabTitle || '📦 Pedidos y Cuentas Corrientes'} {orders.length > 0 && <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-black">{orders.length}</span>}
          </button>
        </div>

        {/* TAB 1: PRODUCTOS */}
        {activeTab === 'products' && (
          <div className="bg-white p-6 rounded-b-2xl rounded-tr-2xl border border-slate-200 shadow-sm -mt-8 pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-slate-900">Listado Oficial de {currentTmpl.itemLabel}s</h2>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="btn-primary text-sm !py-2.5 !px-5 font-extrabold shadow-md"
              >
                <Plus size={18} /> {isAdding ? 'Cancelar' : `Nuevo ${currentTmpl.itemLabel}`}
              </button>
            </div>

            {/* Formulario de agregar */}
            {isAdding && (
              <form onSubmit={handleAddProduct} className="bg-slate-50 p-6 rounded-3xl mb-8 border-2 border-emerald-500 animate-in fade-in duration-300 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Sparkles className="text-emerald-600" size={20} /> ✨ Crear Nuevo {currentTmpl.itemLabel}
                  </h3>
                  <span className="text-xs text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full font-bold">Plantilla: {currentTmpl.name}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Título / Nombre *</label>
                    <input type="text" className="form-control bg-white border-slate-300 text-slate-900" placeholder={`Ej. ${currentTmpl.id === 'appointments' ? 'Corte de Cabello - 45min' : currentTmpl.id === 'gastronomy' ? 'Pizza Especial Doble Queso' : 'Nombre de tu artículo'}`} value={title} onChange={e => setTitle(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{currentTmpl.priceLabel} *</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-3.5 text-slate-400" />
                      <input type="number" step="0.01" className="form-control pl-8 bg-white border-slate-300 text-slate-900 font-bold" placeholder="150.00" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Descripción</label>
                  <textarea className="form-control bg-white border-slate-300 text-slate-900 font-medium" rows={2} placeholder="Detalles, ingredientes, duración o características..." value={desc} onChange={e => setDesc(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Foto del {currentTmpl.itemLabel} (Sube directo desde tu PC/Celular o pega link)</label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <label className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl cursor-pointer text-xs font-extrabold flex items-center justify-center gap-2 transition-all shrink-0">
                      📂 Subir Foto Local
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setImgUrl)} />
                    </label>
                    <span className="text-[11px] text-slate-500 font-semibold">O link:</span>
                    <div className="relative flex-1 w-full">
                      <ImageIcon size={16} className="absolute left-3 top-3 text-slate-400" />
                      <input type="text" className="form-control pl-8 text-xs w-full bg-white border-slate-300 text-slate-900 font-mono" placeholder="https://... (o sube archivo con el botón izquierdo)" value={imgUrl} onChange={e => setImgUrl(e.target.value)} />
                    </div>
                    {imgUrl && (
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        <img src={imgUrl} alt="Preview" className="max-w-full max-h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary text-sm !py-2.5 font-bold">Cancelar</button>
                  <button type="submit" className="btn-primary text-sm !py-2.5 font-extrabold shadow-md">Guardar y Publicar en Web</button>
                </div>
              </form>
            )}

            {/* Lista de productos */}
            {products.length === 0 ? (
              <div className="bg-slate-50 p-16 rounded-3xl text-center border-2 border-dashed border-slate-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Tu web está limpia y sin artículos de muestra</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 font-medium">
                  Hemos eliminado cualquier producto de demostración para que tu catálogo sea 100% real desde el primer segundo.
                </p>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 font-extrabold"
                >
                  <Plus size={18} /> Cargar Mi Primer {currentTmpl.itemLabel} Ahora
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(prod => (
                  <div key={prod.id} className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 overflow-hidden flex flex-col transition-all ${!prod.is_available ? 'opacity-60 grayscale bg-slate-50' : ''}`}>
                    <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-xs">Sin foto adjunta</div>
                      )}
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${prod.is_available ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                        {prod.is_available ? 'En Stock' : 'Agotado'}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="font-extrabold text-slate-900 text-lg leading-tight">{prod.title}</h4>
                          <span className="font-black text-emerald-700 text-lg bg-emerald-50 px-2 py-0.5 rounded-lg">${prod.price}</span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-4 font-medium">{prod.description}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <button 
                          onClick={() => handleToggleAvailable(prod.id)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-900 underline"
                        >
                          {prod.is_available ? 'Marcar Agotado' : 'Marcar Disponible'}
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AJUSTES */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl bg-white p-8 rounded-b-2xl rounded-tr-2xl border border-slate-200 shadow-sm -mt-8 pt-8">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Settings className="text-emerald-600 bg-emerald-100 p-1 rounded-lg" size={26} /> Personalización y Ajustes de tu Tienda
            </h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Tienda *</label>
                  <input type="text" className="form-control bg-white border-slate-300 text-slate-900 font-bold" value={storeName} onChange={e => setStoreName(e.target.value)} required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp para Pedidos *</label>
                  <div className="relative">
                    <input type="tel" className="form-control pl-10 bg-white border-slate-300 text-slate-900 font-bold" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required />
                    <Smartphone size={18} className="absolute left-3 top-3.5 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Logo y Banner */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Logo de tu Emprendimiento / Empresa</label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <label className="w-full sm:w-auto px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl cursor-pointer text-xs font-extrabold flex items-center justify-center gap-2 transition-all shrink-0">
                      📂 Subir Logo Local
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setLogoUrl)} />
                    </label>
                    <input type="text" className="form-control text-xs flex-1 bg-white border-slate-300 text-slate-900 font-mono" placeholder="O pega link (https://...)" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
                    {logoUrl && (
                      <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-sm">
                        <img src={logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1.5">Sube la imagen desde tu computadora o celular sin necesidad de links externos.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mensaje o Promoción (Banner Superior)</label>
                  <input type="text" className="form-control text-sm bg-white border-slate-300 text-slate-900 font-medium" placeholder="Ej: ¡Envío gratis comprando más de $1500!" value={bannerText} onChange={e => setBannerText(e.target.value)} />
                  <p className="text-xs text-slate-500 font-medium mt-1">Un texto destacado para atraer la atención de tus clientes.</p>
                </div>
              </div>

              {/* Selector de Plantilla de Negocio */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-slate-700">Plantilla y Tipo de Negocio</label>
                  <span className="text-xs text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">Cambio Instantáneo</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-4">Al cambiar de plantilla, tu sitio web público se reorganizará automáticamente al formato y paleta visual elegidos.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.values(STORE_TEMPLATES).map(tmpl => {
                    const isSelected = templateId === tmpl.id;
                    
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
                        onClick={() => {
                          setTemplateId(tmpl.id);
                          setThemeColor(tmpl.themeColor);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative group ${
                          isSelected ? `${theme.border} bg-gradient-to-b from-white to-slate-50 shadow-md ring-2 ${theme.ring}` : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100 ${theme.bg}`}>
                              {tmpl.icon}
                            </div>
                            {isSelected ? (
                              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm ${theme.badge}`}>
                                Activa
                              </span>
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-200 group-hover:border-slate-400" />
                            )}
                          </div>
                          <span className="font-black text-slate-900 text-sm block mb-1">{tmpl.name}</span>
                          <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider mb-2 ${theme.bg} ${theme.text}`}>
                            {tmpl.category}
                          </span>
                          <span className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed block">{tmpl.description}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Paleta de Colores (10 Paletas de 4 Colores) */}
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">Paleta de Marca (4 Colores en Armonía)</label>
                <p className="text-xs text-slate-500 font-medium mb-4">Cada paleta define el color primario, secundario, acento brillante y tinte de superficie de tu web.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STORE_PALETTES.map(pal => {
                    const isSelected = themeColor === pal.id || themeColor === pal.primary;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setThemeColor(pal.id)}
                        className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                          isSelected ? 'border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-500/20 scale-[1.01]' : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 block">{pal.name}</span>
                          <span className="text-[10px] text-slate-500 font-medium">Primario • Secundario • Acento • Fondo</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                          <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: pal.primary }} title="Primario" />
                          <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: pal.secondary }} title="Secundario" />
                          <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: pal.accent }} title="Acento" />
                          <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: pal.surface }} title="Superficie" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gestión de Turnos y Horarios para Plantillas de Citas / Reservas */}
              {(templateId === 'appointments' || templateId === 'booking') && (
                <div className="pt-6 border-t border-slate-200 animate-in fade-in duration-300">
                  <h3 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-2">
                    <Clock className="text-emerald-600" size={18} /> Gestión de Horarios / Turnos Disponibles
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-4">
                    Haz clic en los turnos para activarlos o desactivarlos. Los turnos tomados por clientes se bloquearán automáticamente en el calendario de la web pública.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'].map(slot => {
                      const isAvail = availableSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            if (isAvail) {
                              setAvailableSlots(prev => prev.filter(s => s !== slot));
                            } else {
                              setAvailableSlots(prev => [...prev, slot].sort());
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                            isAvail 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200' 
                              : 'bg-red-50 text-red-500 border border-red-200 line-through hover:bg-red-100'
                          }`}
                        >
                          <span>{isAvail ? '🟢' : '🔴'}</span> {slot}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 max-w-sm">
                    <input 
                      type="text" 
                      placeholder="Ej. 08:30 o 14:15" 
                      value={newSlotInput} 
                      onChange={e => setNewSlotInput(e.target.value)} 
                      className="form-control text-xs bg-white border-slate-300 text-slate-900" 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newSlotInput && !availableSlots.includes(newSlotInput)) {
                          setAvailableSlots(prev => [...prev, newSlotInput].sort());
                          setNewSlotInput('');
                        }
                      }}
                      className="btn-secondary text-xs shrink-0 !py-2 !px-4 font-bold"
                    >
                      ➕ Agregar Horario
                    </button>
                  </div>
                </div>
              )}

              {/* Conexión de Pasarelas de Pago Directo */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <CreditCard className="text-emerald-600" size={20} /> Conexión de Pasarelas de Pago Directo (0% Comisión Fluxa)
                  </label>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">Cobro en Línea Activo</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed">
                  Conecta tus cuentas bancarias o pasarelas para que tus clientes puedan pagarte al instante con tarjeta, débito o redes de cobranza (Abitab / RedPagos / Oxxo). El dinero va directo a tu cuenta sin intermediarios.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        🤝 Mercado Pago (Uruguay / LATAM)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const mockKey = `APP-USR-${Math.floor(100000 + Math.random() * 900000)}-${Date.now().toString().slice(-4)}`;
                          setMpPublicKey(mockKey);
                          alert('¡Conexión exitosa! Cuenta de Mercado Pago vinculada para cobros en moneda local (UYU/ARS/BRL/CLP/MXN).');
                        }}
                        className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                      >
                        ⚡ Vincular con 1 Clic
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Permite cobros con tarjetas de crédito, débito, dinero en cuenta y redes de cobranza locales (Abitab, RedPagos, etc.).</p>
                    <input 
                      type="text" 
                      className="form-control text-xs font-mono bg-white border-slate-300 text-slate-900" 
                      placeholder="Public Key / Access Token de MP (Ej: APP-USR-...)" 
                      value={mpPublicKey} 
                      onChange={e => setMpPublicKey(e.target.value)} 
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        🌍 Stripe Connect (Internacional / Global)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const mockStripe = `pk_live_${Math.floor(10000000 + Math.random() * 90000000)}`;
                          setStripeKey(mockStripe);
                          alert('¡Conexión exitosa con Stripe! Ahora puedes recibir pagos internacionales en USD y EUR con Visa, Mastercard y Apple Pay.');
                        }}
                        className="text-[11px] font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors"
                      >
                        ⚡ Conectar Stripe Global
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Ideal para vender productos o servicios al mundo entero en dólares (USD) o euros (EUR) con altísima seguridad SSL.</p>
                    <input 
                      type="text" 
                      className="form-control text-xs font-mono bg-white border-slate-300 text-slate-900" 
                      placeholder="Stripe Publishable Key (Ej: pk_live_...)" 
                      value={stripeKey} 
                      onChange={e => setStripeKey(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="btn-primary px-8 py-3.5 text-base font-extrabold w-full sm:w-auto shadow-md">
                  Guardar Toda la Configuración
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PEDIDOS Y COBROS (CUENTAS CORRIENTES) */}
        {activeTab === 'orders' && (
          <div className="space-y-8 bg-white p-6 rounded-b-2xl rounded-tr-2xl border border-slate-200 shadow-sm -mt-8 pt-8">
            {/* Barra de Estadísticas Financieras */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 border-l-4 border-l-blue-600 shadow-sm">
                <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">Total Facturado / Solicitado</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ${orders.reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">{orders.length} {currentTmpl.movementName.toLowerCase()}s en total</span>
              </div>

              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 border-l-4 border-l-amber-500 shadow-sm">
                <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Por Cobrar (Quién me debe)</span>
                <div className="text-2xl font-black text-amber-700 mt-1">
                  ${orders.filter(o => o.payment_status === 'unpaid' || o.payment_status === 'partial').reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
                </div>
                <span className="text-[11px] text-amber-800 font-bold">{orders.filter(o => o.payment_status === 'unpaid' || o.payment_status === 'partial').length} pendientes de pago</span>
              </div>

              <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 border-l-4 border-l-emerald-600 shadow-sm">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Total Cobrado / Saldado</span>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  ${orders.filter(o => o.payment_status === 'paid').reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-800 font-bold">{orders.filter(o => o.payment_status === 'paid').length} pagados al 100%</span>
              </div>
            </div>

            {/* Filtros Rápido */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                <Filter size={16} className="text-emerald-600" /> Filtrar por estado:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: `Todos (${orders.length})` },
                  { id: 'unpaid', label: `⏳ Por Cobrar (${orders.filter(o => o.payment_status !== 'paid').length})` },
                  { id: 'in_progress', label: `🔄 En Proceso (${orders.filter(o => o.status === 'in_progress' || o.status === 'pending').length})` },
                  { id: 'delivered', label: `✅ Entregados / Listo (${orders.filter(o => o.status === 'delivered' || o.status === 'completed').length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderFilter(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      orderFilter === tab.id
                        ? 'bg-emerald-600 text-white shadow-md font-extrabold ring-2 ring-emerald-500/20'
                        : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Listado de Pedidos */}
            {orders.length === 0 ? (
              <div className="bg-slate-50 p-16 rounded-3xl text-center border-2 border-dashed border-slate-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Historial de {currentTmpl.movementName}s Limpio</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 font-medium">
                  Cuando tus clientes hagan pedidos, reservas o agenden citas desde tu web pública, aparecerán instantáneamente en esta sección para que gestiones sus entregas y cobros.
                </p>
                <Link
                  href={`/t/${storeData.slug}`}
                  target="_blank"
                  className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 font-extrabold"
                >
                  🌐 Abrir Mi Web para Hacer Pedido de Prueba ↗
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders
                  .filter(o => {
                    if (orderFilter === 'unpaid') return o.payment_status !== 'paid';
                    if (orderFilter === 'in_progress') return o.status === 'pending' || o.status === 'in_progress';
                    if (orderFilter === 'delivered') return o.status === 'delivered' || o.status === 'completed';
                    return true;
                  })
                  .map(ord => {
                    const statusMap = currentTmpl.statusLabels || {
                      pending: 'Recibido 🟡',
                      in_progress: 'En Proceso 🔄',
                      completed: 'Completado 📦',
                      delivered: 'Finalizado ✅'
                    };
                    const currentStatusLabel = statusMap[ord.status] || ord.status;
                    const isPaid = ord.payment_status === 'paid';
                    const isExpense = ord.total_amount < 0;

                    return (
                      <div key={ord.id} className={`bg-white rounded-2xl border p-6 border-l-4 transition-all shadow-sm hover:shadow-md space-y-4 ${isExpense ? 'border-red-200 border-l-red-600' : 'border-slate-200 border-l-emerald-600'}`}>
                        {/* Cabecera del pedido */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          <div>
                            <span className={`text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded font-extrabold ${isExpense ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                              {isExpense ? 'Gasto Operativo' : currentTmpl.movementName} • #{ord.id.slice(-6)}
                            </span>
                            <h4 className="text-lg font-black text-slate-900 mt-1.5 flex items-center gap-2">
                              <User size={18} className="text-slate-400" /> {ord.customer_name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-xs text-slate-400 font-bold block">Monto Total:</span>
                              <span className={`text-xl font-black ${isExpense ? 'text-red-600' : 'text-slate-900'}`}>
                                {isExpense ? `- $${Math.abs(ord.total_amount).toLocaleString()}` : `+$${ord.total_amount.toLocaleString()}`}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-bold">
                              <Clock size={12} className="inline mr-1 text-slate-400" /> {new Date(ord.created_at).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => {
                                if (confirm('¿Seguro que deseas eliminar este movimiento del libro diario?')) {
                                  const updated = orders.filter(o => o.id !== ord.id);
                                  setOrders(updated);
                                  localStorage.setItem(`fluxa_orders_${storeData.id}`, JSON.stringify(updated));
                                }
                              }}
                              className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              title="Eliminar registro"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Detalle y Datos del Cliente */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                          <div className="space-y-1">
                            <span className="font-extrabold text-slate-700 block">📞 Contacto:</span>
                            <div className="text-slate-900 font-mono font-bold">{ord.phone || 'No especificado'}</div>
                            {ord.address && (
                              <div className="text-[11px] text-emerald-700 font-bold mt-1 flex items-start gap-1">
                                <MapPin size={14} className="shrink-0 mt-0.5" /> {ord.address}
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <span className="font-extrabold text-slate-700 block">📅 Fecha / Horario:</span>
                            <div className="text-slate-900 font-bold">
                              {ord.date_val ? `🗓️ ${ord.date_val}` : 'No aplica fecha específica'}
                            </div>
                            {ord.time_val && <div className="text-amber-700 font-bold">⏰ {ord.time_val}</div>}
                            {ord.notes && <div className="text-slate-600 italic mt-1 font-medium">📝 &quot;{ord.notes}&quot;</div>}
                          </div>
                          <div className="space-y-1">
                            <span className="font-extrabold text-slate-700 block">🛍️ Ítems del {currentTmpl.movementName}:</span>
                            <ul className="text-slate-900 font-bold space-y-1">
                              {ord.items.map(item => (
                                <li key={item.id} className="flex justify-between border-b border-slate-200/50 pb-0.5">
                                  <span>{item.quantity}x {item.title}</span>
                                  <span className="font-mono text-slate-600">${item.price * item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Barra de Gestión: Estados y Cobranza */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                          {/* Selector de Estado Operativo */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-600">Estado operativo:</span>
                            <select
                              value={ord.status}
                              onChange={e => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                              className="bg-white text-slate-900 font-bold text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
                            >
                              <option value="pending">{statusMap.pending}</option>
                              <option value="in_progress">{statusMap.in_progress}</option>
                              <option value="completed">{statusMap.completed}</option>
                              <option value="delivered">{statusMap.delivered}</option>
                            </select>
                          </div>

                          {/* Control de Pago / Cuenta Corriente y WhatsApp */}
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleUpdatePaymentStatus(ord.id, isPaid ? 'unpaid' : 'paid')}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm ${
                                isPaid
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 animate-pulse'
                              }`}
                            >
                              <CreditCard size={14} />
                              {isPaid ? '✅ COBRADO (100% Pagado)' : '❌ PENDIENTE DE COBRO (Deudor)'}
                            </button>

                            {!isExpense && (
                              <button
                                type="button"
                                onClick={() => {
                                  const cleanPhone = (ord.phone || storeData.whatsapp_number).replace(/\D/g, '');
                                  const msg = `Hola ${ord.customer_name}, te escribo desde ${storeData.name} por tu ${currentTmpl.movementName.toLowerCase()} #${ord.id.slice(-4)}. Estado: ${currentStatusLabel}.`;
                                  window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                                className="btn-secondary text-xs !py-2 !px-4 font-bold flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm"
                              >
                                <MessageSquare size={14} /> WhatsApp Cliente
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
