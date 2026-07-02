export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string; // emoji icon
  themeColor: string;
  fontFamily: 'font-sans' | 'font-serif' | 'font-mono';
  badgeText: string;
  heroSubtitle: string;
  itemLabel: string; // "Producto", "Servicio", etc.
  priceLabel: string; // "Precio", "Por sesión", etc.
  actionButtonText: string; // "Agregar al Carrito", "Agendar Turno", etc.
  drawerTitle: string; // "Tu Pedido", "Reserva de Turno", etc.
  askForDate?: boolean;
  askForTime?: boolean;
  dateLabel?: string;
  timeLabel?: string;
  managementTabTitle: string;
  movementName: string;
  statusLabels: Record<'pending' | 'in_progress' | 'completed' | 'delivered', string>;
}

export const STORE_TEMPLATES: Record<string, TemplateConfig> = {
  ecommerce: {
    id: 'ecommerce',
    name: 'Comercio Online (Estilo WooCommerce)',
    category: 'Tiendas de Ropa, Tecnología, Minimercados y Retal',
    description: 'Carrito de compras clásico con cálculo de total y envío de pedido estructurado por WhatsApp.',
    icon: '🛍️',
    themeColor: '#00D7C0',
    fontFamily: 'font-sans',
    badgeText: 'Tienda Oficial en Línea',
    heroSubtitle: 'Catálogo de productos con compra en 1 clic y entrega inmediata.',
    itemLabel: 'Producto en Venta',
    priceLabel: 'Precio final',
    actionButtonText: 'Agregar al Carrito',
    drawerTitle: 'Tu Carrito de Compras',
    askForDate: false,
    askForTime: false,
    managementTabTitle: '📦 Pedidos y Envíos',
    movementName: 'Pedido',
    statusLabels: {
      pending: 'Recibido 🟡',
      in_progress: 'En Preparación 🔄',
      completed: 'Enviado 📦',
      delivered: 'Entregado ✅'
    }
  },
  gastronomy: {
    id: 'gastronomy',
    name: 'Menú Gourmet & Delivery',
    category: 'Restaurantes, Cafeterías, Pizzerías y Pastelerías',
    description: 'Diseño elegante estilo menú digital para recibir pedidos de comida con notas de cocina por WhatsApp.',
    icon: '🍽️',
    themeColor: '#F59E0B',
    fontFamily: 'font-serif',
    badgeText: 'Menú Digital • Pedidos en Vivo',
    heroSubtitle: 'Cocina de autor y especialidades preparadas al momento.',
    itemLabel: 'Plato / Especialidad',
    priceLabel: 'Por porción',
    actionButtonText: 'Pedir Plato',
    drawerTitle: 'Tu Pedido Gastronómico',
    askForDate: false,
    askForTime: false,
    managementTabTitle: '🛵 Pedidos de Cocina y Delivery',
    movementName: 'Pedido de Cocina',
    statusLabels: {
      pending: 'En Cocina 🔥',
      in_progress: 'Listo para Reparto 🛵',
      completed: 'En Camino 🚗',
      delivered: 'Entregado / Servido ✅'
    }
  },
  appointments: {
    id: 'appointments',
    name: 'Agenda de Citas y Turnos',
    category: 'Peluquerías, Estética, Barberías, Clínicas y Salud',
    description: 'Organización centrada en servicios. El cliente selecciona su servicio, elige fecha y hora, y agenda por WhatsApp.',
    icon: '📅',
    themeColor: '#EC4899',
    fontFamily: 'font-sans',
    badgeText: 'Agenda Abierta • Reserva Tu Espacio',
    heroSubtitle: 'Servicios profesionales y atención personalizada por turno agendado.',
    itemLabel: 'Servicio / Tratamiento',
    priceLabel: 'Valor del servicio',
    actionButtonText: 'Seleccionar para Turno',
    drawerTitle: 'Solicitar Turno y Horario',
    askForDate: true,
    askForTime: true,
    dateLabel: '📅 Fecha deseada para el turno',
    timeLabel: '⏰ Horario preferido (ej: Mañana 10:30 hs)',
    managementTabTitle: '📅 Agenda de Turnos y Citas',
    movementName: 'Turno / Cita',
    statusLabels: {
      pending: 'Turno Solicitado 🟡',
      in_progress: 'Turno Confirmado 🟢',
      completed: 'En Sesión 💆‍♂️',
      delivered: 'Atendido / Terminado ✅'
    }
  },
  booking: {
    id: 'booking',
    name: 'Reservas de Alquiler y Espacios',
    category: 'Turismo, Cabañas, Hoteles, Salones y Canchas de Fútbol/Pádel',
    description: 'Formato visual estilo Airbnb. Ideal para consultar disponibilidad de fechas y reservar por días u horas.',
    icon: '🛎️',
    themeColor: '#10B981',
    fontFamily: 'font-sans',
    badgeText: 'Alquiler y Reserva de Espacios',
    heroSubtitle: 'Disfruta de nuestras instalaciones con reserva directa y sin intermediarios.',
    itemLabel: 'Espacio / Alojamiento',
    priceLabel: 'Tarifa base (noche/turno)',
    actionButtonText: 'Consultar Disponibilidad',
    drawerTitle: 'Solicitud de Reserva',
    askForDate: true,
    askForTime: false,
    dateLabel: '🗓️ Fechas de Reserva (Desde - Hasta / Día)',
    managementTabTitle: '🛎️ Gestión de Reservas y Check-in',
    movementName: 'Reserva',
    statusLabels: {
      pending: 'Consulta de Fechas 🟡',
      in_progress: 'Reserva Bloqueada 🔒',
      completed: 'Check-in Realizado 🔑',
      delivered: 'Check-out Finalizado ✅'
    }
  },
  services: {
    id: 'services',
    name: 'Consultoría & Gestión de Clientes',
    category: 'Abogados, Contadores, Agencias de Marketing e Inmobiliarias',
    description: 'Portafolio profesional ejecutivo. Transmite confianza y permite solicitar presupuestos o asesorías.',
    icon: '💼',
    themeColor: '#5C5CFF',
    fontFamily: 'font-serif',
    badgeText: 'Servicios Profesionales de Asesoría',
    heroSubtitle: 'Estrategias, gestión integral y soluciones corporativas a medida.',
    itemLabel: 'Servicio / Asesoría',
    priceLabel: 'Honorarios / Inversión',
    actionButtonText: 'Solicitar Cotización',
    drawerTitle: 'Solicitud de Presupuesto',
    askForDate: false,
    askForTime: false,
    managementTabTitle: '💼 Solicitudes y Cotizaciones',
    movementName: 'Cotización / Proyecto',
    statusLabels: {
      pending: 'Solicitud Recibida 📬',
      in_progress: 'Cotización Enviada 📄',
      completed: 'Proyecto En Proceso ⚙️',
      delivered: 'Servicio Finalizado ✅'
    }
  },
  repairs: {
    id: 'repairs',
    name: 'Oficios, Soporte Técnico & Urgencias',
    category: 'Plomeros, Electricistas, Mecánicos, Cerrajeros 24hs y Climatización',
    description: 'Acceso directo y rápido para emergencias en el hogar o técnico automotriz. Botones de llamada a la acción directos.',
    icon: '🛠️',
    themeColor: '#EF4444',
    fontFamily: 'font-mono',
    badgeText: 'Soporte Técnico • Auxilio Rápido',
    heroSubtitle: 'Soluciones inmediatas garantizadas en tu domicilio o empresa.',
    itemLabel: 'Servicio de Reparación',
    priceLabel: 'Cotización base',
    actionButtonText: 'Solicitar Técnico',
    drawerTitle: 'Solicitud de Auxilio / Visita',
    askForDate: true,
    askForTime: true,
    dateLabel: '📅 ¿Cuándo necesitas la visita?',
    timeLabel: '⏰ Franja horaria preferida',
    managementTabTitle: '🛠️ Órdenes de Servicio Técnico',
    movementName: 'Orden de Reparación',
    statusLabels: {
      pending: 'Auxilio Solicitado 🚨',
      in_progress: 'Técnico en Camino 🛠️',
      completed: 'En Reparación 🔧',
      delivered: 'Servicio Terminado ✅'
    }
  }
};

