/**
 * LA HACIENDA · GERENCIA DIGITAL
 * dashboard.js — UI del resumen diario
 * Complementa Soft Restaurant con analítica de delivery, reservaciones y desempeño
 */

// ── RELOJ EN TIEMPO REAL ─────────────────────────────────────
function startClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  }
  tick();
  setInterval(tick, 1000);
}

// ── STATUS BAR ───────────────────────────────────────────────
function renderStatusBar() {
  const kpi = RestaurantData.kpis;
  const pct = Math.round((kpi.ventasHoy / kpi.ventasMeta) * 100);

  const pctEl = document.getElementById('statusVentasPct');
  if (pctEl) pctEl.textContent = `${pct}%`;

  const delivEl = document.getElementById('statusDelivery');
  if (delivEl) delivEl.textContent = `${kpi.pedidosDelivery} activos`;

  const resEl = document.getElementById('statusReservas');
  if (resEl) resEl.textContent = `${kpi.reservacionesHoy} confirmadas`;
}

// ── KPI CARDS ────────────────────────────────────────────────
function renderKpiCards() {
  const kpi = RestaurantData.kpis;
  const sp  = RestaurantData.sparklines;

  const deltaVentas  = ((kpi.ventasHoy / 22000 - 1) * 100).toFixed(1);
  const deltaTicket  = (((kpi.ticketPromedio - kpi.ticketPromedioAnterior) / kpi.ticketPromedioAnterior) * 100).toFixed(1);
  const deltaClients = (((kpi.clientesAtendidos - kpi.clientesAnteriores) / kpi.clientesAnteriores) * 100).toFixed(1);

  const cards = [
    {
      id: 'cardVentas', cls: 'accent',
      icon: Icons.money({ size: 18 }), label: 'Ventas del Día',
      value: `<span id="kpiVentasHoy">$${kpi.ventasHoy.toLocaleString('es-MX')}</span>`,
      delta: deltaVentas, sparkId: 'sparkVentas', sparkColor: '#6366f1',
      footer: `Meta: $${kpi.ventasMeta.toLocaleString('es-MX')}`
    },
    {
      id: 'cardTicket', cls: 'success',
      icon: Icons.receipt({ size: 18 }), label: 'Ticket Promedio',
      value: `$${kpi.ticketPromedio.toLocaleString('es-MX')}`,
      delta: deltaTicket, sparkId: 'sparkTicket', sparkColor: '#10b981',
      footer: 'vs ayer $' + kpi.ticketPromedioAnterior.toLocaleString('es-MX')
    },
    {
      id: 'cardClientes', cls: 'info',
      icon: Icons.users({ size: 18 }), label: 'Comensales Hoy',
      value: kpi.clientesAtendidos.toString(),
      delta: deltaClients, sparkId: 'sparkClientes', sparkColor: '#0ea5e9',
      footer: `Ayer: ${kpi.clientesAnteriores} comensales`
    },
    {
      id: 'cardDelivery', cls: 'warning',
      icon: Icons.truck({ size: 18 }), label: 'Ventas Delivery',
      value: `$${kpi.ventasDelivery.toLocaleString('es-MX')}`,
      deltaRaw: `${kpi.pedidosDelivery} activos`, isPositive: true,
      sparkId: 'sparkDelivery', sparkColor: '#f59e0b',
      footer: '3 plataformas conectadas'
    }
  ];

  const grid = document.getElementById('kpiGrid');
  if (!grid) return;

  grid.innerHTML = cards.map(c => `
    <div class="kpi-card ${c.cls} animate-in">
      <div class="kpi-header">
        <span class="kpi-label">${c.label}</span>
        <div class="kpi-icon">${c.icon}</div>
      </div>
      <div class="kpi-value">${c.value}</div>
      <div class="sparkline" id="${c.sparkId}"></div>
      <div class="kpi-footer">
        ${c.deltaRaw
          ? `<span class="kpi-delta ${c.isPositive ? 'up' : 'down'}">${c.isPositive ? '↑' : '↓'} ${c.deltaRaw}</span>`
          : `<span class="kpi-delta ${parseFloat(c.delta) >= 0 ? 'up' : 'down'}">
               ${parseFloat(c.delta) >= 0 ? '↑' : '↓'} ${Math.abs(c.delta)}%
             </span>`
        }
        <span>${c.footer}</span>
      </div>
    </div>
  `).join('');
}

