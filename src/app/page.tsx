"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  ArrowRight, CheckCircle2, Smartphone, Zap, ShoppingBag, 
  ShieldCheck, DollarSign, Sparkles, Utensils, Scissors, Building2, 
  HelpCircle, Star, Clock, Gift 
} from 'lucide-react';

export default function Home() {
  const [isAnnual, setIsAnnual] = useState(false);

  const categories = [
    {
      id: 'gastro',
      title: 'Negocios Gastronómicos',
      icon: <Utensils className="text-amber-400" size={24} />,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
      items: ['Restaurantes y Cafés', 'Pizzerías y Hamburgueserías', 'Pastelerías y Panaderías', 'Comida rápida y Delivery', 'Cervecerías y Bares'],
      whyTitle: '¿Por qué elegir Fluxa en Gastronomía?',
      whyDesc: 'Olvídate de regalar el 30% de tus ventas a aplicaciones externas de delivery. Con Fluxa tienes tu propio Menú Digital en alta definición donde tu cliente pide desde el celular y el detalle llega ordenado directo a la cocina por WhatsApp con 0% de comisión.',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'retail',
      title: 'Comercios y Tiendas Retail',
      icon: <ShoppingBag className="text-cyan-400" size={24} />,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
      items: ['Tiendas de ropa y calzado', 'Electrónica y Accesorios', 'Minimercados y Almacenes', 'Regalerías y Decoración', 'Dietéticas y Orgánicos'],
      whyTitle: '¿Por qué elegir Fluxa para tu Comercio?',
      whyDesc: 'Las plataformas tradicionales te cobran entre el 4% y el 8% de comisión bancaria por venta y retienen tu dinero por días. En Fluxa tu catálogo es rápido, elegante y todo el dinero que cobras va 100% a tu bolsillo de inmediato sin intermediarios.',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'services',
      title: 'Servicios y Citas / Turnos',
      icon: <Scissors className="text-pink-400" size={24} />,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
      items: ['Peluquerías y Barberías', 'Centros de Estética y Nails', 'Consultorios y Salud', 'Talleres y Mecánica 24hs', 'Servicios Profesionales'],
      whyTitle: '¿Por qué elegir Fluxa en Servicios?',
      whyDesc: 'Tus clientes no solo compran productos; nuestra plantilla especializada les permite seleccionar el servicio y agendar el día y la hora exacta para su turno por WhatsApp. Olvídate de interminables audios para coordinar un horario.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'booking',
      title: 'Alquileres y Espacios',
      icon: <Building2 className="text-emerald-400" size={24} />,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
      items: ['Cabañas y Alojamiento turistico', 'Hoteles y Posadas', 'Salones de Eventos', 'Canchas de Fútbol y Pádel', 'Alquiler de Vehículos'],
      whyTitle: '¿Por qué elegir Fluxa para Reservas?',
      whyDesc: 'Un formato visual estilo Airbnb donde tus huéspedes pueden ver fotos, servicios incluidos y consultar disponibilidad de fechas de Check-in y Check-out en segundos. Trato directo y sin pagar costosas comisiones de hospedaje.',
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-8 animate-pulse">
            <Zap size={16} /> La nueva era de las plataformas web en Latinoamérica
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900">
            Tu propia plataforma web. <br />
            <span className="text-gradient">De cero a vendiendo por WhatsApp.</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl text-slate-600 mb-12 leading-relaxed font-medium">
            Sin comisiones abusivas por venta ni conocimientos técnicos. Elige tu plantilla ideal según tu rubro, personaliza tu marca y empieza a vender hoy mismo bajo nuestro dominio oficial.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto shadow-xl shadow-emerald-500/20 font-bold">
              Crear mi Web Ahora <ArrowRight size={20} />
            </Link>
            <Link href="#precios" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto font-bold">
              Ver Planes y Precios
            </Link>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-slate-50/80 border-b border-slate-200 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-bold">
              Proceso Sencillo
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-4">
              ¿Cómo funciona Fluxa Tiendas?
            </h2>
            <p className="text-lg text-slate-600 mt-4 font-medium">
              Tu negocio vendiendo por WhatsApp en tres pasos simples sin depender de intermediarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white relative overflow-hidden group hover:border-emerald-400 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xl mb-6">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Elige tu Plantilla</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Selecciona el rubro de tu negocio (gastronomía, retail, turnos o reservas) y crea tu cuenta en segundos sin tarjeta de crédito.
              </p>
            </div>
            <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white relative overflow-hidden group hover:border-emerald-400 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xl mb-6">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Carga tu Catálogo</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Agrega tus productos con fotos y precios o configura tus horarios de atención desde tu celular o computadora con autogestión intuitiva.
              </p>
            </div>
            <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white relative overflow-hidden group hover:border-emerald-400 transition-all shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-xl mb-6">3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Vende por WhatsApp</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Comparte tu enlace oficial <code className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">tiendas.fluxauy.com/tunegocio</code> y recibe pedidos ordenados al instante directo a tu WhatsApp con 0% comisión.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN INTERACTIVA DE RUBROS CON HOVER FLIP CARDS */}
      <section id="beneficios" className="py-24 relative bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-bold">
              Versatilidad Total
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-4 mb-4">
              No importa el tipo de negocio que tengas
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              En <strong className="text-slate-900 font-bold">Fluxa Tiendas</strong> somos tus aliados tecnológicos. Pasa el mouse sobre cada rubro para descubrir por qué somos la mejor opción para tu comercio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="group relative h-[450px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 transition-all duration-500 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col shadow-sm"
              >
                {/* CAPA FRONTAL (Por defecto visible) */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 z-10 transition-all duration-500 group-hover:opacity-0 group-hover:scale-95 pointer-events-auto group-hover:pointer-events-none">
                  <div>
                    <div className="h-44 w-full -mx-6 -mt-6 mb-6 relative overflow-hidden">
                      <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                        {cat.icon}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{cat.title}</h3>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-600 font-semibold">
                      {cat.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-emerald-600">
                    <span className="flex items-center gap-1.5"><Sparkles size={14} /> ¿Por qué Fluxa?</span>
                    <span className="text-[10px] bg-emerald-100 px-2.5 py-1 rounded-full text-emerald-800 font-bold">Ver info ↗</span>
                  </div>
                </div>

                {/* CAPA TRASERA / OVERLAY HOVER FLIP (Se revela al poner el mouse) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} p-7 flex flex-col justify-between z-20 opacity-0 transform translate-y-6 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto text-white shadow-inner`}>
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider text-white border border-white/20">
                        Ventaja Exclusiva
                      </span>
                      <HelpCircle size={22} className="text-white/80" />
                    </div>

                    <h3 className="text-xl font-black mb-3 leading-tight drop-shadow-sm">
                      {cat.whyTitle}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/95 font-medium drop-shadow-sm">
                      {cat.whyDesc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/20">
                    <Link 
                      href="/register" 
                      className="w-full py-3 bg-black/80 hover:bg-black text-white rounded-xl text-center font-bold text-xs uppercase tracking-wider transition-all block shadow-lg flex items-center justify-center gap-2"
                    >
                      Empezar con esta plantilla <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANES Y PRECIOS */}
      <section id="precios" className="py-24 relative bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full font-bold">
              Inversión Transparente
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-4 mb-4">
              Planes diseñados para impulsar tu negocio
            </h2>
            <p className="text-lg text-slate-600 mb-8 font-medium">
              Sin comisiones por venta, sin sorpresas ocultas. Elige autogestionar tu web o déjalo todo en nuestras manos.
            </p>

            {/* Toggle Mensual / Anual con Regalo */}
            <div className="inline-flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <button 
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!isAnnual ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Pago Mensual
              </button>
              <button 
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isAnnual ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Pago Anual <span className="bg-black text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1"><Gift size={12} /> 2 MESES GRATIS</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* PLAN 1: BÁSICO - AUTOGESTIÓN */}
            <div className="glass-panel p-8 md:p-10 flex flex-col justify-between border-2 border-slate-200 bg-white hover:border-emerald-500 transition-all relative overflow-hidden shadow-sm">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-wider block mb-1">Plan 1</span>
                    <h3 className="text-2xl font-black text-slate-900">Básico • Autogestión</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Zap size={24} />
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900">${isAnnual ? '100' : '10'}</span>
                    <span className="text-sm font-bold text-slate-500">USD / {isAnnual ? 'año entero' : 'mes'}</span>
                  </div>
                  {isAnnual ? (
                    <p className="text-xs text-amber-600 font-bold mt-2 flex items-center gap-1">
                      <Gift size={14} /> ¡Pagando el año te regalamos 2 meses gratis! (Equivale a $8.33/mes)
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-2 font-medium">Facturación mensual simple. Cancela cuando quieras.</p>
                  )}
                </div>

                <ul className="space-y-4 text-sm text-slate-600 font-medium mb-8">
                  <li className="flex items-center gap-3 text-slate-800 font-semibold">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Acceso a las 6 plantillas de negocio
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 font-semibold">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Catálogo ilimitado de productos o servicios
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 font-semibold">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Carrito y reservas directo a tu WhatsApp
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 font-semibold">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> <strong className="text-emerald-700 font-extrabold">0% comisiones por venta</strong> (el 100% es tuyo)
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 font-semibold">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Dominio oficial <code className="text-xs font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">tunegocio.fluxa.com</code>
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 font-semibold">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> Autogestión fácil 100% desde tu celular
                  </li>
                </ul>
              </div>

              <Link 
                href="/register?plan=basic" 
                className="btn-secondary w-full justify-center py-4 text-base font-bold text-slate-800 border-slate-300 hover:bg-slate-100 shadow-sm"
              >
                Seleccionar Plan Básico <ArrowRight size={18} />
              </Link>
            </div>

            {/* PLAN 2: PRO - LLAVE EN MANO */}
            <div className="glass-panel p-8 md:p-10 flex flex-col justify-between border-2 border-amber-400 bg-gradient-to-b from-amber-50/50 to-white hover:border-amber-500 transition-all relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-black text-[10px] font-black uppercase px-4 py-1.5 rounded-bl-xl tracking-wider shadow-md">
                ⭐ Recomendado • Llave en Mano
              </div>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-mono text-amber-600 font-bold uppercase tracking-wider block mb-1">Plan 2</span>
                    <h3 className="text-2xl font-black text-slate-900">PRO • Llave en Mano</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <Star size={24} />
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-amber-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900">${isAnnual ? '200' : '100'}</span>
                    <span className="text-sm font-bold text-slate-500">USD {isAnnual ? 'primer año completo' : 'pago inicial'}</span>
                  </div>
                  {isAnnual ? (
                    <p className="text-xs text-amber-600 font-bold mt-2 flex items-center gap-1">
                      <Gift size={14} /> Incluye creación ($100) + 1 año de suscripción con 2 cuotas gratis ($100).
                    </p>
                  ) : (
                    <p className="text-xs text-amber-700 mt-2 font-semibold">
                      Pago inicial $100 por creación de tienda + luego $10 USD/mes de mantenimiento.
                    </p>
                  )}
                </div>

                <ul className="space-y-4 text-sm text-slate-600 mb-8">
                  <li className="flex items-center gap-3 text-amber-950 font-bold bg-amber-100/70 p-2.5 rounded-xl border border-amber-200 shadow-sm">
                    <Clock size={20} className="text-amber-600 shrink-0" /> ¡Nosotros te creamos y diseñamos tu web lista para vender en 48 horas!
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 font-semibold">
                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> <strong className="text-amber-700 font-extrabold">Carga de tus primeros 20 productos</strong> con fotos y precios
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 font-semibold">
                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Configuración de tu logo, colores y banner de promoción
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 font-semibold">
                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Asesoría comercial y soporte técnico VIP directo de Fluxa UY
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 font-semibold">
                    <CheckCircle2 size={18} className="text-amber-500 shrink-0" /> Todo lo incluido en el Plan Básico (0% comisiones, catálogo infinito)
                  </li>
                </ul>
              </div>

              <Link 
                href="/register?plan=pro" 
                className="w-full py-4 rounded-xl font-black text-base text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:brightness-110 transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                Quiero que me creen mi web en 48hs <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 text-center text-sm text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Fluxa Tiendas. Tecnología e ingeniería de software en Uruguay.</p>
          <div className="flex gap-6 text-xs font-semibold text-slate-600">
            <Link href="#precios" className="hover:text-slate-900">Planes</Link>
            <Link href="/register" className="hover:text-slate-900">Registrar Negocio</Link>
            <Link href="/login" className="hover:text-slate-900">Iniciar Sesión</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
