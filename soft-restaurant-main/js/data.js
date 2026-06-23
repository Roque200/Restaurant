/**
 * SOFT RESTAURANT DASHBOARD
 * data.js — Datos de demostración
 * Separado de la lógica para facilitar integración con API real
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
    mesasOcupadas: 8,
    totalMesas: 20,
    mesasLibres: 8,
    mesasReservadas: 2,
    mesasMantenimiento: 2,
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
    semanaActual: [18200, 21500, 19800, 22100, 28900, 35200, 29600],
    semanaAnterior:[16800, 20100, 18200, 20500, 26700, 33100, 27400]
  },

  // ── MESAS ────────────────────────────────────────────────
  mesas: [
    { num:1,  estado:'ocupada',    pax:4, tiempo:'01:12', mesero:'Carlos' },
    { num:2,  estado:'libre',      pax:0, tiempo:null,    mesero:null },
    { num:3,  estado:'ocupada',    pax:2, tiempo:'00:34', mesero:'Ana' },
    { num:4,  estado:'cuenta',     pax:3, tiempo:'01:45', mesero:'Carlos' },
    { num:5,  estado:'reservada',  pax:6, tiempo:null,    mesero:null },
    { num:6,  estado:'ocupada',    pax:2, tiempo:'00:18', mesero:'Jorge' },
    { num:7,  estado:'libre',      pax:0, tiempo:null,    mesero:null },
    { num:8,  estado:'ocupada',    pax:5, tiempo:'00:52', mesero:'Ana' },
    { num:9,  estado:'libre',      pax:0, tiempo:null,    mesero:null },
    { num:10, estado:'ocupada',    pax:4, tiempo:'01:30', mesero:'Jorge' },
    { num:11, estado:'libre',      pax:0, tiempo:null,    mesero:null },
    { num:12, estado:'mantenimiento', pax:0, tiempo:null, mesero:null },
    { num:13, estado:'ocupada',    pax:2, tiempo:'00:08', mesero:'Carlos' },
    { num:14, estado:'libre',      pax:0, tiempo:null,    mesero:null },
    { num:15, estado:'ocupada',    pax:4, tiempo:'02:05', mesero:'Ana' },
    { num:16, estado:'libre',      pax:0, tiempo:null,    mesero:null },
    { num:17, estado:'cuenta',     pax:2, tiempo:'01:20', mesero:'Jorge' },
    { num:18, estado:'reservada',  pax:8, tiempo:null,    mesero:null },
    { num:19, estado:'libre',      pax:0, tiempo:null,    mesero:null },
    { num:20, estado:'mantenimiento', pax:0, tiempo:null, mesero:null },
  ],

  // ── ÓRDENES RECIENTES ────────────────────────────────────
  ordenes: [
    { id:'#2041', mesa:4,  descripcion:'Cortes y Vinos', mesero:'Carlos', importe:1240, estado:'cuenta',   hora:'21:47' },
    { id:'#2040', mesa:15, descripcion:'Mariscos variados', mesero:'Ana', importe:890,  estado:'en-mesa',  hora:'21:39' },
    { id:'#2039', mesa:1,  descripcion:'Menú familiar x4', mesero:'Carlos', importe:1560, estado:'cocina', hora:'21:28' },
    { id:'#2038', mesa:9,  descripcion:'Antojitos + bebidas', mesero:'Jorge', importe:420, estado:'pagado', hora:'21:10' },
    { id:'#2037', mesa:6,  descripcion:'Sopas y ensaladas', mesero:'Jorge', importe:380, estado:'pagado',  hora:'20:55' },
    { id:'#2036', mesa:12, descripcion:'Menú ejecutivo x2', mesero:'Ana', importe:640,  estado:'pagado',   hora:'20:40' },
    { id:'#2035', mesa:3,  descripcion:'Tacos y aguas', mesero:'Carlos', importe:290,  estado:'cancelado', hora:'20:22' },
    { id:'#2034', mesa:8,  descripcion:'Parrillada grupal', mesero:'Ana', importe:2100, estado:'pagado',   hora:'20:05' },
  ],

  // ── TOP PLATILLOS ─────────────────────────────────────────
  topPlatillos: [
    { icon:'flame',  nombre:'Arrachera Premium 300g', vendidos:28, pctBar:100 },
    { icon:'flame',  nombre:'Camarones al ajillo',    vendidos:22, pctBar:79  },
    { icon:'flame',  nombre:'Orden de tacos (3 pzas)',vendidos:19, pctBar:68  },
    { icon:'flame',  nombre:'Ensalada Hacienda',      vendidos:16, pctBar:57  },
    { icon:'flame',  nombre:'Caldo de res especial',  vendidos:13, pctBar:46  },
    { icon:'flame',  nombre:'Michelada artesanal',    vendidos:11, pctBar:39  },
  ],

  // ── VENTAS POR CATEGORÍA (donut) ─────────────────────────
  categorias: [
    { nombre:'Cortes',    valor:8420, color:'#f97316' },
    { nombre:'Mariscos',  valor:5100, color:'#38bdf8' },
    { nombre:'Antojitos', valor:4200, color:'#a78bfa' },
    { nombre:'Bebidas',   valor:3800, color:'#22c55e' },
    { nombre:'Postres',   valor:1900, color:'#eab308' },
    { nombre:'Otros',     valor:1430, color:'#64748b' },
  ],

  // ── ALERTAS DE INVENTARIO ─────────────────────────────────
  alertas: [
    { nombre:'Arrachera (kg)',       detalle:'Quedan ~6 porciones',  stock:'2.1 kg',  tipo:'danger'  },
    { nombre:'Camarones (kg)',       detalle:'Reorden: mañana',       stock:'3.4 kg',  tipo:'warning' },
    { nombre:'Aguacate',             detalle:'Usar antes de mañana',  stock:'8 pzas',  tipo:'warning' },
    { nombre:'Cerveza artesanal',    detalle:'Bajo para fin de sem.', stock:'24 bts',  tipo:'warning' },
    { nombre:'Queso Oaxaca (kg)',    detalle:'Stock crítico',         stock:'0.8 kg',  tipo:'danger'  },
    { nombre:'Chiles secos',         detalle:'Suficiente por hoy',    stock:'400 g',   tipo:'info'    },
  ],

  // ── MESEROS ──────────────────────────────────────────────
  meseros: [
    { nombre:'Ana Martínez',   iniciales:'AM', color:'#a78bfa', mesas:3, ventasDia:8240, ticket:687 },
    { nombre:'Carlos Reyes',   iniciales:'CR', color:'#f97316', mesas:3, ventasDia:7190, ticket:599 },
    { nombre:'Jorge Salinas',  iniciales:'JS', color:'#38bdf8', mesas:2, ventasDia:5820, ticket:529 },
    { nombre:'Sofía Herrera',  iniciales:'SH', color:'#22c55e', mesas:0, ventasDia:3600, ticket:450 },
  ],

  // ── HEATMAP DE OCUPACIÓN (horas x días) ──────────────────
  heatmap: {
    dias: ['L','M','X','J','V','S','D'],
    horas: ['12','13','14','15','16','17','18','19','20','21','22','23','0','1'],
    // intensidad 0-5 por [dia][hora]
    datos: [
      [0,1,3,4,2,1,2,3,4,3,2,1,0,0], // Lunes
      [0,1,3,4,2,1,2,3,4,3,2,1,0,0], // Martes
      [0,1,2,3,2,1,2,3,4,3,2,1,0,0], // Miércoles
      [0,1,3,4,3,2,3,4,5,4,3,1,0,0], // Jueves
      [0,2,4,5,3,2,3,5,5,5,4,2,1,0], // Viernes
      [0,2,5,5,4,3,4,5,5,5,5,3,2,1], // Sábado
      [0,2,5,5,4,3,4,5,5,4,3,2,1,0], // Domingo
    ]
  },

  // ── SPARKLINE DATA (KPI cards) ────────────────────────────
  sparklines: {
    ventas:   [18200,21500,19800,22100,28900,24850],
    ticket:   [310,  325,  340,  335,  370,  385],
    clientes: [58,   71,   65,   80,   69,   64],
    ocupacion:[55,   60,   50,   65,   70,   60],
  },

  // ── INVENTARIO COMPLETO ───────────────────────────────────
  inventario: [
    { producto:'Arrachera',        categoria:'Carnes',    stock:2.1,  unidad:'kg',  minimo:5,   estado:'critico' },
    { producto:'Camarón mediano',  categoria:'Mariscos',  stock:3.4,  unidad:'kg',  minimo:4,   estado:'bajo'    },
    { producto:'Queso Oaxaca',     categoria:'Lácteos',   stock:0.8,  unidad:'kg',  minimo:3,   estado:'critico' },
    { producto:'Aguacate',         categoria:'Verduras',  stock:8,    unidad:'pza', minimo:15,  estado:'bajo'    },
    { producto:'Cerveza artesanal',categoria:'Bebidas',   stock:24,   unidad:'bot', minimo:36,  estado:'bajo'    },
    { producto:'Chile seco mixto', categoria:'Abarrotes', stock:0.4,  unidad:'kg',  minimo:1,   estado:'normal'  },
    { producto:'Tortilla maíz',    categoria:'Abarrotes', stock:18,   unidad:'kg',  minimo:10,  estado:'normal'  },
    { producto:'Limón',            categoria:'Verduras',  stock:22,   unidad:'kg',  minimo:8,   estado:'normal'  },
    { producto:'Pollo entero',     categoria:'Carnes',    stock:14,   unidad:'kg',  minimo:10,  estado:'normal'  },
    { producto:'Refresco cola',    categoria:'Bebidas',   stock:60,   unidad:'bot', minimo:40,  estado:'normal'  },
  ],

  // ── FACTURACIÓN ────────────────────────────────────────────
  facturas: [
    { folio:'F-3021', cliente:'Constructora del Bajío SA', rfc:'CBA920514XX1', importe:4280, fecha:'15/06/2026', estado:'timbrada' },
    { folio:'F-3020', cliente:'Grupo Industrial Celaya',   rfc:'GIC150831XX2', importe:1860, fecha:'15/06/2026', estado:'timbrada' },
    { folio:'F-3019', cliente:'Pública en general',        rfc:'XAXX010101000', importe:560,  fecha:'14/06/2026', estado:'timbrada' },
    { folio:'F-3018', cliente:'María Fernanda López',      rfc:'LOXM880214XX3', importe:1240, fecha:'14/06/2026', estado:'cancelada' },
    { folio:'F-3017', cliente:'Eventos y Banquetes RG',    rfc:'EBR110307XX4', importe:8900, fecha:'13/06/2026', estado:'timbrada' },
    { folio:'F-3016', cliente:'Pública en general',        rfc:'XAXX010101000', importe:325,  fecha:'13/06/2026', estado:'timbrada' },
  ],

  // ── DELIVERY ─────────────────────────────────────────────
  deliveryPedidos: [
    { id:'UE-8821', plataforma:'Uber Eats', cliente:'Ricardo M.', items:3, importe:540, estado:'en-camino', tiempo:'12 min' },
    { id:'RP-4471', plataforma:'Rappi',     cliente:'Daniela S.', items:2, importe:320, estado:'preparando', tiempo:'5 min'  },
    { id:'DD-1190', plataforma:'DiDi Food', cliente:'Hugo T.',    items:5, importe:780, estado:'preparando', tiempo:'8 min'  },
    { id:'UE-8819', plataforma:'Uber Eats', cliente:'Paola R.',   items:1, importe:180, estado:'entregado',  tiempo:'—'      },
    { id:'RP-4468', plataforma:'Rappi',     cliente:'Iván C.',    items:4, importe:610, estado:'entregado',  tiempo:'—'      },
  ],

  // ── RESERVACIONES ────────────────────────────────────────
  reservaciones: [
    { id:1, cliente:'Familia Treviño',  personas:6,  fecha:'16/06/2026', hora:'14:00', mesa:5,  estado:'confirmada' },
    { id:2, cliente:'Despacho Jurídico Ramos', personas:8, fecha:'16/06/2026', hora:'20:30', mesa:18, estado:'confirmada' },
    { id:3, cliente:'Ana Beltrán',      personas:2,  fecha:'17/06/2026', hora:'13:30', mesa:null, estado:'pendiente'  },
    { id:4, cliente:'Cumpleaños Sofía', personas:12, fecha:'18/06/2026', hora:'19:00', mesa:null, estado:'pendiente'  },
    { id:5, cliente:'Carlos Ibarra',    personas:4,  fecha:'15/06/2026', hora:'21:00', mesa:10, estado:'cancelada'  },
  ],

  // ── INTEGRACIONES DISPONIBLES ────────────────────────────
  integraciones: [
    { nombre:'WhatsApp Business', estado:'conectado',    color:'#22c55e', desc:'Notificaciones de reservación y encuestas automáticas de satisfacción.' },
    { nombre:'Uber Eats',         estado:'conectado',    color:'#06c167', desc:'Sincronización automática de pedidos e inventario en tiempo real.' },
    { nombre:'Rappi',             estado:'conectado',    color:'#ff441f', desc:'Recepción de pedidos directo en el sistema de comandas.' },
    { nombre:'DiDi Food',         estado:'desconectado', color:'#ff7a00', desc:'Integración pendiente de autorización de credenciales.' },
    { nombre:'Facturación SAT',   estado:'conectado',    color:'#38bdf8', desc:'Timbrado CFDI 4.0 conectado con tu PAC certificado.' },
    { nombre:'Google Reservas',   estado:'desconectado', color:'#a78bfa', desc:'Mostrar disponibilidad de mesas directo en Google Maps.' },
  ],

};
