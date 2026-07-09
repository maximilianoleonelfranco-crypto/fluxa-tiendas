"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Store, Plus, Trash2, ExternalLink, Settings, 
  ShoppingBag, CheckCircle2, LogOut, Smartphone, DollarSign, Image as ImageIcon,
  Sparkles, ArrowRight, Check, HelpCircle, Gift, Award, Calendar, Clock, User, Phone, MapPin, MessageSquare, Filter, CreditCard, CheckCircle,
  Copy, Share2, Eye, TrendingUp, Layers, Palette, Zap
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

  // Métodos de pago habilitados en la tienda (POR DEFECTO NINGUNO = [])
  const [enabledPaymentMethods, setEnabledPaymentMethods] = useState<string[]>([]);
  const [bankDetails, setBankDetails] = useState('');
  const [cashInstructions, setCashInstructions] = useState('');

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
    setEnabledPaymentMethods(Array.isArray(parsedStore.enabled_payment_methods) ? parsedStore.enabled_payment_methods : []);
    setBankDetails(parsedStore.bank_details || '');
    setCashInstructions(parsedStore.cash_instructions || '');

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

  const togglePaymentMethod = (methodId: string) => {
    setEnabledPaymentMethods(prev =>
      prev.includes(methodId) ? prev.filter(m => m !== methodId) : [...prev, methodId]
    );
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
      enabled_payment_methods: enabledPaymentMethods,
      bank_details: bankDetails,
      cash_instructions: cashInstructions,
      font_family: tmpl.fontFamily === 'font-serif' ? 'elegant' : tmpl.fontFamily === 'font-mono' ? 'playful' : 'modern'
    };
    setStoreData(updated);
    localStorage.setItem('fluxa_current_store', JSON.stringify(updated));

    const allRaw = localStorage.getItem('fluxa_all_stores');
    if (allRaw) {
      try {
        const all = JSON.parse(allRaw);
        const updatedAll = all.map((s: any) => s.id === storeData.id ? updated : s);
        localStorage.setItem('fluxa_all_stores', JSON.stringify(updatedAll));
      } catch (e) {}
    }

    alert('¡Configuración guardada! Tus métodos de pago y diseño se han actualizado en tiempo real.');
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
      {/* ========================================================= */}
      {/* TOP NAVBAR OBSIDIANA PREMIUM                              */}
      {/* ========================================================= */}
      <header className="border-b border-slate-800 bg-slate-950 text-white sticky top-0 z-50 px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 shrink-0">
              <Store size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-black text-xl text-white tracking-tight">{storeData.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> ONLINE • SSL
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1">
                <span className="text-emerald-400 font-semibold">{storeData.plan_type === 'pro' ? 'Plan PRO Llave en Mano' : 'Plan Básico Autogestión'}</span>
                <span>•</span>
                <span>Plantilla activa: <strong className="text-white">{currentTmpl.name}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
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
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/60 text-emerald-300 text-xs font-extrabold focus:outline-none cursor-pointer shadow-sm hover:border-emerald-400 transition-all"
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
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-extrabold text-xs shadow-sm flex items-center gap-1.5 border border-amber-500/30 transition-all"
              title="Panel Superadmin para el dueño de la plataforma (Control de todas las tiendas y cobros)"
            >
              👑 Panel Dueño
            </Link>

            <Link 
              href={`/t/${storeData.slug}`} 
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
            >
              Ver mi Web en Vivo <ExternalLink size={14} />
            </Link>

            <button 
              onClick={handleLogout} 
              className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-bold" 
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* CUERPO PRINCIPAL                                          */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {/* BANNER DE DESCARGA DE APP MÓVIL PWA */}
        <PwaInstallerModal storeName={storeData.name} />

        {/* ========================================================= */}
        {/* HERO COMMAND CENTER (CENTRO DE CONTROL VIP)               */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-7 mb-8 text-white relative overflow-hidden">
          {/* Luz de acento decorativa */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Columna Izquierda: Información de enlace y estado */}
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                <Sparkles size={13} /> Tu E-Commerce está 100% activo en internet
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                Centro de Control Comercial
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Administra tu catálogo de productos, recibe pedidos por WhatsApp al instante y controla tus utilidades reales en un solo lugar.
              </p>

              {/* Caja de Enlace Oficial para Compartir */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <ExternalLink size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">ENLACE OFICIAL PARA CLIENTES</span>
                    <span className="text-sm font-mono text-emerald-400 font-extrabold truncate block">tiendas.fluxauy.com/t/{storeData.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://tiendas.fluxauy.com/t/${storeData.slug}`);
                      alert('¡Enlace copiado al portapapeles! pégalo en tu biografía de Instagram o WhatsApp.');
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Copy size={14} /> Copiar
                  </button>
                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Visita nuestra tienda oficial en línea y realiza tu pedido fácilmente! 👉 https://tiendas.fluxauy.com/t/${storeData.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/15"
                  >
                    <Share2 size={14} /> Compartir
                  </a>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Acciones Rápidas Intuitivas */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setActiveTab('products');
                  setIsAdding(true);
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-emerald-500/15 border border-slate-700/80 hover:border-emerald-500/50 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                  <Plus size={18} />
                </div>
                <h4 className="font-extrabold text-white text-xs mb-0.5">Cargar {currentTmpl.itemLabel}</h4>
                <p className="text-[11px] text-slate-400">Publicar en tu web</p>
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-indigo-500/15 border border-slate-700/80 hover:border-indigo-500/50 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                  <ShoppingBag size={18} />
                </div>
                <h4 className="font-extrabold text-white text-xs mb-0.5">Pedidos & Ventas</h4>
                <p className="text-[11px] text-slate-400">Ver flujo de pedidos</p>
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-amber-500/15 border border-slate-700/80 hover:border-amber-500/50 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                  <Palette size={18} />
                </div>
                <h4 className="font-extrabold text-white text-xs mb-0.5">Diseño y Plantillas</h4>
                <p className="text-[11px] text-slate-400">Personalizar colores</p>
              </button>

              <button
                onClick={handleQuickSale}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-teal-500/15 border border-slate-700/80 hover:border-teal-500/50 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                  <DollarSign size={18} />
                </div>
                <h4 className="font-extrabold text-white text-xs mb-0.5">Venta Rápida</h4>
                <p className="text-[11px] text-slate-400">Sumar ingreso al día</p>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CHECKLIST DE LANZAMIENTO (BARRA HORIZONTAL COMPACTA)      */}
        {/* ========================================================= */}
        {showTutorial && (
          <div className="bg-white p-6 mb-8 rounded-3xl border border-slate-200/80 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
                  🚀
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Checklist Rápido de Lanzamiento ({progressPercent}% Completado)</h3>
                  <p className="text-xs text-slate-500">Sigue estos 4 pasos para configurar tu tienda al 100%</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTutorial(false)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold underline"
              >
                Ocultar esta guía
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Paso 1 */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">✓</div>
                <div>
                  <h5 className="text-xs font-black text-slate-900">1. Rubro y Plantilla</h5>
                  <p className="text-[11px] text-emerald-800 font-semibold">{currentTmpl.name}</p>
                </div>
              </div>

              {/* Paso 2 */}
              <div 
                onClick={() => {
                  setActiveTab('products');
                  setIsAdding(true);
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${hasProducts ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber-50 border-amber-300 hover:border-amber-400 shadow-sm'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${hasProducts ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white animate-pulse'}`}>
                  {hasProducts ? '✓' : '2'}
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900">2. Cargar {currentTmpl.itemLabel}</h5>
                  <p className="text-[11px] font-semibold text-slate-600">{hasProducts ? `${products.length} cargados` : 'Clic para agregar →'}</p>
                </div>
              </div>

              {/* Paso 3 */}
              <div 
                onClick={() => {
                  setActiveTab('settings');
                  window.scrollTo({ top: 600, behavior: 'smooth' });
                }}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${hasLogoOrBanner ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${hasLogoOrBanner ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                  {hasLogoOrBanner ? '✓' : '3'}
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900">3. Logo y Colores</h5>
                  <p className="text-[11px] font-semibold text-slate-600">Personalizar diseño</p>
                </div>
              </div>

              {/* Paso 4 */}
              <Link 
                href={`/t/${storeData.slug}`} 
                target="_blank"
                className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-between"
              >
                <div>
                  <h5 className="text-xs font-black text-white">4. Ver tu Web en Vivo</h5>
                  <p className="text-[11px] text-emerald-400 font-semibold">Abrir tienda ↗</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ExternalLink size={16} />
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* DASHBOARD FINANCIERO INTELIGENTE (TREINTA / METRICS PRO)   */}
        {/* ========================================================= */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                Resumen Financiero y Métricas del Negocio
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Controla tus utilidades, ventas en efectivo o QR y saldo en tiempo real.</p>
            </div>
            
            {/* Pestañas de Filtro de Tiempo */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
              {(['diario', 'semanal', 'mensual', 'anual'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFilter(period)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
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

          {/* 4 Tarjetas KPI de Alta Elegancia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* KPI 1: UTILIDAD TOTAL */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">Utilidad Neta ({timeFilter})</span>
                <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  📈 Balance
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2">
                ${orders.reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 font-medium mt-1.5 block">Ganancia acumulada del negocio</span>
            </div>

            {/* KPI 2: VENTAS E INGRESOS */}
            <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 hover:border-emerald-300 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider">Ingresos Totales (+)</span>
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">💵</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
                + ${orders.filter(o => o.total_amount > 0).reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-800/80 font-semibold mt-1.5 block">{orders.filter(o => o.total_amount > 0).length} ventas registradas</span>
            </div>

            {/* KPI 3: GASTOS OPERATIVOS */}
            <div className="bg-red-50/70 p-5 rounded-2xl border border-red-200 hover:border-red-300 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-extrabold text-red-900 uppercase tracking-wider">Gastos / Salidas (-)</span>
                <span className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs">💸</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-red-600 mt-2">
                - ${Math.abs(orders.filter(o => o.total_amount < 0).reduce((acc, o) => acc + o.total_amount, 0)).toLocaleString()}
              </div>
              <span className="text-[11px] text-red-800/80 font-semibold mt-1.5 block">{orders.filter(o => o.total_amount < 0).length} salidas reportadas</span>
            </div>

            {/* KPI 4: ESTADO DEL CATÁLOGO */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Catálogo en Línea</span>
                <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">📦</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                {products.length} <span className="text-sm font-bold text-slate-500">ítems</span>
              </div>
              <span className="text-[11px] text-slate-600 font-semibold mt-1.5 block">Disponible 24/7 en tu web</span>
            </div>
          </div>

          {/* Botones de Acción Contable y Catálogo */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleQuickSale}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Plus size={18} /> + Nuevo Ingreso / Venta
            </button>
            <button
              onClick={handleQuickExpense}
              className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-red-500/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Trash2 size={18} /> - Registrar Gasto / Salida
            </button>
            <button
              onClick={() => {
                setActiveTab('products');
                setIsAdding(true);
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <ShoppingBag size={18} /> + Cargar Nuevo Ítem
            </button>
          </div>
        </div>

        {/* TABS NAVEGACIÓN PRINCIPAL */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/95 p-2 rounded-2xl mb-8 shadow-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all ${
              activeTab === 'products' 
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02]' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag size={18} /> Gestión de {currentTmpl.itemLabel}s
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${activeTab === 'products' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-emerald-400'}`}>
              {products.length}
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all ${
              activeTab === 'orders' 
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02]' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar size={18} /> {currentTmpl.managementTabTitle || '📦 Pedidos y Libro Diario'}
            {orders.length > 0 && (
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${activeTab === 'orders' ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                {orders.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2.5 transition-all ${
              activeTab === 'settings' 
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-[1.02]' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings size={18} /> Personalización y Plantillas
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

              {/* Métodos de Pago Habilitados en la Tienda */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <CreditCard className="text-emerald-600" size={20} /> Métodos de Pago Habilitados en tu Tienda
                  </label>
                  <span className="text-xs bg-slate-900 text-amber-400 font-extrabold px-3 py-1 rounded-full">
                    {enabledPaymentMethods.length === 0 ? '⚠️ Ninguno Activado (Por defecto)' : `${enabledPaymentMethods.length} método(s) activo(s)`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed">
                  Activa únicamente las formas de pago con las que deseas cobrar a tus clientes. Por defecto tu tienda inicia sin ninguno activado para que tú elijas exactamente cuáles habilitar.
                </p>

                <div className="space-y-4">
                  {/* 1. Mercado Pago */}
                  <div className={`p-4 rounded-2xl border transition-all ${enabledPaymentMethods.includes('mercadopago') ? 'bg-blue-50/50 border-blue-400 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-sm">MP</div>
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block">Mercado Pago (Online Uruguay & LATAM)</span>
                          <span className="text-[11px] text-slate-500 font-medium">Tarjetas de crédito, débito, Abitab, RedPagos y dinero en cuenta.</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePaymentMethod('mercadopago')}
                        className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${
                          enabledPaymentMethods.includes('mercadopago')
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {enabledPaymentMethods.includes('mercadopago') ? '✓ ACTIVADO' : 'ACTIVAR'}
                      </button>
                    </div>

                    {enabledPaymentMethods.includes('mercadopago') && (
                      <div className="mt-4 pt-3 border-t border-blue-200/60 space-y-2 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">Public Key / Access Token de Mercado Pago:</label>
                          <button
                            type="button"
                            onClick={() => {
                              const mockKey = `APP-USR-${Math.floor(100000 + Math.random() * 900000)}-${Date.now().toString().slice(-4)}`;
                              setMpPublicKey(mockKey);
                            }}
                            className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-md hover:bg-blue-200"
                          >
                            ⚡ Generar Key de Prueba
                          </button>
                        </div>
                        <input 
                          type="text" 
                          className="form-control text-xs font-mono bg-white border-blue-300 text-slate-900" 
                          placeholder="Ej: APP-USR-1234567890..." 
                          value={mpPublicKey} 
                          onChange={e => setMpPublicKey(e.target.value)} 
                        />
                      </div>
                    )}
                  </div>

                  {/* 2. Transferencia Bancaria */}
                  <div className={`p-4 rounded-2xl border transition-all ${enabledPaymentMethods.includes('transferencia') ? 'bg-emerald-50/50 border-emerald-400 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-sm">🏦</div>
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block">Transferencia Bancaria / CBU / Alias</span>
                          <span className="text-[11px] text-slate-500 font-medium">El cliente te transfiere directo a tu cuenta y adjunta el comprobante.</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePaymentMethod('transferencia')}
                        className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${
                          enabledPaymentMethods.includes('transferencia')
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {enabledPaymentMethods.includes('transferencia') ? '✓ ACTIVADO' : 'ACTIVAR'}
                      </button>
                    </div>

                    {enabledPaymentMethods.includes('transferencia') && (
                      <div className="mt-4 pt-3 border-t border-emerald-200/60 space-y-2 animate-in fade-in duration-200">
                        <label className="text-xs font-bold text-slate-700">Datos Bancarios para tus clientes (Banco, CBU / Cuenta, Alias, Titular):</label>
                        <textarea 
                          rows={2}
                          className="form-control text-xs bg-white border-emerald-300 text-slate-900" 
                          placeholder="Ej: Banco BROU / Itaú • Cuenta Corriente #123456 • Alias: mi.tienda.fluxa • Titular: Juan Pérez" 
                          value={bankDetails} 
                          onChange={e => setBankDetails(e.target.value)} 
                        />
                      </div>
                    )}
                  </div>

                  {/* 3. Acordar con Vendedor / Efectivo */}
                  <div className={`p-4 rounded-2xl border transition-all ${enabledPaymentMethods.includes('whatsapp') ? 'bg-amber-50/50 border-amber-400 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">💵</div>
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block">Efectivo / Acordar por WhatsApp al Retirar</span>
                          <span className="text-[11px] text-slate-500 font-medium">El cliente coordina el pago en efectivo o contraentrega por chat.</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePaymentMethod('whatsapp')}
                        className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${
                          enabledPaymentMethods.includes('whatsapp')
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {enabledPaymentMethods.includes('whatsapp') ? '✓ ACTIVADO' : 'ACTIVAR'}
                      </button>
                    </div>

                    {enabledPaymentMethods.includes('whatsapp') && (
                      <div className="mt-4 pt-3 border-t border-amber-200/60 space-y-2 animate-in fade-in duration-200">
                        <label className="text-xs font-bold text-slate-700">Instrucciones o nota opcional para el cliente:</label>
                        <input 
                          type="text"
                          className="form-control text-xs bg-white border-amber-300 text-slate-900" 
                          placeholder="Ej: Pago en mostrador o al repartidor al recibir el pedido." 
                          value={cashInstructions} 
                          onChange={e => setCashInstructions(e.target.value)} 
                        />
                      </div>
                    )}
                  </div>

                  {/* 4. Stripe Global */}
                  <div className={`p-4 rounded-2xl border transition-all ${enabledPaymentMethods.includes('stripe') ? 'bg-purple-50/50 border-purple-400 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-sm">St</div>
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm block">Stripe (Tarjetas Internacionales USD/EUR)</span>
                          <span className="text-[11px] text-slate-500 font-medium">Cobros en dólares o euros con Visa, Mastercard y Apple Pay.</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => togglePaymentMethod('stripe')}
                        className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${
                          enabledPaymentMethods.includes('stripe')
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {enabledPaymentMethods.includes('stripe') ? '✓ ACTIVADO' : 'ACTIVAR'}
                      </button>
                    </div>

                    {enabledPaymentMethods.includes('stripe') && (
                      <div className="mt-4 pt-3 border-t border-purple-200/60 space-y-2 animate-in fade-in duration-200">
                        <label className="text-xs font-bold text-slate-700">Stripe Publishable Key:</label>
                        <input 
                          type="text" 
                          className="form-control text-xs font-mono bg-white border-purple-300 text-slate-900" 
                          placeholder="Ej: pk_live_..." 
                          value={stripeKey} 
                          onChange={e => setStripeKey(e.target.value)} 
                        />
                      </div>
                    )}
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