// ── DELIVERY POR PLATAFORMA (card en dashboard) ───────────────
function renderDeliveryResumen() {
  const summaryEl = document.getElementById('platformSummary');
  const listEl    = document.getElementById('deliveryActiveList');
  if (!summaryEl || !listEl) return;

  const platformColor = { 'Uber Eats':'#06c167', 'Rappi':'#ff441f', 'DiDi Food':'#ff7a00' };
  const pedidos = RestaurantData.deliveryPedidos;

  // Agrupar por plataforma
  const plataformas = {};
  pedidos.forEach(p => {
    if (!plataformas[p.plataforma]) plataformas[p.plataforma] = { pedidos: 0, importe: 0 };
    plataformas[p.plataforma].pedidos++;
    plataformas[p.plataforma].importe += p.importe;
  });

  summaryEl.innerHTML = Object.entries(plataformas).map(([nombre, info]) => `
    <div class="platform-item">
      <div class="platform-dot" style="color:${platformColor[nombre] || '#818cf8'}; background:${platformColor[nombre] || '#818cf8'}"></div>
      <span class="platform-name">${nombre}</span>
      <span class="platform-count">${info.pedidos} pedido${info.pedidos !== 1 ? 's' : ''}</span>
      <span class="platform-amount">$${info.importe.toLocaleString('es-MX')}</span>
    </div>
  `).join('');

  // Solo pedidos activos en la lista
  const activos = pedidos.filter(p => p.estado !== 'entregado');
  listEl.innerHTML = activos.map(p => `
    <div class="order-item">
      <div class="order-num">${p.id}</div>
      <div class="order-info">
        <div class="order-name">${p.cliente}</div>
        <div class="order-meta">${p.plataforma} · ${p.items} items · ${p.tiempo}</div>
      </div>
      <div class="order-amount">$${p.importe.toLocaleString('es-MX')}</div>
      <div class="order-status ${p.estado}">${p.estado === 'en-camino' ? 'En camino' : 'Preparando'}</div>
    </div>
  `).join('');
}

// ── PRÓXIMAS RESERVACIONES (card en dashboard) ────────────────
function renderReservaciones() {
  const container = document.getElementById('reservasList');
  if (!container) return;

  const statusMap = {
    confirmada: { cls:'success', txt:'Confirmada' },
    pendiente:  { cls:'warning', txt:'Pendiente'  },
    cancelada:  { cls:'danger',  txt:'Cancelada'  },
  };

  const proximas = RestaurantData.reservaciones
    .filter(r => r.estado !== 'cancelada')
    .slice(0, 5);

  container.innerHTML = proximas.map(r => {
    const s = statusMap[r.estado] || { cls:'info', txt:r.estado };
    return `
      <div class="reserva-item">
        <div class="reserva-time">${r.hora}</div>
        <div class="reserva-info">
          <div class="reserva-name">${r.cliente}</div>
          <div class="reserva-meta">${r.fecha}${r.mesa ? ' · Mesa ' + r.mesa : ' · Sin mesa asignada'}</div>
        </div>
        <div class="reserva-pax">
          ${r.personas}
          <small>personas</small>
        </div>
        <span class="chip ${s.cls}" style="margin-left:4px">${s.txt}</span>
      </div>`;
  }).join('');
}

// ── TOP PLATILLOS ─────────────────────────────────────────────
function renderTopPlatillos() {
  const container = document.getElementById('platillosList');
  if (!container) return;

  const rankStyle = ['gold','silver','bronze','','',''];

  container.innerHTML = RestaurantData.topPlatillos.map((p, i) => `
    <div class="platillo-item">
      <div class="platillo-rank ${rankStyle[i] || ''}">#${i+1}</div>
      <div class="platillo-emoji">${Icons.flame({ size: 15 })}</div>
      <div class="platillo-info">
        <div class="platillo-name">${p.nombre}</div>
        <div class="platillo-bar-wrap">
          <div class="platillo-bar" style="width:${p.pctBar}%"></div>
        </div>
      </div>
      <div class="platillo-qty">${p.vendidos} uds</div>
    </div>
  `).join('');
}

// ── NOTIFICACIONES (reemplaza alertas de inventario) ──────────
function renderNotificaciones() {
  const container = document.getElementById('notifList');
  if (!container) return;

  const iconMap = {
    success: Icons.check({ size: 13 }),
    warning: Icons.filter({ size: 13 }),
    info:    Icons.bell({ size: 13 }),
    danger:  Icons.x({ size: 13 }),
  };

  container.innerHTML = RestaurantData.notificaciones.map(n => `
    <div class="notif-item">
      <div class="notif-icon ${n.tipo}">${iconMap[n.tipo] || ''}</div>
      <div class="notif-info">
        <div class="notif-title">${n.titulo}</div>
        <div class="notif-detail">${n.detalle}</div>
      </div>
      <div class="notif-hora">${n.hora}</div>
    </div>
  `).join('');
}

// ── MESEROS ───────────────────────────────────────────────────
function renderMeseros() {
  const container = document.getElementById('meserosList');
  if (!container) return;

  container.innerHTML = RestaurantData.meseros.map(m => `
    <div class="mesero-item">
      <div class="mesero-avatar" style="background:${m.color}">${m.iniciales}</div>
      <div class="mesero-info">
        <div class="mesero-name">${m.nombre}</div>
        <div class="mesero-mesas">${m.mesas} mesa${m.mesas !== 1 ? 's' : ''} activa${m.mesas !== 1 ? 's' : ''}</div>
      </div>
      <div class="mesero-ventas">
        $${m.ventasDia.toLocaleString('es-MX')}
        <small>$${m.ticket} ticket avg</small>
      </div>
    </div>
  `).join('');
}

