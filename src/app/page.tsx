"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  ArrowRight, CheckCircle2, Smartphone, Zap, ShoppingBag, 
  ShieldCheck, DollarSign, Sparkles, Utensils, Scissors, Building2, 
  HelpCircle, Star, Clock, Gift, BarChart3, Receipt, Users, Layers,
  Check, ExternalLink, MessageCircle
} from 'lucide-react';

export default function Home() {
  // Animación del texto principal rotativo en Hero (estilo Treinta)
  const rotatingWords = ['Gestión', 'Contabilidad', 'Punto de venta', 'Inventarios', 'Tienda Online'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Selector de período en Planes y Precios (Mensual / Trimestral / Anual)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('annual');

  // Categorías interactivas seleccionadas en "No importa el rubro"
  const [activeCategory, setActiveCategory] = useState<'gastro' | 'retail' | 'services' | 'markets'>('gastro');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      <Navbar />

      {/* ========================================================= */}
      {/* HERO SECTION ESTILO TREINTA                               */}
      {/* ========================================================= */}
      <section className="relative pt-12 pb-20 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Columna Izquierda Hero */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 text-xs font-black uppercase tracking-wider mb-6">
              <Sparkles size={14} className="text-amber-600" /> Sistema líder en Uruguay y Latinoamérica
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900 mb-4">
              Sistema de <br />
              <span className="inline-block bg-amber-400 text-slate-950 px-3.5 py-1 rounded-2xl shadow-sm transform -rotate-1 transition-all duration-300">
                {rotatingWords[currentWordIndex]}
              </span> <br />
              para tu negocio
            </h1>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-600 mb-8 tracking-tight">
              Digitaliza tu negocio ¡De cero a Fluxa!
            </h2>

            {/* Checklist Beneficios Hero */}
            <div className="space-y-3.5 mb-9">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 font-black text-xs">
                  ✓
                </div>
                <span className="text-base font-bold text-slate-800">Somos la plataforma más fácil e intuitiva</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 font-black text-xs">
                  ✓
                </div>
                <span className="text-base font-bold text-slate-800">Úsalo desde el celular, tablet y computador</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 font-black text-xs">
                  ✓
                </div>
                <span className="text-base font-bold text-slate-800">Conoce las estadísticas y ventas en tiempo real</span>
              </div>
            </div>

            {/* Botones de acción principales */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <Link 
                href="/register" 
                className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-base shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Prueba ahora gratis <ArrowRight size={18} />
              </Link>

              <a 
                href="https://api.whatsapp.com/send?phone=59894968558&text=Hola%20Fluxa!%20Quiero%20conocer%20el%20sistema%20de%20gesti%C3%B3n%20para%20mi%20negocio" 
                target="_blank" 
                rel="noreferrer"
                className="px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-base border-2 border-slate-200 flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle size={18} className="text-emerald-500" /> Contáctanos
              </a>
            </div>

            {/* Rating & Contadores */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {'★★★★★'}
                </div>
                <span className="text-xs font-extrabold text-slate-700">4.9 de 5 en miles de comercios</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-slate-900">+10,000</span>
                <span className="text-xs text-slate-600 font-semibold">negocios confían en Fluxa</span>
              </div>
            </div>
          </div>

          {/* Columna Derecha Hero: Mockup Interactivo / Visual */}
          <div className="lg:col-span-5 relative">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-7 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-[11px] uppercase px-4 py-1.5 rounded-bl-2xl tracking-wider shadow">
                Planes desde $5.99 USD/mes
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                  POS
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">Caja & Inventario Fluxa</h3>
                  <p className="text-xs text-slate-400">Todo tu negocio en una sola pantalla</p>
                </div>
              </div>

              {/* Mini Pantalla Demostrativa */}
              <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
                  <span className="text-xs text-slate-400 font-bold">Ventas del Día</span>
                  <span className="text-sm font-black text-emerald-400">+$18,450 UYU</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
                  <span className="text-xs text-slate-400 font-bold">Artículos en Stock</span>
                  <span className="text-sm font-black text-white">428 productos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold">Tienda Web & WhatsApp</span>
                  <span className="text-[11px] font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                    Activa • 0% Comisión
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800/80 flex justify-between items-center">
                <span className="text-xs text-slate-400">¿Listo para probarlo hoy?</span>
                <Link href="/register" className="text-xs font-black text-amber-400 hover:underline flex items-center gap-1">
                  Crear mi cuenta gratis →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* ¿QUÉ PUEDES HACER CON FLUXA TIENDAS?                      */}
      {/* ========================================================= */}
      <section id="funcionalidades" className="py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-100/80 px-3.5 py-1.5 rounded-full">
              Funcionalidades Completas
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-4 tracking-tight">
              ¿Qué puedes hacer con Fluxa?
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              Todas las herramientas que necesitas para llevar la contabilidad, stock y ventas de tu negocio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tarjeta 1 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <Receipt size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Controla tu flujo de caja</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Registra ventas y gastos en segundos y mantén siempre la claridad de tus finanzas. Sabrás exactamente cuánto dinero entra y sale cada día sin errores.
              </p>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <Layers size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Gestiona tu inventario</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Conoce qué productos rotan más, evita pérdidas y recibe alertas de bajo stock. Agrega variantes de colores, tallas y códigos en tiempo real.
              </p>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <Smartphone size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Accede desde cualquier dispositivo</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Administra tu negocio desde el celular, tablet o computador, estés donde estés. Sincronización instantánea entre cajeros y vendedores.
              </p>
            </div>

            {/* Tarjeta 4 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Toma decisiones con datos reales</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Revisa estadísticas claras y reportes automáticos que muestran cómo hacer crecer tu rentabilidad y qué días vendes más.
              </p>
            </div>

            {/* Tarjeta 5 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Maneja clientes, proveedores y deudas</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Organiza contactos, lleva control de cuentas corrientes o pagos pendientes de clientes y fortalece relaciones clave en un solo lugar.
              </p>
            </div>

            {/* Tarjeta 6 */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Tu Tienda Web & WhatsApp (0% Comisión)</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Publica tu catálogo en línea bajo dominio oficial. Tus clientes compran directo y el detalle llega ordenado a tu WhatsApp sin pagar intermediarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* NO IMPORTA EL TIPO DE NEGOCIO QUE TENGAS                  */}
      {/* ========================================================= */}
      <section id="categorias" className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              No importa el tipo de negocio que tengas
            </h2>
            <p className="text-lg text-slate-600 font-extrabold mt-3">
              En Fluxa somos tus aliados tecnológicos
            </p>

            {/* Botones Selector Rubros */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setActiveCategory('gastro')}
                className={`px-5 py-3 rounded-2xl font-extrabold text-sm transition-all flex items-center gap-2 ${
                  activeCategory === 'gastro'
                    ? 'bg-slate-900 text-white shadow-lg scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Utensils size={18} className="text-amber-400" /> Negocios gastronómicos
              </button>

              <button
                onClick={() => setActiveCategory('retail')}
                className={`px-5 py-3 rounded-2xl font-extrabold text-sm transition-all flex items-center gap-2 ${
                  activeCategory === 'retail'
                    ? 'bg-slate-900 text-white shadow-lg scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ShoppingBag size={18} className="text-cyan-400" /> Comercios y Tiendas
              </button>

              <button
                onClick={() => setActiveCategory('services')}
                className={`px-5 py-3 rounded-2xl font-extrabold text-sm transition-all flex items-center gap-2 ${
                  activeCategory === 'services'
                    ? 'bg-slate-900 text-white shadow-lg scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Scissors size={18} className="text-pink-400" /> Servicios y Citas
              </button>

              <button
                onClick={() => setActiveCategory('markets')}
                className={`px-5 py-3 rounded-2xl font-extrabold text-sm transition-all flex items-center gap-2 ${
                  activeCategory === 'markets'
                    ? 'bg-slate-900 text-white shadow-lg scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building2 size={18} className="text-emerald-400" /> Mercados y Almacenes
              </button>
            </div>
          </div>

          {/* Panel del Rubro Activo */}
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full">
                  {activeCategory === 'gastro' && 'Gastronomía y Delivery'}
                  {activeCategory === 'retail' && 'Comercios & Retail'}
                  {activeCategory === 'services' && 'Turnos & Servicios'}
                  {activeCategory === 'markets' && 'Minimercados & Almacenes'}
                </span>

                <h3 className="text-3xl sm:text-4xl font-black text-white">
                  {activeCategory === 'gastro' && 'Optimiza mesas, insumos y pedidos sin pagar comisiones'}
                  {activeCategory === 'retail' && 'Control de stock, tallas, colores y ventas en tiempo real'}
                  {activeCategory === 'services' && 'Agenda turnos, administra clientes y controla tu caja'}
                  {activeCategory === 'markets' && 'Gestiona miles de productos con lector y ventas rápidas'}
                </h3>

                <p className="text-slate-300 text-base leading-relaxed">
                  {activeCategory === 'gastro' && 'Ideal para restaurantes, cafés, bares, panaderías y comida rápida. Tus clientes piden por WhatsApp y gestionas tu inventario al centavo.'}
                  {activeCategory === 'retail' && 'Ideal para tiendas de ropa, calzado, hogar y accesorios. Crea tu catálogo en minutos y comparte tu enlace por Instagram y WhatsApp.'}
                  {activeCategory === 'services' && 'Ideal para peluquerías, estética, consultorios y talleres. Tus clientes eligen servicio, día y hora exacta.'}
                  {activeCategory === 'markets' && 'Ideal para minimercados, fruterías y charcuterías. Controla tus deudas por cliente y genera reportes de cierres diarios.'}
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link 
                    href="/register" 
                    className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all inline-flex items-center gap-2"
                  >
                    Crear mi tienda en este rubro <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
                <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider mb-4">
                  Rubros más elegidos:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {activeCategory === 'gastro' && ['Restaurantes', 'Cafés', 'Bares', 'Pizzerías', 'Comida Rápida', 'Panaderías'].map(r => (
                    <div key={r} className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-bold text-slate-200">
                      • {r}
                    </div>
                  ))}

                  {activeCategory === 'retail' && ['Tiendas de Ropa', 'Zapatos', 'Accesorios', 'Electrónica', 'Hogar y Deco', 'Regalos'].map(r => (
                    <div key={r} className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-bold text-slate-200">
                      • {r}
                    </div>
                  ))}

                  {activeCategory === 'services' && ['Estética & Nails', 'Barberías', 'Salud', 'Limpieza', 'Talleres 24hs', 'Profesionales'].map(r => (
                    <div key={r} className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-bold text-slate-200">
                      • {r}
                    </div>
                  ))}

                  {activeCategory === 'markets' && ['Minimercados', 'Almacenes', 'Frutas & Verduras', 'Charcutería', 'Mayoristas', 'Dietéticas'].map(r => (
                    <div key={r} className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-bold text-slate-200">
                      • {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PLANES Y PRECIOS ($2 USD MÁS BARATO QUE TREINTA)          */}
      {/* ========================================================= */}
      <section id="precios" className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-100/80 px-3.5 py-1.5 rounded-full">
              Precios Transparentes • $2 USD Más Barato
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-3">
              Planes y precios para tu negocio
            </h2>
            <p className="text-base text-slate-600 font-medium">
              Todas las funcionalidades del sistema líder con las opciones más convenientes de la región.
            </p>

            {/* Selector de Período estilo Treinta (Mensual | Trimestral | Anual) */}
            <div className="inline-flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm mt-8">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mensual
              </button>

              <button
                onClick={() => setBillingPeriod('quarterly')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
                  billingPeriod === 'quarterly'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trimestral <span className="text-emerald-500 font-black text-[10px]">-10%</span>
              </button>

              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
                  billingPeriod === 'annual'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Anual <span className="bg-black text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-black">-25% (Ahorro Máximo)</span>
              </button>
            </div>
          </div>

          {/* Grilla de Planes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* PLAN 1: ESENCIAL ($7.99 USD/mes -> $2 USD MÁS BARATO QUE TREINTA ESENCIAL $9.99) */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border-2 border-slate-200 hover:border-slate-300 shadow-md flex flex-col justify-between transition-all">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-mono font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">
                      Plan Esencial (App & Tienda Web)
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      Fluxa Esencial
                    </h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-200">
                    $2 USD MÁS BARATO
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900">
                      ${billingPeriod === 'monthly' ? '7.99' : billingPeriod === 'quarterly' ? '7.19' : '5.99'}
                    </span>
                    <span className="text-sm font-extrabold text-slate-500">
                      USD / mes {billingPeriod === 'annual' && '(facturado anual)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-2">
                    {billingPeriod === 'monthly' && 'Pago mensual sin contrato. Cancela cuando quieras (Treinta cobra $9.99 USD/mes).'}
                    {billingPeriod === 'quarterly' && '10% de descuento incluido por pago trimestral.'}
                    {billingPeriod === 'annual' && '¡Ahorras un 25% y pagas solo $71.88 USD por todo el año!'}
                  </p>
                </div>

                <ul className="space-y-3.5 text-sm font-bold text-slate-700 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Registro de ventas ilimitadas
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Registro de gastos y control de caja diario
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Gestión de inventario y alertas de stock
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Módulo de estadísticas y reportes financieros
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Gestión de clientes, deudas y proveedores
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> <strong className="text-emerald-700">Tienda Online propia con 0% comisión</strong>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Enlace de pedidos directo por WhatsApp
                  </li>
                </ul>
              </div>

              <Link 
                href="/register?plan=esencial"
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-center block shadow-lg transition-all"
              >
                Comenzar con Esencial →
              </Link>
            </div>

            {/* PLAN 2: PRO INTEGRAL ($17.99 USD/mes o Llave en Mano) */}
            <div className="bg-gradient-to-b from-amber-50/70 to-white p-8 md:p-10 rounded-3xl border-2 border-amber-400 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-2xl tracking-wider shadow">
                ⭐ Más Elegido • POS + Web Completo
              </div>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-mono font-extrabold text-amber-600 uppercase tracking-wider block mb-1">
                      Plan PRO Integral
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      Fluxa PRO • Llave en Mano
                    </h3>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-amber-200/70">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900">
                      ${billingPeriod === 'monthly' ? '17.99' : billingPeriod === 'quarterly' ? '15.99' : '13.99'}
                    </span>
                    <span className="text-sm font-extrabold text-slate-500">
                      USD / mes {billingPeriod === 'annual' && '(facturado anual)'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 font-bold mt-2">
                    ¡Incluye creación y armado por nuestro equipo técnico en 48 horas!
                  </p>
                </div>

                <ul className="space-y-3.5 text-sm font-bold text-slate-800 mb-8">
                  <li className="flex items-center gap-3 bg-amber-100/70 p-2.5 rounded-xl border border-amber-300/60">
                    <Clock size={18} className="text-amber-600 shrink-0" /> ¡Armamos y diseñamos tu tienda en 48hs!
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Todo lo incluido en el Plan Esencial
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> <strong>Uso en Computador, Tablet y Celular</strong>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Carga inicial de tus productos e imágenes
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Pasarelas de Pago (Mercado Pago, Stripe, Banco)
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Asistencia y soporte prioritario VIP por WhatsApp
                  </li>
                </ul>
              </div>

              <Link 
                href="/register?plan=pro"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 font-black text-center block shadow-lg hover:brightness-105 transition-all"
              >
                Elegir Plan PRO →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER OFICIAL FLUXA TIENDAS                              */}
      {/* ========================================================= */}
      <footer className="bg-slate-950 text-white py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base">
                  FX
                </div>
                <span className="font-black text-xl tracking-tight">Fluxa Tiendas</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sistema de gestión comercial, contabilidad, control de inventario y punto de venta líder.
              </p>
            </div>

            <div>
              <h5 className="font-black text-xs uppercase tracking-wider text-amber-400 mb-3">Categorías</h5>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li><Link href="/#categorias" className="hover:text-white">Negocios Gastronómicos</Link></li>
                <li><Link href="/#categorias" className="hover:text-white">Comercios y Tiendas</Link></li>
                <li><Link href="/#categorias" className="hover:text-white">Servicios y Turnos</Link></li>
                <li><Link href="/#categorias" className="hover:text-white">Mercados y Almacenes</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-xs uppercase tracking-wider text-amber-400 mb-3">Funcionalidades</h5>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li><Link href="/#funcionalidades" className="hover:text-white">Control de inventarios</Link></li>
                <li><Link href="/#funcionalidades" className="hover:text-white">Registro de ventas y gastos</Link></li>
                <li><Link href="/#funcionalidades" className="hover:text-white">Reportes y estadísticas</Link></li>
                <li><Link href="/#funcionalidades" className="hover:text-white">Gestión de clientes y deudas</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-xs uppercase tracking-wider text-amber-400 mb-3">Contacto & Soporte</h5>
              <p className="text-xs text-slate-300 font-medium mb-3">
                ¿Tienes dudas sobre los planes o necesitas ayuda con tu tienda?
              </p>
              <a 
                href="https://api.whatsapp.com/send?phone=59894968558&text=Hola%20Fluxa!" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all"
              >
                <MessageCircle size={15} /> Chat por WhatsApp
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-semibold">
            <p>© {new Date().getFullYear()} Fluxa Tiendas • Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="/register" className="hover:text-white">Registrar Negocio</Link>
              <Link href="/login" className="hover:text-white">Acceso a Mi Tienda</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
