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
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Top Navbar */}
      <header className="border-b border-[var(--border-glass)] bg-[rgba(13,19,33,0.8)] backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent-cyan)] to-[var(--accent-blue)] flex items-center justify-center text-white font-bold shadow-lg">
              <Store size={22} />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">{storeData.name}</h1>
              <span className="text-xs text-[var(--accent-cyan)] flex items-center gap-1 font-semibold">
                <CheckCircle2 size={12} /> {storeData.plan_type === 'pro' ? 'Plan PRO Llave en Mano' : 'Plan Básico Autogestión'} • {currentTmpl.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href={`/t/${storeData.slug}`} 
              target="_blank"
              className="btn-secondary text-xs !py-2 !px-4 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 shadow-sm"
            >
              Ver mi Web en Vivo <ExternalLink size={14} />
            </Link>
            <button onClick={handleLogout} className="text-[var(--text-secondary)] hover:text-red-400 p-2" title="Cerrar Sesión">
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
          <div className="glass-panel p-6 mb-8 border-2 border-[var(--accent-cyan)] bg-gradient-to-r from-[rgba(0,215,192,0.1)] via-[rgba(13,19,33,0.9)] to-[rgba(13,19,33,0.9)] relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono bg-[var(--accent-cyan)] text-black px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider mb-2 inline-block">
                  🚀 Tutorial de Bienvenida
                </span>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  Configura tu Web Inteligente ({currentTmpl.name}) en 4 Pasos
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Sigue esta guía interactiva para publicar tu negocio y empezar a recibir pedidos por WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/10 shrink-0">
                <div className="text-right">
                  <span className="text-xs text-[var(--text-secondary)] block">Tu Progreso:</span>
                  <span className="text-lg font-black text-cyan-400">{progressCount} de 4 pasos ({progressPercent}%)</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 flex items-center justify-center font-bold text-white text-xs bg-cyan-500/10">
                  {progressPercent}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* PASO 1 */}
              <div className="bg-black/50 p-4 rounded-xl border border-green-500/40 relative">
                <div className="flex items-center gap-2 text-green-400 font-bold text-xs mb-1">
                  <CheckCircle2 size={16} /> PASO 1 • COMPLETADO
                </div>
                <h4 className="font-extrabold text-white text-sm mb-1">Elegir rubro y plantilla</h4>
                <p className="text-xs text-[var(--text-secondary)]">Has seleccionado la plantilla <strong className="text-cyan-300">{currentTmpl.name}</strong>.</p>
              </div>

              {/* PASO 2 */}
              <div className={`p-4 rounded-xl border transition-all ${hasProducts ? 'bg-black/50 border-green-500/40' : 'bg-cyan-500/10 border-cyan-400 shadow-lg'}`}>
                <div className={`flex items-center gap-2 font-bold text-xs mb-1 ${hasProducts ? 'text-green-400' : 'text-cyan-400 animate-pulse'}`}>
                  {hasProducts ? <CheckCircle2 size={16} /> : <Sparkles size={16} />} PASO 2 • {hasProducts ? 'COMPLETADO' : 'ACCIÓN REQUERIDA'}
                </div>
                <h4 className="font-extrabold text-white text-sm mb-1">Cargar tu primer {currentTmpl.itemLabel}</h4>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Tu catálogo está vacío para que agregues tus opciones reales.</p>
                {!hasProducts && (
                  <button 
                    onClick={() => {
                      setActiveTab('products');
                      setIsAdding(true);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-full py-1.5 bg-[var(--accent-cyan)] hover:bg-cyan-300 text-black rounded-lg text-xs font-black transition-transform hover:scale-105 flex items-center justify-center gap-1"
                  >
                    ➕ Cargar {currentTmpl.itemLabel} <ArrowRight size={12} />
                  </button>
                )}
              </div>

              {/* PASO 3 */}
              <div className={`p-4 rounded-xl border transition-all ${hasLogoOrBanner ? 'bg-black/50 border-green-500/40' : 'bg-black/30 border-white/10'}`}>
                <div className={`flex items-center gap-2 font-bold text-xs mb-1 ${hasLogoOrBanner ? 'text-green-400' : 'text-amber-400'}`}>
                  {hasLogoOrBanner ? <CheckCircle2 size={16} /> : <Settings size={16} />} PASO 3 • {hasLogoOrBanner ? 'COMPLETADO' : 'OPCIONAL'}
                </div>
                <h4 className="font-extrabold text-white text-sm mb-1">Logo, Color y Paleta</h4>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Asegúrate de que el color y nombre coincidan con tu marca.</p>
                <button 
                  onClick={() => {
                    setActiveTab('settings');
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  🎨 Ir a Ajustes <ArrowRight size={12} />
                </button>
              </div>

              {/* PASO 4 */}
              <div className="bg-black/30 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs mb-1">
                    <ExternalLink size={16} /> PASO 4 • EN VIVO
                  </div>
                  <h4 className="font-extrabold text-white text-sm mb-1">Ver y compartir tu enlace</h4>
                  <p className="text-xs text-[var(--text-secondary)]">Tu web tiene una apariencia 100% personalizada por fuera.</p>
                </div>
                <Link 
                  href={`/t/${storeData.slug}`} 
                  target="_blank"
                  className="mt-3 w-full py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 text-white rounded-lg text-xs font-black text-center block shadow"
                >
                  🌐 Abrir Mi Web ↗
                </Link>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setShowTutorial(false)}
                className="text-[11px] text-[var(--text-secondary)] hover:text-white underline"
              >
                Ocultar este tutorial de bienvenida
              </button>
            </div>
          </div>
        )}

        {/* Banner de Enlace Público */}
        <div className="glass-panel p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-[var(--accent-cyan)] bg-gradient-to-r from-[rgba(0,215,192,0.05)] to-transparent">
          <div>
            <h3 className="font-bold text-white text-base">🔗 Enlace oficial para tus clientes ({currentTmpl.badgeText}):</h3>
            <p className="text-sm font-mono text-cyan-300 mt-1">tiendas.fluxa.com/t/{storeData.slug}</p>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`http://localhost:3000/t/${storeData.slug}`);
              alert('¡Enlace copiado al portapapeles! Listo para pegar en tu Instagram o WhatsApp.');
            }}
            className="btn-secondary text-xs !py-2"
          >
            Copiar Enlace
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-glass)] mb-8 gap-6">
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-3 font-bold text-base flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === 'products' 
                ? 'border-[var(--accent-cyan)] text-[var(--accent-cyan)]' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <ShoppingBag size={18} /> Gestión de {currentTmpl.itemLabel}s ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`pb-3 font-bold text-base flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === 'settings' 
                ? 'border-[var(--accent-cyan)] text-[var(--accent-cyan)]' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <Settings size={18} /> Plantilla y Ajustes
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-bold text-base flex items-center gap-2 transition-colors border-b-2 ${
              activeTab === 'orders' 
                ? 'border-[var(--accent-cyan)] text-[var(--accent-cyan)]' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            <Calendar size={18} /> {currentTmpl.managementTabTitle || '📦 Pedidos y Cobros'} {orders.length > 0 && <span className="bg-cyan-500 text-black text-xs px-2 py-0.5 rounded-full font-black">{orders.length}</span>}
          </button>
        </div>

        {/* TAB 1: PRODUCTOS */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Listado Oficial de {currentTmpl.itemLabel}s</h2>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className="btn-primary text-sm !py-2.5 !px-5 shadow-lg shadow-cyan-500/20"
              >
                <Plus size={18} /> {isAdding ? 'Cancelar' : `Nuevo ${currentTmpl.itemLabel}`}
              </button>
            </div>

            {/* Formulario de agregar */}
            {isAdding && (
              <form onSubmit={handleAddProduct} className="glass-panel p-6 mb-8 border-2 border-[var(--accent-cyan)] animate-in fade-in duration-300 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Sparkles className="text-cyan-400" size={18} /> ✨ Crear Nuevo {currentTmpl.itemLabel}
                  </h3>
                  <span className="text-xs text-[var(--text-secondary)]">Plantilla: {currentTmpl.name}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Título / Nombre *</label>
                    <input type="text" className="form-control" placeholder={`Ej. ${currentTmpl.id === 'appointments' ? 'Corte de Cabello - 45min' : currentTmpl.id === 'gastronomy' ? 'Pizza Especial Doble Queso' : 'Nombre de tu artículo'}`} value={title} onChange={e => setTitle(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">{currentTmpl.priceLabel} *</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-3.5 text-gray-400" />
                      <input type="number" step="0.01" className="form-control pl-8" placeholder="150.00" value={price} onChange={e => setPrice(e.target.value)} required />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Descripción</label>
                  <textarea className="form-control" rows={2} placeholder="Detalles, ingredientes, duración o características..." value={desc} onChange={e => setDesc(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Foto del {currentTmpl.itemLabel} (Sube directo desde tu PC/Celular o pega link)</label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <label className="w-full sm:w-auto px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl cursor-pointer text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0">
                      📂 Subir Foto Local
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setImgUrl)} />
                    </label>
                    <span className="text-[11px] text-[var(--text-secondary)]">O link:</span>
                    <div className="relative flex-1 w-full">
                      <ImageIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                      <input type="text" className="form-control pl-8 text-xs w-full" placeholder="https://... (o sube archivo con el botón izquierdo)" value={imgUrl} onChange={e => setImgUrl(e.target.value)} />
                    </div>
                    {imgUrl && (
                      <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={imgUrl} alt="Preview" className="max-w-full max-h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary text-sm !py-2">Cancelar</button>
                  <button type="submit" className="btn-primary text-sm !py-2 shadow-md">Guardar y Publicar en Web</button>
                </div>
              </form>
            )}

            {/* Lista de productos */}
            {products.length === 0 ? (
              <div className="glass-panel p-16 text-center border-2 border-dashed border-[var(--border-glass)]">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <ShoppingBag size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Tu web está limpia y sin artículos de muestra</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">
                  Hemos eliminado cualquier producto de demostración para que tu catálogo sea 100% real desde el primer segundo.
                </p>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Plus size={18} /> Cargar Mi Primer {currentTmpl.itemLabel} Ahora
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(prod => (
                  <div key={prod.id} className={`glass-panel overflow-hidden flex flex-col transition-all ${!prod.is_available ? 'opacity-50 grayscale' : ''}`}>
                    <div className="h-48 w-full bg-[rgba(255,255,255,0.05)] relative overflow-hidden">
                      {prod.image_url ? (
                        <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)] text-xs">Sin foto adjunta</div>
                      )}
                      <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${prod.is_available ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                        {prod.is_available ? 'En Stock' : 'Agotado'}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="font-bold text-white text-lg leading-tight">{prod.title}</h4>
                          <span className="font-extrabold text-cyan-400 text-lg">${prod.price}</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">{prod.description}</p>
                      </div>

                      <div className="pt-4 border-t border-[var(--border-glass)] flex justify-between items-center">
                        <button 
                          onClick={() => handleToggleAvailable(prod.id)}
                          className="text-xs text-[var(--text-secondary)] hover:text-white underline"
                        >
                          {prod.is_available ? 'Marcar Agotado' : 'Marcar Disponible'}
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-red-400 hover:text-red-300 p-1.5 rounded bg-red-500/10 transition-colors"
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
          <div className="max-w-3xl glass-panel p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="text-[var(--accent-cyan)]" /> Personalización y Ajustes de tu Tienda
            </h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">Nombre de la Tienda *</label>
                  <input type="text" className="form-control" value={storeName} onChange={e => setStoreName(e.target.value)} required />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">WhatsApp para Pedidos *</label>
                  <div className="relative">
                    <input type="tel" className="form-control pl-10" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required />
                    <Smartphone size={18} className="absolute left-3 top-3.5 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Logo y Banner */}
              <div className="pt-4 border-t border-[var(--border-glass)] grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">Logo de tu Emprendimiento / Empresa</label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <label className="w-full sm:w-auto px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl cursor-pointer text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0">
                      📂 Subir Logo Local
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setLogoUrl)} />
                    </label>
                    <input type="text" className="form-control text-xs flex-1" placeholder="O pega link (https://...)" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} />
                    {logoUrl && (
                      <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden p-1">
                        <img src={logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1.5">Sube la imagen desde tu computadora o celular sin necesidad de links externos.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">Mensaje o Promoción (Banner Superior)</label>
                  <input type="text" className="form-control text-sm" placeholder="Ej: ¡Envío gratis comprando más de $1500!" value={bannerText} onChange={e => setBannerText(e.target.value)} />
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Un texto destacado para atraer la atención de tus clientes.</p>
                </div>
              </div>

              {/* Selector de Plantilla de Negocio */}
              <div className="pt-4 border-t border-[var(--border-glass)]">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-[var(--text-secondary)]">Plantilla y Tipo de Negocio</label>
                  <span className="text-xs text-cyan-400 bg-[rgba(0,215,192,0.1)] px-2.5 py-0.5 rounded-full font-semibold">Cambio Instantáneo</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Al cambiar de plantilla, tu sitio web público se reorganizará automáticamente al formato y paleta visual elegidos.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(STORE_TEMPLATES).map(tmpl => {
                    const isSelected = templateId === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          setTemplateId(tmpl.id);
                          setThemeColor(tmpl.themeColor);
                        }}
                        className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                          isSelected ? 'border-[var(--accent-cyan)] bg-[rgba(0,215,192,0.12)] shadow-md' : 'border-[var(--border-glass)] bg-black/30 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{tmpl.icon}</span>
                          {isSelected && <span className="text-[10px] bg-[var(--accent-cyan)] text-black font-extrabold px-2 py-0.5 rounded uppercase">Activa</span>}
                        </div>
                        <span className="font-bold text-white text-sm mb-1">{tmpl.name}</span>
                        <span className="text-[11px] text-cyan-300 font-semibold mb-1">{tmpl.category}</span>
                        <span className="text-[11px] text-[var(--text-secondary)] line-clamp-2">{tmpl.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Paleta de Colores (10 Paletas de 4 Colores) */}
              <div className="pt-4 border-t border-[var(--border-glass)]">
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-1">Paleta de Marca (4 Colores en Armonía)</label>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Cada paleta define el color primario, secundario, acento brillante y tinte de superficie de tu web.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {STORE_PALETTES.map(pal => {
                    const isSelected = themeColor === pal.id || themeColor === pal.primary;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => setThemeColor(pal.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                          isSelected ? 'border-white bg-white/10 shadow-lg scale-[1.02]' : 'border-white/10 bg-black/40 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">{pal.name}</span>
                          <span className="text-[10px] text-gray-400">Primario • Secundario • Acento • Fondo</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 bg-black/50 p-1 rounded-lg border border-white/10">
                          <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: pal.primary }} title="Primario" />
                          <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: pal.secondary }} title="Secundario" />
                          <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: pal.accent }} title="Acento" />
                          <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: pal.surface }} title="Superficie" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gestión de Turnos y Horarios para Plantillas de Citas / Reservas */}
              {(templateId === 'appointments' || templateId === 'booking') && (
                <div className="pt-6 border-t border-[var(--border-glass)] animate-in fade-in duration-300">
                  <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                    <Clock className="text-[var(--accent-cyan)]" size={18} /> Gestión de Horarios / Turnos Disponibles
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mb-4">
                    Haz clic en los turnos para activarlos o desactivarlos. Los turnos tomados por clientes se bloquearán automáticamente en el calendario de la web pública.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4 bg-black/40 p-4 rounded-xl border border-white/10">
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
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                            isAvail 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/40 hover:bg-green-500/30' 
                              : 'bg-red-500/10 text-red-400/60 border border-red-500/20 line-through hover:opacity-100'
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
                      className="form-control text-xs" 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (newSlotInput && !availableSlots.includes(newSlotInput)) {
                          setAvailableSlots(prev => [...prev, newSlotInput].sort());
                          setNewSlotInput('');
                        }
                      }}
                      className="btn-secondary text-xs shrink-0 !py-2"
                    >
                      ➕ Agregar Horario
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button type="submit" className="btn-primary px-8 py-3.5 text-base w-full sm:w-auto shadow-lg shadow-cyan-500/20">
                  Guardar Toda la Configuración
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PEDIDOS Y COBROS (CUENTAS CORRIENTES) */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            {/* Barra de Estadísticas Financieras */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-5 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-500/10 to-transparent">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Total Facturado / Solicitado</span>
                <div className="text-2xl font-black text-white mt-1">
                  ${orders.reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
                </div>
                <span className="text-[11px] text-[var(--text-secondary)]">{orders.length} {currentTmpl.movementName.toLowerCase()}s en total</span>
              </div>

              <div className="glass-panel p-5 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/10 to-transparent">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Por Cobrar (Quién me debe)</span>
                <div className="text-2xl font-black text-white mt-1">
                  ${orders.filter(o => o.payment_status === 'unpaid' || o.payment_status === 'partial').reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
                </div>
                <span className="text-[11px] text-amber-300/80 font-semibold">{orders.filter(o => o.payment_status === 'unpaid' || o.payment_status === 'partial').length} pendientes de pago</span>
              </div>

              <div className="glass-panel p-5 border-l-4 border-l-green-500 bg-gradient-to-r from-green-500/10 to-transparent">
                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Total Cobrado / Saldado</span>
                <div className="text-2xl font-black text-white mt-1">
                  ${orders.filter(o => o.payment_status === 'paid').reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
                </div>
                <span className="text-[11px] text-green-300/80 font-semibold">{orders.filter(o => o.payment_status === 'paid').length} pagados al 100%</span>
              </div>
            </div>

            {/* Filtros Rápido */}
            <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Filter size={16} className="text-[var(--accent-cyan)]" /> Filtrar por estado:
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      orderFilter === tab.id
                        ? 'bg-[var(--accent-cyan)] text-black shadow'
                        : 'bg-white/10 text-[var(--text-secondary)] hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Listado de Pedidos */}
            {orders.length === 0 ? (
              <div className="glass-panel p-16 text-center border-2 border-dashed border-[var(--border-glass)]">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Historial de {currentTmpl.movementName}s Limpio</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6">
                  Cuando tus clientes hagan pedidos, reservas o agenden citas desde tu web pública, aparecerán instantáneamente en esta sección para que gestiones sus entregas y cobros.
                </p>
                <Link
                  href={`/t/${storeData.slug}`}
                  target="_blank"
                  className="btn-primary px-6 py-3 text-sm inline-flex items-center gap-2 shadow-lg shadow-cyan-500/20"
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

                    return (
                      <div key={ord.id} className="glass-panel p-6 border-l-4 transition-all hover:border-l-[var(--accent-cyan)] space-y-4">
                        {/* Cabecera del pedido */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded font-bold">
                              {currentTmpl.movementName} • #{ord.id.slice(-6)}
                            </span>
                            <h4 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
                              <User size={18} className="text-gray-400" /> {ord.customer_name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-xs text-[var(--text-secondary)] block">Total a Cobrar:</span>
                              <span className="text-xl font-black text-white">${ord.total_amount.toLocaleString()}</span>
                            </div>
                            <span className="text-xs text-[var(--text-secondary)] bg-black/40 px-2.5 py-1 rounded border border-white/10">
                              <Clock size={12} className="inline mr-1" /> {new Date(ord.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Detalle y Datos del Cliente */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-black/30 p-3.5 rounded-xl border border-white/5">
                          <div className="space-y-1">
                            <span className="font-bold text-gray-400 block">📞 Contacto del Cliente:</span>
                            <div className="text-white font-mono">{ord.phone || 'No especificado'}</div>
                            {ord.address && (
                              <div className="text-[11px] text-cyan-300 mt-1 flex items-start gap-1">
                                <MapPin size={14} className="shrink-0 mt-0.5" /> {ord.address}
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-gray-400 block">📅 Fecha / Horario Solicitado:</span>
                            <div className="text-white">
                              {ord.date_val ? `🗓️ ${ord.date_val}` : 'No aplica fecha específica'}
                            </div>
                            {ord.time_val && <div className="text-amber-300">⏰ {ord.time_val}</div>}
                            {ord.notes && <div className="text-gray-300 italic mt-1">📝 "{ord.notes}"</div>}
                          </div>
                          <div className="space-y-1">
                            <span className="font-bold text-gray-400 block">🛍️ Ítems del {currentTmpl.movementName}:</span>
                            <ul className="text-white space-y-0.5">
                              {ord.items.map(item => (
                                <li key={item.id} className="flex justify-between">
                                  <span>{item.quantity}x {item.title}</span>
                                  <span className="font-mono text-gray-400">${item.price * item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Barra de Gestión: Estados y Cobranza */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
                          {/* Selector de Estado Operativo */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[var(--text-secondary)]">Estado operativo:</span>
                            <select
                              value={ord.status}
                              onChange={e => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                              className="bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:border-cyan-400 cursor-pointer"
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
                              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all shadow ${
                                isPaid
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 animate-pulse'
                              }`}
                            >
                              <CreditCard size={14} />
                              {isPaid ? '✅ COBRADO (100% Pagado)' : '❌ PENDIENTE DE COBRO (Deudor)'}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const cleanPhone = (ord.phone || storeData.whatsapp_number).replace(/\D/g, '');
                                const msg = `Hola ${ord.customer_name}, te escribo desde ${storeData.name} por tu ${currentTmpl.movementName.toLowerCase()} #${ord.id.slice(-4)}. Estado: ${currentStatusLabel}.`;
                                window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`, '_blank');
                              }}
                              className="btn-secondary text-xs !py-1.5 flex items-center gap-1.5 bg-green-600/30 hover:bg-green-600/50 text-green-300 border-green-500/30"
                            >
                              <MessageSquare size={14} /> WhatsApp Cliente
                            </button>
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
