/**
 * LA HACIENDA · GERENCIA DIGITAL
 * data.js — Datos de demostración
 * Complementa a Soft Restaurant — gestión de delivery, reservaciones y analítica avanzada
 */

const RestaurantData = {

  // ── INFO DEL NEGOCIO ─────────────────────────────────────
  restaurante: {
    nombre: "La Hacienda del Sabor",
    sucursal: "Celaya Centro",
    turno: "Comida",
    horaApertura: "13:00",
    fechaHoy: new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  },

  // ── KPIs DEL DÍA ────────────────────────────────────────
  kpis: {
    ventasHoy: 24850,
    ventasMeta: 30000,
    ticketPromedio: 385,
    ticketPromedioAnterior: 340,
    clientesAtendidos: 64,
    clientesAnteriores: 71,
    pedidosDelivery: 3,
    ventasDelivery: 2430,
    reservacionesHoy: 2,
    reservacionesPendientes: 2,
  },

  // ── VENTAS POR HORA (hoy vs ayer) ────────────────────────
  ventasPorHora: {
    labels: ['13h','14h','15h','16h','17h','18h','19h','20h','21h','22h'],
    hoy:   [2100, 5400, 6200, 4100, 2800, 3900, 6500, 7200, 5100, 2100],
    ayer:  [1800, 4900, 5800, 3700, 2400, 3500, 5900, 6800, 4700, 1900],
    meta:  [3000, 5500, 6500, 4500, 3000, 4000, 6000, 7000, 5000, 2500]
  },

  // ── VENTAS SEMANA (histórico) ─────────────────────────────
  ventasSemana: {
    labels: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
    semanaActual:  [18200, 21500, 19800, 22100, 28900, 35200, 29600],
    semanaAnterior:[16800, 20100, 18200, 20500, 26700, 33100, 27400]
  },

  // ── TOP PLATILLOS ─────────────────────────────────────────
  topPlatillos: [
    { nombre:'Arrachera Premium 300g', vendidos:28, pctBar:100 },
    { nombre:'Camarones al ajillo',    vendidos:22, pctBar:79  },
    { nombre:'Orden de tacos (3 pzas)',vendidos:19, pctBar:68  },
    { nombre:'Ensalada Hacienda',      vendidos:16, pctBar:57  },
    { nombre:'Caldo de res especial',  vendidos:13, pctBar:46  },
    { nombre:'Michelada artesanal',    vendidos:11, pctBar:39  },
  ],

  // ── VENTAS POR CATEGORÍA (donut) — colores nuevos ─────────
  categorias: [
    { nombre:'Cortes',    valor:8420, color:'#6366f1' },
    { nombre:'Mariscos',  valor:5100, color:'#0ea5e9' },
    { nombre:'Antojitos', valor:4200, color:'#a855f7' },
    { nombre:'Bebidas',   valor:3800, color:'#10b981' },
    { nombre:'Postres',   valor:1900, color:'#f59e0b' },
    { nombre:'Otros',     valor:1430, color:'#64748b' },
  ],

  // ── NOTIFICACIONES DEL SISTEMA ────────────────────────────
  notificaciones: [
    { tipo:'success', titulo:'Meta semanal alcanzada',       detalle:'Las ventas de esta semana superaron la meta por 8%', hora:'10:32' },
    { tipo:'warning', titulo:'Rappi: Pedido retrasado',       detalle:'Pedido RP-4471 lleva 35 min en preparación', hora:'09:47' },
    { tipo:'info',    titulo:'Reservación confirmada',        detalle:'Familia Treviño · 6 personas · 14:00 hrs', hora:'09:15' },
    { tipo:'success', titulo:'Uber Eats — Reseña 5⭐',       detalle:'"Excelente comida y entrega rápida"', hora:'08:50' },
    { tipo:'warning', titulo:'DiDi Food — Integración pendiente', detalle:'Autorización de credenciales requerida en el portal', hora:'08:30' },
  ],

  // ── MESEROS ──────────────────────────────────────────────
  meseros: [
    { nombre:'Ana Martínez',   iniciales:'AM', color:'#a855f7', mesas:3, ventasDia:8240, ticket:687 },
    { nombre:'Carlos Reyes',   iniciales:'CR', color:'#6366f1', mesas:3, ventasDia:7190, ticket:599 },
    { nombre:'Jorge Salinas',  iniciales:'JS', color:'#0ea5e9', mesas:2, ventasDia:5820, ticket:529 },
    { nombre:'Sofía Herrera',  iniciales:'SH', color:'#10b981', mesas:0, ventasDia:3600, ticket:450 },
  ],

  // ── HEATMAP DE OCUPACIÓN (horas x días) ──────────────────
  heatmap: {
    dias: ['L','M','X','J','V','S','D'],
    horas: ['12','13','14','15','16','17','18','19','20','21','22','23','0','1'],
    datos: [
      [0,1,3,4,2,1,2,3,4,3,2,1,0,0],
      [0,1,3,4,2,1,2,3,4,3,2,1,0,0],
      [0,1,2,3,2,1,2,3,4,3,2,1,0,0],
      [0,1,3,4,3,2,3,4,5,4,3,1,0,0],
      [0,2,4,5,3,2,3,5,5,5,4,2,1,0],
      [0,2,5,5,4,3,4,5,5,5,5,3,2,1],
      [0,2,5,5,4,3,4,5,5,4,3,2,1,0],
    ]
  },

  // ── SPARKLINE DATA (KPI cards) ────────────────────────────
  sparklines: {
    ventas:   [18200,21500,19800,22100,28900,24850],
    ticket:   [310,  325,  340,  335,  370,  385],
    clientes: [58,   71,   65,   80,   69,   64],
    delivery: [8,    12,   9,    15,   11,   3],
  },

  // ── DELIVERY ─────────────────────────────────────────────
  deliveryPedidos: [
    { id:'UE-8821', plataforma:'Uber Eats', cliente:'Ricardo M.', items:3, importe:540, estado:'en-camino',  tiempo:'12 min' },
    { id:'RP-4471', plataforma:'Rappi',     cliente:'Daniela S.', items:2, importe:320, estado:'preparando', tiempo:'5 min'  },
    { id:'DD-1190', plataforma:'DiDi Food', cliente:'Hugo T.',    items:5, importe:780, estado:'preparando', tiempo:'8 min'  },
    { id:'UE-8819', plataforma:'Uber Eats', cliente:'Paola R.',   items:1, importe:180, estado:'entregado',  tiempo:'—'     },
    { id:'RP-4468', plataforma:'Rappi',     cliente:'Iván C.',    items:4, importe:610, estado:'entregado',  tiempo:'—'     },
  ],

  // ── RESERVACIONES ────────────────────────────────────────
  reservaciones: [
    { id:1, cliente:'Familia Treviño',       personas:6,  fecha:'16/06/2026', hora:'14:00', mesa:5,    estado:'confirmada' },
    { id:2, cliente:'Despacho Jurídico Ramos', personas:8, fecha:'16/06/2026', hora:'20:30', mesa:18,   estado:'confirmada' },
    { id:3, cliente:'Ana Beltrán',           personas:2,  fecha:'17/06/2026', hora:'13:30', mesa:null, estado:'pendiente'  },
    { id:4, cliente:'Cumpleaños Sofía',      personas:12, fecha:'18/06/2026', hora:'19:00', mesa:null, estado:'pendiente'  },
    { id:5, cliente:'Carlos Ibarra',         personas:4,  fecha:'15/06/2026', hora:'21:00', mesa:10,   estado:'cancelada'  },
  ],

  // ── INTEGRACIONES ────────────────────────────────────────
  integraciones: [
    { nombre:'WhatsApp Business', estado:'conectado',    color:'#22c55e', desc:'Notificaciones de reservación y encuestas automáticas de satisfacción.' },
    { nombre:'Uber Eats',         estado:'conectado',    color:'#06c167', desc:'Sincronización automática de pedidos con conteo en tiempo real.' },
    { nombre:'Rappi',             estado:'conectado',    color:'#ff441f', desc:'Recepción de pedidos y seguimiento de tiempos de entrega.' },
    { nombre:'DiDi Food',         estado:'desconectado', color:'#ff7a00', desc:'Integración pendiente de autorización de credenciales.' },
    { nombre:'Facturación SAT',   estado:'conectado',    color:'#0ea5e9', desc:'Timbrado CFDI 4.0 conectado con tu PAC certificado.' },
    { nombre:'Google Reservas',   estado:'desconectado', color:'#a855f7', desc:'Mostrar disponibilidad de mesas directo en Google Maps.' },
  ],

};