export const DEFAULT_TEMPLATE = 'ecommerce';

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;    // Botones principales, acentos fuertes, precios
  secondary: string;  // Badges, iconos secundarios, bordes sutiles
  accent: string;     // Acento brillante o contraste (resaltado de banners, textos especiales)
  surface: string;    // Color de superficie/fondo de tarjetas o tinte de sección
  textTint?: string;  // Tinte de texto principal para contraste
}

export const STORE_PALETTES: ColorPalette[] = [
  {
    id: 'fluxa_cyan',
    name: 'Cian Fluxa Tech',
    primary: '#00D7C0',
    secondary: '#0284C7',
    accent: '#38BDF8',
    surface: '#0F172A',
    textTint: '#F8FAFC'
  },
  {
    id: 'imperial_gold',
    name: 'Dorado Imperial & Carbón',
    primary: '#F59E0B',
    secondary: '#D97706',
    accent: '#FDE047',
    surface: '#1C1917',
    textTint: '#FFFBEB'
  },
  {
    id: 'silk_pink',
    name: 'Rosa Vibrante & Seda',
    primary: '#EC4899',
    secondary: '#E11D48',
    accent: '#FBCFE8',
    surface: '#271824',
    textTint: '#FDF2F8'
  },
  {
    id: 'botanic_emerald',
    name: 'Esmeralda Botánico',
    primary: '#10B981',
    secondary: '#059669',
    accent: '#A7F3D0',
    surface: '#064E3B',
    textTint: '#ECFDF5'
  },
  {
    id: 'executive_blue',
    name: 'Azul Ejecutivo Deep',
    primary: '#5C5CFF',
    secondary: '#4F46E5',
    accent: '#C7D2FE',
    surface: '#111827',
    textTint: '#EEF2FF'
  },
  {
    id: 'sunset_orange',
    name: 'Ocaso Naranja & Arena',
    primary: '#F97316',
    secondary: '#EA580C',
    accent: '#FED7AA',
    surface: '#2A1810',
    textTint: '#FFF7ED'
  },
  {
    id: 'royal_amethyst',
    name: 'Amatista Royal & Lavanda',
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#DDD6FE',
    surface: '#1E1B4B',
    textTint: '#F5F3FF'
  },
  {
    id: 'industrial_red',
    name: 'Rojo Carmesí Industrial',
    primary: '#EF4444',
    secondary: '#B91C1C',
    accent: '#FECACA',
    surface: '#18181B',
    textTint: '#FEF2F2'
  },
  {
    id: 'olive_earth',
    name: 'Verde Menta & Oliva',
    primary: '#84CC16',
    secondary: '#65A30D',
    accent: '#D9F99D',
    surface: '#1A2E05',
    textTint: '#F7FEE7'
  },
  {
    id: 'nordic_slate',
    name: 'Nordic Slate & Hielo',
    primary: '#06B6D4',
    secondary: '#475569',
    accent: '#E2E8F0',
    surface: '#0F172A',
    textTint: '#F8FAFC'
  }
];

export function getStorePalette(themeColorOrId?: string): ColorPalette {
  if (!themeColorOrId) return STORE_PALETTES[0];
  const foundById = STORE_PALETTES.find(p => p.id === themeColorOrId);
  if (foundById) return foundById;
  const foundByHex = STORE_PALETTES.find(p => p.primary.toLowerCase() === themeColorOrId.toLowerCase());
  if (foundByHex) return foundByHex;
  
  return {
    id: 'custom',
    name: 'Color Personalizado',
    primary: themeColorOrId,
    secondary: themeColorOrId,
    accent: '#FFFFFF',
    surface: '#0F172A',
    textTint: '#FFFFFF'
  };
}

