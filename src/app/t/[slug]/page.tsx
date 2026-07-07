"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { 
  Store, ShoppingBag, Plus, Minus, Trash2, Smartphone, 
  Search, CheckCircle2, ArrowRight, Lock, Send, X, MapPin, User, MessageSquare, Calendar, Clock, Sparkles, CreditCard, Globe, ShieldCheck, DollarSign 
} from 'lucide-react';
import { Product, OrderMovement } from '@/lib/supabase';
import { STORE_TEMPLATES, DEFAULT_TEMPLATE, getStorePalette } from '@/lib/templates';

interface CartItem {
  product: Product;
  quantity: number;
}

// Estilos únicos e inmersivos para cada una de las 6 plantillas
const getThemeStyles = (tmplId: string) => {
  switch (tmplId) {
    case 'ecommerce':
      return {
        bg: 'bg-[#F8FAFC] text-slate-900',
        headerBg: 'bg-white border-b border-slate-200 shadow-sm py-14',
        headerText: 'text-slate-900 font-sans font-extrabold tracking-tight',
        subText: 'text-slate-500',
        cardBg: 'bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300',
        cardTitle: 'font-bold text-slate-900 text-lg',
        cardDesc: 'text-xs text-slate-500 line-clamp-2',
        drawerBg: 'bg-white text-slate-900 border-l border-slate-200',
        inputClass: 'bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full',
        emptyBg: 'bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-500 shadow-sm',
        badgeBg: 'bg-slate-100 text-slate-700 border border-slate-200',
        isDark: false
      };
    case 'gastronomy':
      return {
        bg: 'bg-[#FFFBF5] text-[#2C221E]',
        headerBg: 'bg-[#2C221E] text-[#FFFBF5] border-b border-[#4A3B32] shadow-xl py-16',
        headerText: 'text-[#FFFBF5] font-serif font-black tracking-wide',
        subText: 'text-[#D8CDBC]',
        cardBg: 'bg-white rounded-3xl border border-[#E6DCD1] shadow-md hover:shadow-2xl transition-all duration-300',
        cardTitle: 'font-serif font-bold text-[#2C221E] text-xl',
        cardDesc: 'text-xs text-[#6B5A52] line-clamp-3 italic',
        drawerBg: 'bg-[#FFFBF5] text-[#2C221E] border-l border-[#E6DCD1]',
        inputClass: 'bg-white border border-[#E6DCD1] text-[#2C221E] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-full',
        emptyBg: 'bg-white border border-[#E6DCD1] rounded-3xl p-16 text-center text-[#6B5A52] shadow-md',
        badgeBg: 'bg-[#FAF0E4] text-[#8C6239] border border-[#E6DCD1]',
        isDark: false
      };
    case 'appointments':
      return {
        bg: 'bg-[#FFF8FB] text-[#3D2C30]',
        headerBg: 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-lg py-14',
        headerText: 'text-white font-sans font-extrabold tracking-wide',
        subText: 'text-rose-100 font-medium',
        cardBg: 'bg-white rounded-[32px] border border-rose-100 shadow-sm hover:shadow-xl hover:border-rose-300 transition-all duration-300',
        cardTitle: 'font-extrabold text-[#3D2C30] text-lg',
        cardDesc: 'text-xs text-[#85656E] line-clamp-2 leading-relaxed',
        drawerBg: 'bg-[#FFF8FB] text-[#3D2C30] border-l border-rose-200',
        inputClass: 'bg-white border border-rose-200 text-[#3D2C30] rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 w-full',
        emptyBg: 'bg-white border border-rose-100 rounded-[32px] p-16 text-center text-[#85656E] shadow-sm',
        badgeBg: 'bg-rose-50 text-rose-700 border border-rose-200',
        isDark: false
      };
    case 'booking':
      return {
        bg: 'bg-[#F3F4F6] text-gray-900',
        headerBg: 'bg-white border-b border-gray-200 shadow-sm py-16',
        headerText: 'text-gray-900 font-extrabold tracking-tight',
        subText: 'text-gray-500 font-medium',
        cardBg: 'bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden',
        cardTitle: 'font-extrabold text-gray-900 text-xl',
        cardDesc: 'text-xs text-gray-600 line-clamp-2 leading-relaxed',
        drawerBg: 'bg-white text-gray-900 border-l border-gray-200',
        inputClass: 'bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full',
        emptyBg: 'bg-white border border-gray-200 rounded-3xl p-16 text-center text-gray-500 shadow-md',
        badgeBg: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
        isDark: false
      };
    case 'services':
      return {
        bg: 'bg-[#0F172A] text-slate-100',
        headerBg: 'bg-slate-900 border-b border-slate-800 shadow-2xl py-16',
        headerText: 'text-white font-extrabold tracking-tight',
        subText: 'text-slate-400',
        cardBg: 'bg-slate-800/90 border border-slate-700 rounded-2xl shadow-lg hover:border-blue-400 transition-all duration-300',
        cardTitle: 'font-bold text-white text-lg',
        cardDesc: 'text-xs text-slate-300 line-clamp-3 leading-relaxed',
        drawerBg: 'bg-slate-900 text-slate-100 border-l border-slate-800',
        inputClass: 'bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full',
        emptyBg: 'bg-slate-800/60 border border-slate-700 rounded-3xl p-16 text-center text-slate-400 shadow-lg',
        badgeBg: 'bg-blue-950/80 text-blue-300 border border-blue-800/50',
        isDark: true
      };
    case 'repairs':
      return {
        bg: 'bg-[#F5F5F4] text-stone-900',
        headerBg: 'bg-stone-900 text-white border-b-4 border-red-600 shadow-xl py-12',
        headerText: 'text-white font-mono font-black uppercase tracking-wider',
        subText: 'text-stone-300 font-mono text-xs',
        cardBg: 'bg-white border-2 border-stone-300 rounded-xl shadow-md hover:border-red-500 transition-all duration-300',
        cardTitle: 'font-black text-stone-900 text-lg uppercase font-mono',
        cardDesc: 'text-xs text-stone-600 line-clamp-2 font-medium',
        drawerBg: 'bg-white text-stone-900 border-l-2 border-stone-300',
        inputClass: 'bg-stone-50 border-2 border-stone-300 text-stone-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full font-mono',
        emptyBg: 'bg-white border-2 border-stone-300 rounded-xl p-16 text-center text-stone-600 shadow',
        badgeBg: 'bg-red-100 text-red-900 border border-red-300 font-mono',
        isDark: false
      };
    default:
      return {
        bg: 'bg-[#F8FAFC] text-slate-900',
        headerBg: 'bg-white border-b border-slate-200 shadow-sm py-14',
        headerText: 'text-slate-900 font-sans font-extrabold tracking-tight',
        subText: 'text-slate-500',
        cardBg: 'bg-white rounded-2xl border border-slate-200 shadow-sm',
        cardTitle: 'font-bold text-slate-900 text-lg',
        cardDesc: 'text-xs text-slate-500',
        drawerBg: 'bg-white text-slate-900 border-l border-slate-200',
        inputClass: 'bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-3 text-sm w-full',
        emptyBg: 'bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-500',
        badgeBg: 'bg-slate-100 text-slate-700 border border-slate-200',
        isDark: false
      };
  }
};

