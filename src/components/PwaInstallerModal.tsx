"use client";

import React, { useEffect, useState } from 'react';
import { Smartphone, Download, Share2, PlusSquare, CheckCircle2, X, Sparkles, ArrowRight, Apple } from 'lucide-react';

export default function PwaInstallerModal({ storeName }: { storeName?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detectar si ya está instalada como PWA
    if (typeof window !== 'undefined') {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      setIsStandalone(standalone);

      // Detectar dispositivo iOS
      const ua = window.navigator.userAgent;
      const iOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      setIsIOS(iOS);
      if (iOS) setActiveTab('ios');
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsStandalone(true);
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      // Si no está disponible el prompt nativo (ej iOS o PC), abrir modal de instrucciones
      setIsOpen(true);
    }
  };

  if (isStandalone) {
    return (
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-2xl p-4 mb-6 flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center text-black font-extrabold shrink-0 shadow">
            ⚡
          </div>
          <div>
            <h4 className="font-bold text-sm text-green-300">Modo App Nativa Activado</h4>
            <p className="text-xs text-gray-300">Estás administrando tu tienda desde tu App Oficial instalada en este dispositivo.</p>
          </div>
        </div>
        <span className="bg-green-500/30 text-green-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
          En Vivo
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Banner promocional para descargar PWA */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-100 border border-emerald-200 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-900 shadow-xl relative overflow-hidden animate-in fade-in">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-4 text-center sm:text-left relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-2xl shrink-0 shadow-lg shadow-emerald-500/30">
            <Smartphone size={28} className="text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles size={12} /> App Móvil Oficial • Android & Apple iOS
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Instala tu App de Administración en tu Celular</h3>
            <p className="text-xs text-slate-600 mt-0.5 max-w-lg font-medium">
              Gestiona tu inventario, revisa turnos y recibe notificaciones de WhatsApp directo desde tu pantalla de inicio sin ocupar memoria.
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2 shrink-0 relative z-10"
        >
          <Download size={18} /> Instalar App Admin ↗
        </button>
      </div>

      {/* MODAL DE INSTRUCCIONES DE DESCARGA */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <div className="relative z-10 max-w-lg w-full glass-panel p-6 sm:p-8 border-2 border-[var(--accent-cyan)] shadow-2xl animate-in zoom-in-95 duration-200 text-white">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[var(--accent-cyan)] to-blue-500 flex items-center justify-center text-black font-bold shadow-lg">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Instalar {storeName || 'Fluxa Admin'}</h3>
                  <p className="text-xs text-cyan-400 font-semibold">App Progresiva (PWA) 100% Descarable</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--text-secondary)] hover:text-white p-1">
                <X size={24} />
              </button>
            </div>

            {/* Selector de Sistema Operativo */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/50 rounded-xl border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'android' ? 'bg-[var(--accent-cyan)] text-black shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                🤖 Android / Chrome
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`py-2.5 rounded-lg text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'ios' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                🍏 Apple iOS (iPhone/iPad)
              </button>
            </div>

            {/* CONTENIDO ANDROID */}
            {activeTab === 'android' && (
              <div className="space-y-4 text-sm text-[var(--text-secondary)]">
                {deferredPrompt ? (
                  <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5 text-center">
                    <p className="text-white font-bold mb-3">¡Instalación en 1 clic disponible para tu dispositivo!</p>
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="w-full py-3.5 bg-[var(--accent-cyan)] hover:brightness-110 text-black rounded-xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2"
                    >
                      <Download size={18} /> Instalar App Automáticamente Ahora
                    </button>
                  </div>
                ) : (
                  <div className="bg-black/40 rounded-xl p-5 border border-white/10 space-y-3">
                    <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center text-xs font-black">1</span>
                      Abre el menú de tu navegador
                    </h4>
                    <p className="text-xs">Toca los tres puntos (<strong className="text-white">⋮</strong>) en la esquina superior derecha de Google Chrome o Edge.</p>

                    <h4 className="font-bold text-white flex items-center gap-2 text-sm pt-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center text-xs font-black">2</span>
                      Selecciona "Instalar aplicación"
                    </h4>
                    <p className="text-xs">Toca la opción <strong className="text-white">"Instalar aplicación"</strong> o <strong className="text-white">"Agregar a la pantalla principal"</strong>. ¡Acepta y tendrás el icono en tu celular al instante!</p>
                  </div>
                )}
              </div>
            )}

            {/* CONTENIDO APPLE IOS */}
            {activeTab === 'ios' && (
              <div className="bg-black/40 rounded-xl p-5 border border-white/10 space-y-4 text-sm text-[var(--text-secondary)]">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Toca el botón Compartir en Safari</h4>
                    <p className="text-xs mt-0.5">En la barra inferior o superior de Safari en tu iPhone/iPad, toca el icono de compartir (<strong className="text-blue-400 font-bold inline-flex items-center gap-1"><Share2 size={12} /> Compartir</strong>).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-white/10">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Elige "Agregar al inicio" (+)</h4>
                    <p className="text-xs mt-0.5">Desliza las opciones hacia abajo y selecciona <strong className="text-white bg-white/10 px-2 py-0.5 rounded border border-white/20 inline-flex items-center gap-1"><PlusSquare size={12} className="text-cyan-400" /> Agregar al inicio</strong> (o <em>Add to Home Screen</em>).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-white/10">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">¡Abre tu App Nativas de Fluxa!</h4>
                    <p className="text-xs mt-0.5">Toca <strong className="text-white">"Agregar"</strong> arriba a la derecha. Ahora tendrás el icono oficial en la pantalla principal de tu iPhone o iPad.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="btn-secondary text-xs !py-2 !px-6"
              >
                Entendido, cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