// ── LEYENDA DEL DONUT ─────────────────────────────────────────
function renderDonutLegend() {
  const container = document.getElementById('donutLegend');
  if (!container) return;

  const total = RestaurantData.categorias.reduce((s, c) => s + c.valor, 0);

  container.innerHTML = RestaurantData.categorias.map(c => `
    <div class="donut-legend-item">
      <div class="donut-legend-dot" style="background:${c.color}"></div>
      <span class="donut-legend-label">${c.nombre}</span>
      <span class="donut-legend-val">$${c.valor.toLocaleString('es-MX')}</span>
      <span class="donut-legend-pct">${((c.valor/total)*100).toFixed(0)}%</span>
    </div>
  `).join('');

  const totalEl = document.getElementById('donutTotal');
  if (totalEl) totalEl.textContent = `$${(total/1000).toFixed(1)}k`;
}

// ── BARRA DE PROGRESO — META DEL DÍA ─────────────────────────
function renderMetaProgress() {
  const kpi = RestaurantData.kpis;
  const pct = Math.min(Math.round((kpi.ventasHoy / kpi.ventasMeta) * 100), 100);
  const el = document.getElementById('metaProgressFill');
  if (el) el.style.width = `${pct}%`;
  const pctEl = document.getElementById('metaProgressPct');
  if (pctEl) pctEl.textContent = `${pct}%`;
}

// ── TABS ──────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const period = tab.dataset.period;
        if (period && charts.ventasHora) {
          const multipliers = { hoy: 1, semana: 0.85, mes: 0.7 };
          const base = RestaurantData.ventasPorHora.hoy;
          charts.ventasHora.data.datasets[0].data = base.map(v => Math.round(v * (multipliers[period] || 1)));
          charts.ventasHora.update();
        }
      });
    });
  });
}

// ── TOAST NOTIFICATION ────────────────────────────────────────
function showToast(msg, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
      position:fixed; bottom:24px; right:24px;
      display:flex; flex-direction:column; gap:8px;
      z-index:9999; max-width:320px;
    `;
    document.body.appendChild(container);
  }

  const colors = {
    success: '#10b981', warning: '#f59e0b',
    danger: '#ef4444',  info: '#6366f1'
  };

  const toast = document.createElement('div');
  toast.style.cssText = `
    background:#0c1632; border:1px solid ${colors[type] || colors.info}44;
    border-left: 3px solid ${colors[type] || colors.info};
    border-radius:10px; padding:12px 16px;
    font-size:.8125rem; color:#f1f5f9; font-family:'Inter',sans-serif;
    box-shadow:0 8px 32px rgba(0,0,0,.5);
    animation: slideIn .25s cubic-bezier(.4,0,.2,1) both;
    white-space: pre-line; line-height: 1.5;
  `;
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all .25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

// ── INYECCIÓN DE ÍCONOS ESTÁTICOS ────────────────────────────
function injectStaticIcons() {
  document.querySelectorAll('.nav-item[data-icon]').forEach(item => {
    const slot = item.querySelector('.nav-icon');
    const fn = Icons[item.dataset.icon];
    if (slot && fn) slot.innerHTML = fn({ size: 17 });
  });

  const map = {
    logoIconSlot:         Icons.flame({ size: 18, stroke: '#fff' }),
    searchIconSlot:       Icons.search({ size: 15 }),
    bellBtnSlot:          Icons.bell({ size: 17 }),
    userBtnSlot:          Icons.user({ size: 17 }),
    iconVentasHora:       Icons.chartLine({ size: 16 }),
    iconDeliveryResumen:  Icons.truck({ size: 16 }),
    iconDonut:            Icons.dashboard({ size: 16 }),
    iconSemana:           Icons.chartLine({ size: 16 }),
    iconReservas:         Icons.calendar({ size: 16 }),
    iconTopPlatillos:     Icons.trophy({ size: 16 }),
    iconHeatmap:          Icons.flame({ size: 16 }),
    iconNotif:            Icons.bell({ size: 16 }),
    iconMeseros:          Icons.users({ size: 16 }),
  };

  Object.entries(map).forEach(([id, svg]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = svg;
  });
}

// ── CARD ACTION LINKS ─────────────────────────────────────────
function initCardActionLinks() {
  document.querySelectorAll('.card-action[data-goto]').forEach(link => {
    link.addEventListener('click', () => navigateTo(link.dataset.goto));
  });
}

// ── PUNTO DE ENTRADA ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectStaticIcons();

  const fechaEl = document.getElementById('headerSubtitle');
  if (fechaEl) {
    fechaEl.textContent = new Date().toLocaleDateString('es-MX', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });
  }

  renderStatusBar();
  renderKpiCards();
  renderDeliveryResumen();
  renderReservaciones();
  renderTopPlatillos();
  renderNotificaciones();
  renderMeseros();
  renderDonutLegend();
  renderMetaProgress();

  setTimeout(initAllCharts, 50);

  initTabs();
  initRouter();
  initCardActionLinks();
  startClock();
  startLiveSimulation();

  console.log('La Hacienda · Gerencia Digital — Iniciado');
});