export default function StorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Formulario de reserva / pedido
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [dateVal, setDateVal] = useState('');
  const [timeVal, setTimeVal] = useState('');
  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // Estado para pasarelas de pago (Mercado Pago / Stripe / WhatsApp)
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'mercadopago' | 'stripe'>('mercadopago');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [receiptId, setReceiptId] = useState('');

  useEffect(() => {
    if (!storeData || !dateVal) {
      setTakenSlots([]);
      return;
    }
    const savedOrders = localStorage.getItem(`fluxa_orders_${storeData.id}`);
    if (savedOrders) {
      const orders: OrderMovement[] = JSON.parse(savedOrders);
      const taken = orders
        .filter(o => o.date_val === dateVal && o.time_val && o.status !== 'delivered')
        .map(o => o.time_val!);
      setTakenSlots(taken);
    }
  }, [dateVal, storeData, isCartOpen]);

  useEffect(() => {
    const savedStore = localStorage.getItem('fluxa_current_store');
    let store = null;

    if (savedStore) {
      const parsed = JSON.parse(savedStore);
      if (parsed.slug === slug || slug === 'demo') {
        store = parsed;
      }
    }

    if (!store) {
      store = {
        id: "store-demo-101",
        name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        slug: slug,
        whatsapp_number: "59894968558",
        theme_color: "#00D7C0",
        template_id: "ecommerce",
        subscription_status: "active"
      };
    }

    setStoreData(store);

    const savedProducts = localStorage.getItem(`fluxa_products_${store.id}`);
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // SI NO HAY PRODUCTOS EN LOCALSTORAGE, INICIALIZAR VACÍO (0 productos)
      setProducts([]);
      localStorage.setItem(`fluxa_products_${store.id}`, JSON.stringify([]));
    }

    setLoading(false);
  }, [slug]);

  if (!loading && storeData && storeData.subscription_status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#0D1321]">
        <div className="max-w-md w-full glass-panel p-8 text-center border-red-500/30">
          <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Plataforma No Disponible</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            La web <strong className="text-white">{storeData.name}</strong> se encuentra temporalmente inactiva por revisión de suscripción.
          </p>
          <Link href="/login" className="btn-secondary text-sm w-full justify-center">
            Soy el Administrador: Activar Web
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !storeData) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans font-bold">Cargando plataforma oficial...</div>;
  }

  const tmpl = STORE_TEMPLATES[storeData.template_id] || STORE_TEMPLATES[DEFAULT_TEMPLATE];
  const palette = getStorePalette(storeData.theme_color || tmpl.themeColor);
  const brandColor = palette.primary;
  const fontClass = tmpl.fontFamily;
  const styles = getThemeStyles(storeData.template_id);
  const availableSlots = storeData.available_slots || ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  const addToCart = (prod: Product) => {
    if (!prod.is_available) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === prod.id);
      if (existing) {
        return prev.map(item => item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product: prod, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (paymentMethod === 'mercadopago' || paymentMethod === 'stripe') {
      setReceiptId('FLX-' + (paymentMethod === 'mercadopago' ? 'MP-' : 'STR-') + Math.floor(100000 + Math.random() * 900000));
      setShowPaymentModal(true);
      setPaymentSuccess(false);
      return;
    }

    // 1. Guardar el movimiento/pedido en el historial del comercio para el dashboard (Pago por WhatsApp / Acordado)
    const newOrder: OrderMovement = {
      id: 'ord-' + Date.now(),
      store_id: storeData.id,
      customer_name: customerName,
      phone: storeData.whatsapp_number,
      address: address || undefined,
      date_val: dateVal || undefined,
      time_val: timeVal || undefined,
      notes: notes || undefined,
      items: cart.map(item => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity
      })),
      total_amount: totalPrice,
      status: 'pending',
      payment_status: 'unpaid',
      created_at: new Date().toISOString()
    };

    try {
      const existingOrdersStr = localStorage.getItem(`fluxa_orders_${storeData.id}`);
      const existingOrders: OrderMovement[] = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem(`fluxa_orders_${storeData.id}`, JSON.stringify(updatedOrders));
    } catch (err) {
      console.error('Error al guardar pedido local:', err);
    }

    // 2. Preparar mensaje y abrir WhatsApp
    let message = `*¡Hola ${storeData.name}!* Quiero solicitar lo siguiente desde tu web oficial:\n\n`;
    cart.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.product.title} ($${item.product.price * item.quantity})\n`;
    });
    message += `\n*VALOR TOTAL: $${totalPrice}*\n\n`;
    message += `*Mis Datos y Detalle:*\n`;
    message += `👤 Nombre: ${customerName}\n`;
    
    if (tmpl.askForDate && dateVal) message += `📅 Fecha Deseada: ${dateVal}\n`;
    if (tmpl.askForTime && timeVal) message += `⏰ Horario/Franja: ${timeVal}\n`;
    if (!tmpl.askForDate && address) message += `📍 Dirección/Ubicación: ${address}\n`;
    if (notes) message += `📝 Nota adicional: ${notes}\n`;

    const cleanPhone = storeData.whatsapp_number.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    
    alert('¡Excelente! Tu solicitud fue registrada exitosamente en el panel de administración del negocio. Ahora serás redirigido a WhatsApp para notificarle en tiempo real.');
    window.open(url, '_blank');
  };

  const handleProcessOnlinePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      // Guardar con estado de pago PAGADO en localStorage
      const newOrder: OrderMovement = {
        id: 'ord-' + Date.now(),
        store_id: storeData.id,
        customer_name: customerName,
        phone: storeData.whatsapp_number,
        address: address || undefined,
        date_val: dateVal || undefined,
        time_val: timeVal || undefined,
        notes: notes ? `${notes} [Pagado con ${paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Stripe'}, Ref: ${receiptId}]` : `[Pagado con ${paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Stripe'}, Ref: ${receiptId}]`,
        items: cart.map(item => ({
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity
        })),
        total_amount: totalPrice,
        status: 'in_progress',
        payment_status: 'paid',
        created_at: new Date().toISOString()
      };

      try {
        const existingOrdersStr = localStorage.getItem(`fluxa_orders_${storeData.id}`);
        const existingOrders: OrderMovement[] = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
        const updatedOrders = [newOrder, ...existingOrders];
        localStorage.setItem(`fluxa_orders_${storeData.id}`, JSON.stringify(updatedOrders));
      } catch (err) {
        console.error('Error al guardar pedido pagado en local:', err);
      }

      setIsProcessingPayment(false);
      setPaymentSuccess(true);
    }, 1600);
  };

  const handleFinishOnlinePayment = () => {
    let message = `*¡Hola ${storeData.name}!* Acabo de realizar una solicitud en tu web oficial y *YA ESTÁ 100% PAGADA EN LÍNEA POR ${paymentMethod === 'mercadopago' ? 'MERCADO PAGO' : 'STRIPE'}* ✅\n\n`;
    message += `🎟️ *COMPROBANTE:* #${receiptId}\n\n`;
    cart.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.product.title} ($${item.product.price * item.quantity})\n`;
    });
    message += `\n*VALOR COBRADO: $${totalPrice}*\n\n`;
    message += `*Mis Datos y Envío/Turno:*\n`;
    message += `👤 Nombre: ${customerName}\n`;
    if (tmpl.askForDate && dateVal) message += `📅 Fecha Deseada: ${dateVal}\n`;
    if (tmpl.askForTime && timeVal) message += `⏰ Horario/Franja: ${timeVal}\n`;
    if (!tmpl.askForDate && address) message += `📍 Dirección/Ubicación: ${address}\n`;
    if (notes) message += `📝 Nota: ${notes}\n`;

    const cleanPhone = storeData.whatsapp_number.replace(/\D/g, '');
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    
    setShowPaymentModal(false);
    setIsCartOpen(false);
    setCart([]);
    window.open(url, '_blank');
  };

  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`min-h-screen flex flex-col ${styles.bg} pb-28 ${fontClass} transition-colors duration-500`}>
      {/* Banner promocional superior si existe */}
      {storeData.banner_text && (
        <div className="w-full py-3 px-4 text-center font-extrabold text-sm shadow-md animate-pulse text-white" style={{ backgroundColor: brandColor }}>
          ⚡ {storeData.banner_text}
        </div>
      )}

      {/* Hero Header totalmente diferenciado por plantilla */}
      <header className={`relative px-6 overflow-hidden transition-all ${styles.headerBg}`}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5 text-center sm:text-left">
            {storeData.logo_url ? (
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-black/10 flex items-center justify-center overflow-hidden p-1.5 shadow-xl shrink-0">
                <img src={storeData.logo_url} alt={storeData.name} className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl shrink-0" style={{ backgroundColor: brandColor }}>
                {storeData.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${styles.badgeBg}`}>
                  <span>{tmpl.icon}</span> {tmpl.badgeText}
                </span>
              </div>
              <h1 className={`text-3xl sm:text-4xl ${styles.headerText}`}>{storeData.name}</h1>
              <p className={`text-sm mt-1.5 max-w-lg ${styles.subText}`}>
                {tmpl.heroSubtitle}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-72 relative">
            <input 
              type="text" 
              className={`pl-10 ${styles.inputClass}`}
              placeholder={`Buscar ${tmpl.itemLabel.toLowerCase()}...`} 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Main Catalog / Services Grid */}
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-black/10">
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <Sparkles size={20} style={{ color: brandColor }} /> Catálogo Oficial de {tmpl.itemLabel}s
          </h2>
          <span className="text-xs font-mono opacity-70">{filteredProducts.length} opciones listadas</span>
        </div>

        {/* ESTADO VACÍO SIN ARTÍCULOS DE MUESTRA */}
        {products.length === 0 ? (
          <div className={`${styles.emptyBg} my-8 animate-in fade-in duration-500`}>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center opacity-80" style={{ backgroundColor: `${brandColor}22`, color: brandColor }}>
              <ShoppingBag size={32} />
            </div>
            <h3 className="text-2xl font-black mb-2">Próximamente: Catálogo en Preparación</h3>
            <p className="text-sm max-w-md mx-auto leading-relaxed opacity-80 mb-6">
              El comercio <strong style={{ color: brandColor }}>{storeData.name}</strong> está configurando su catálogo oficial de {tmpl.itemLabel.toLowerCase()}s. ¡Vuelve muy pronto o comunícate por WhatsApp!
            </p>
            <Link 
              href={`https://api.whatsapp.com/send?phone=${storeData.whatsapp_number.replace(/\D/g, '')}`} 
              target="_blank" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 text-sm"
              style={{ backgroundColor: brandColor }}
            >
              <MessageSquare size={16} /> Consultar por WhatsApp
            </Link>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 opacity-60">
            <p>No se encontraron {tmpl.itemLabel.toLowerCase()}s con ese criterio de búsqueda.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-6 ${tmpl.id === 'booking' || tmpl.id === 'services' ? 'md:grid-cols-2' : 'sm:grid-cols-2 md:grid-cols-3'}`}>
            {filteredProducts.map(prod => (
              <div 
                key={prod.id} 
                className={`${styles.cardBg} flex flex-col justify-between ${!prod.is_available ? 'opacity-50 grayscale' : ''}`}
              >
                <div>
                  <div className={`w-full relative overflow-hidden bg-black/5 ${tmpl.id === 'booking' ? 'h-60' : 'h-48'}`}>
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs opacity-40 font-semibold">Sin foto disponible</div>
                    )}
                    {!prod.is_available && (
                      <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-extrabold shadow-lg">
                        No Disponible
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
                      {tmpl.priceLabel}: <strong style={{ color: brandColor }}>${prod.price}</strong>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className={`${styles.cardTitle} mb-2 leading-tight`}>{prod.title}</h3>
                    <p className={styles.cardDesc}>{prod.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button 
                    onClick={() => addToCart(prod)}
                    disabled={!prod.is_available}
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md text-white disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
                    style={{ backgroundColor: prod.is_available ? brandColor : '#64748b' }}
                  >
                    <Plus size={16} /> {prod.is_available ? tmpl.actionButtonText : 'No Disponible'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-lg border-t border-white/10 z-40 animate-in slide-in-from-bottom duration-300 shadow-2xl text-white">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg" style={{ backgroundColor: brandColor }}>
                <ShoppingBag size={20} />
              </div>
              <div>
                <span className="font-bold text-white text-base block">{totalItems} {tmpl.itemLabel.toLowerCase()}s seleccionados</span>
                <span className="text-xs text-gray-300">Total estimado: <strong className="text-white text-sm" style={{ color: brandColor }}>${totalPrice}</strong></span>
              </div>
            </div>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="px-6 py-3 rounded-full font-bold text-sm text-white shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
              style={{ backgroundColor: brandColor }}
            >
              {tmpl.drawerTitle} ({totalItems}) <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Side Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className={`w-screen max-w-md ${styles.drawerBg} shadow-2xl flex flex-col`}>
              {/* Drawer Header */}
              <div className="p-6 border-b border-black/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-xl flex items-center gap-2">
                    <span className="text-2xl">{tmpl.icon}</span> {tmpl.drawerTitle}
                  </h2>
                  <button onClick={() => setIsCartOpen(false)} className="opacity-50 hover:opacity-100 p-1">
                    <X size={24} />
                  </button>
                </div>

                {/* BOTÓN SEGUIR COMPRANDO / ELIGIENDO */}
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed font-extrabold text-xs flex items-center justify-center gap-2 transition-all hover:bg-black/5 shadow-sm"
                  style={{ borderColor: brandColor, color: brandColor }}
                >
                  <ArrowRight size={14} className="rotate-180" /> Seguir comprando / agregando más {tmpl.itemLabel.toLowerCase()}s
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center opacity-60 py-12">No has seleccionado ningún ítem aún.</p>
                ) : (
                  cart.map(item => (
                    <div key={item.product.id} className="p-4 rounded-xl border border-black/10 bg-black/5 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{item.product.title}</h4>
                        <span className="text-xs font-bold" style={{ color: brandColor }}>${item.product.price} {tmpl.priceLabel.toLowerCase()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 rounded bg-black/10 hover:bg-black/20">
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 rounded bg-black/10 hover:bg-black/20">
                          <Plus size={14} />
                        </button>
                        <button onClick={() => updateQuantity(item.product.id, -item.quantity)} className="text-red-500 hover:text-red-700 ml-1 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Dynamic Checkout / Booking Form */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-black/10 bg-black/5 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Estimado:</span>
                    <span style={{ color: brandColor }}>${totalPrice}</span>
                  </div>

                  <form onSubmit={handleSendWhatsApp} className="space-y-3">
                    <div>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                        <input 
                          type="text" 
                          className={`pl-10 ${styles.inputClass}`}
                          placeholder="Tu Nombre y Apellido *" 
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    {tmpl.askForDate ? (
                      <div>
                        <label className="block text-[11px] font-bold opacity-70 mb-1">{tmpl.dateLabel || "📅 Elige la Fecha del Turno *"}</label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
                          <input 
                            type="date" 
                            className={`pl-10 ${styles.inputClass} cursor-pointer font-bold`}
                            value={dateVal}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => {
                              setDateVal(e.target.value);
                              setTimeVal(''); // Reset time when date changes
                            }}
                            required 
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                          <input 
                            type="text" 
                            className={`pl-10 ${styles.inputClass}`}
                            placeholder="Dirección / Ciudad o Localidad *" 
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            required 
                          />
                        </div>
                      </div>
                    )}

                    {tmpl.askForTime && (
                      <div>
                        <label className="block text-[11px] font-bold opacity-70 mb-1.5">{tmpl.timeLabel || "⏰ Selecciona el Horario Disponible *"}</label>
                        {!dateVal ? (
                          <div className="p-3 rounded-xl border border-dashed text-center text-xs opacity-60">
                            👈 Primero selecciona una fecha arriba en el calendario para ver los horarios libres.
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                            {availableSlots.map((slot: string) => {
                              const isTaken = takenSlots.includes(slot);
                              const isSelected = timeVal === slot;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  disabled={isTaken}
                                  onClick={() => setTimeVal(slot)}
                                  className={`py-2 px-1 rounded-lg text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1 ${
                                    isTaken 
                                      ? 'bg-red-500/10 border-red-500/20 text-red-500/50 cursor-not-allowed line-through' 
                                      : isSelected 
                                      ? 'text-white shadow-md scale-105' 
                                      : 'bg-black/5 hover:bg-black/10 border-black/10 text-current'
                                  }`}
                                  style={isSelected ? { backgroundColor: brandColor, borderColor: brandColor } : {}}
                                >
                                  <span>{isTaken ? '🔴' : isSelected ? '🟢' : '⚪'}</span> {slot}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {dateVal && (
                          <p className="text-[10px] mt-1.5 opacity-60 flex items-center justify-between">
                            <span>⚪ Libre</span>
                            <span>🟢 Seleccionado</span>
                            <span>🔴 Ocupado / Reservado</span>
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="relative">
                        <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                        <input 
                          type="text" 
                          className={`pl-10 ${styles.inputClass}`}
                          placeholder="Notas extra / Consultas particulares..." 
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Selector de Pasarela de Pago Directo */}
                    <div className="pt-2">
                      <label className="block text-[11px] font-bold opacity-80 mb-2">💳 Elige tu Forma de Pago:</label>
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('mercadopago')}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                            paymentMethod === 'mercadopago' 
                              ? 'bg-blue-500/10 border-blue-500 shadow-md ring-1 ring-blue-500 font-bold' 
                              : 'bg-black/5 border-black/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">MP</div>
                            <div>
                              <span className="text-xs block leading-tight font-extrabold">Mercado Pago (Online)</span>
                              <span className="text-[10px] opacity-70">Tarjetas, Débito, RedPagos, Abitab • Uruguay / LATAM</span>
                            </div>
                          </div>
                          {paymentMethod === 'mercadopago' && <CheckCircle2 size={18} className="text-blue-500 shrink-0" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('stripe')}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                            paymentMethod === 'stripe' 
                              ? 'bg-purple-500/10 border-purple-500 shadow-md ring-1 ring-purple-500 font-bold' 
                              : 'bg-black/5 border-black/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-xs shrink-0">St</div>
                            <div>
                              <span className="text-xs block leading-tight font-extrabold">Stripe (Tarjeta Internacional)</span>
                              <span className="text-[10px] opacity-70">Visa, Mastercard, Apple Pay en USD / EUR</span>
                            </div>
                          </div>
                          {paymentMethod === 'stripe' && <CheckCircle2 size={18} className="text-purple-500 shrink-0" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentMethod('whatsapp')}
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                            paymentMethod === 'whatsapp' 
                              ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-1 ring-emerald-500 font-bold' 
                              : 'bg-black/5 border-black/10 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shrink-0">💬</div>
                            <div>
                              <span className="text-xs block leading-tight font-extrabold">Acordar Pago con Vendedor</span>
                              <span className="text-[10px] opacity-70">Pago en efectivo, transferencia o al retirar por WhatsApp</span>
                            </div>
                          </div>
                          {paymentMethod === 'whatsapp' && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
                        </button>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-3.5 rounded-xl font-extrabold text-white flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-transform mt-4"
                      style={{ backgroundColor: brandColor }}
                    >
                      {paymentMethod === 'whatsapp' ? (
                        <><Send size={18} /> Enviar Pedido por WhatsApp</>
                      ) : (
                        <><CreditCard size={18} /> Continuar a Pago Online (${totalPrice})</>
                      )}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-2.5 rounded-xl bg-black/10 hover:bg-black/20 font-bold text-xs flex items-center justify-center gap-2 transition-all mt-2"
                    >
                      <ArrowRight size={14} className="rotate-180" /> Seguir comprando / eligiendo más
                    </button>
                  </form>
                  <p className="text-[10px] text-center opacity-60">
                    Al hacer clic, se abrirá WhatsApp con el detalle listo para el vendedor.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto pt-10 pb-6 text-center border-t border-black/10">
        <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 text-xs opacity-70 hover:opacity-100 transition-opacity bg-black/5 px-4 py-2 rounded-full font-semibold">
          <Store size={14} style={{ color: brandColor }} /> Plataforma web con tecnología <strong className="font-black">Fluxa Tiendas</strong>
        </Link>
      </footer>

      {/* MODAL DE PASARELA DE PAGO DIRECTO (MERCADO PAGO / STRIPE) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900 overflow-hidden relative">
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-md ${paymentMethod === 'mercadopago' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                  {paymentMethod === 'mercadopago' ? 'MP' : 'St'}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 leading-tight">
                    {paymentMethod === 'mercadopago' ? 'Mercado Pago Checkout Pro' : 'Stripe Connect Security'}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-600" /> Transacción encriptada 256-bit SSL para {storeData.name}
                  </span>
                </div>
              </div>
              {!isProcessingPayment && !paymentSuccess && (
                <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                  <X size={22} />
                </button>
              )}
            </div>

            {paymentSuccess ? (
              <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">¡Pago 100% Aprobado!</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto font-medium">
                  Tu pago de <strong className="text-slate-900 font-extrabold">${totalPrice}</strong> fue procesado y acreditado automáticamente en la cuenta de <strong className="text-slate-900">{storeData.name}</strong>.
                </p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-xs mx-auto text-xs text-left space-y-1">
                  <div className="flex justify-between font-bold text-slate-500"><span>Comprobante:</span> <span className="font-mono text-slate-900 font-extrabold">{receiptId}</span></div>
                  <div className="flex justify-between font-bold text-slate-500"><span>Medio:</span> <span className="text-slate-900">{paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Stripe'}</span></div>
                  <div className="flex justify-between font-bold text-slate-500"><span>Estado:</span> <span className="text-emerald-600 font-extrabold">Cobrado / Acreditado</span></div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleFinishOnlinePayment}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Send size={20} /> Enviar Comprobante por WhatsApp al Negocio ↗
                  </button>
                </div>
              </div>
            ) : isProcessingPayment ? (
              <div className="text-center py-12 space-y-6 animate-in fade-in">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
                <div>
                  <h4 className="font-black text-lg text-slate-900">Procesando pago seguro...</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Conectando con servidores bancarios y verificando fondos.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Resumen del cobro */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Comercio receptor:</span>
                    <strong className="text-sm font-extrabold text-slate-900">{storeData.name}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-bold block">Total a cobrar:</span>
                    <span className="text-2xl font-black text-slate-900">${totalPrice}</span>
                  </div>
                </div>

                {/* Formulario Simulado de Tarjeta */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">Número de Tarjeta de Crédito / Débito</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="form-control text-sm font-mono bg-white border-slate-300 text-slate-900 pl-10"
                      placeholder="4500 •••• •••• 8912"
                      defaultValue="4532 8921 0019 4821"
                      readOnly
                    />
                    <CreditCard size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Vencimiento</label>
                      <input type="text" className="form-control text-sm font-mono bg-white border-slate-300 text-slate-900" defaultValue="08/29" readOnly />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Código CVC / CVV</label>
                      <input type="text" className="form-control text-sm font-mono bg-white border-slate-300 text-slate-900" defaultValue="842" readOnly />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Titular</label>
                    <input type="text" className="form-control text-sm bg-white border-slate-300 text-slate-900 font-bold uppercase" defaultValue={customerName || "CLIENTE FLUXA UY"} readOnly />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleProcessOnlinePayment}
                    className={`w-full py-4 rounded-2xl font-black text-base text-white shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] ${
                      paymentMethod === 'mercadopago' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/25'
                    }`}
                  >
                    <Lock size={18} /> Confirmar y Pagar ${totalPrice} Ahora
                  </button>
                  <p className="text-[11px] text-center text-slate-400 font-medium mt-3">
                    Ambiente protegido. Al confirmar, el dinero se acreditará de forma inmediata en la pasarela del vendedor.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
