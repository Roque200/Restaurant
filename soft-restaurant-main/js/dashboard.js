/**
 * SOFT RESTAURANT DASHBOARD
 * dashboard.js — Lógica del UI: renderizado de componentes, interacciones
 * Depende de: data.js, charts.js
 */

// ── RELOJ EN TIEMPO REAL ─────────────────────────────────────
function startClock() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  function tick() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick();
  setInterval(tick, 1000);
}

// ── STATUS BAR ───────────────────────────────────────────────
function renderStatusBar() {
  const kpi = RestaurantData.kpis;
  const pct = Math.round((kpi.ventasHoy / kpi.ventasMeta) * 100);
  document.getElementById('statusVentasPct').textContent = `${pct}%`;
  document.getElementById('statusOcupacion').textContent =
    `${kpi.mesasOcupadas}/${kpi.totalMesas}`;
}

// ── KPI CARDS ────────────────────────────────────────────────
function renderKpiCards() {
  const kpi = RestaurantData.kpis;
  const sp  = RestaurantData.sparklines;

  const deltaVentas  = ((kpi.ventasHoy / 22000 - 1) * 100).toFixed(1);
  const deltaTicket  = (((kpi.ticketPromedio - kpi.ticketPromedioAnterior) / kpi.ticketPromedioAnterior) * 100).toFixed(1);
  const deltaClients = (((kpi.clientesAtendidos - kpi.clientesAnteriores) / kpi.clientesAnteriores) * 100).toFixed(1);
  const ocupPct      = Math.round((kpi.mesasOcupadas / kpi.totalMesas) * 100);

  const cards = [
    {
      id: 'cardVentas', cls: 'accent',
      icon: Icons.money({ size: 18 }), label: 'Ventas del Día',
      value: `<span id="kpiVentasHoy">$${kpi.ventasHoy.toLocaleString('es-MX')}</span>`,
      delta: deltaVentas, sparkId: 'sparkVentas', sparkColor: '#f97316',
      footer: `Meta: $${kpi.ventasMeta.toLocaleString('es-MX')}`
    },
    {
      id: 'cardTicket', cls: 'success',
      icon: Icons.receipt({ size: 18 }), label: 'Ticket Promedio',
      value: `$${kpi.ticketPromedio.toLocaleString('es-MX')}`,
      delta: deltaTicket, sparkId: 'sparkTicket', sparkColor: '#22c55e',
      footer: 'vs ayer $' + kpi.ticketPromedioAnterior.toLocaleString('es-MX')
    },
    {
      id: 'cardClientes', cls: 'info',
      icon: Icons.users({ size: 18 }), label: 'Comensales Hoy',
      value: kpi.clientesAtendidos.toString(),
      delta: deltaClients, sparkId: 'sparkClientes', sparkColor: '#38bdf8',
      footer: `Ayer: ${kpi.clientesAnteriores} comensales`
    },
    {
      id: 'cardOcupacion', cls: 'warning',
      icon: Icons.seat({ size: 18 }), label: 'Ocupación',
      value: `${kpi.mesasOcupadas}<small>/${kpi.totalMesas}</small>`,
      deltaRaw: `${ocupPct}%`, isPositive: true,
      sparkId: 'sparkOcupacion', sparkColor: '#eab308',
      footer: `${kpi.mesasLibres} libres · ${kpi.mesasReservadas} reservadas`
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

// ── MESAS ─────────────────────────────────────────────────────
function renderMesas() {
  const container = document.getElementById('mesasGrid');
  if (!container) return;

  container.innerHTML = RestaurantData.mesas.map(m => {
    const tiempoLabel = m.tiempo || '';
    const tiempoMinutos = tiempoLabel
      ? parseInt(tiempoLabel.split(':')[0]) * 60 + parseInt(tiempoLabel.split(':')[1])
      : 0;
    const timeBadgeCls = tiempoMinutos >= 90 ? 'danger' : tiempoMinutos >= 60 ? 'warning' : '';

    return `
      <div class="mesa ${m.estado}" onclick="onMesaClick(${m.num})" title="Mesa ${m.num}${m.mesero ? ' · ' + m.mesero : ''}">
        <span class="mesa-num">${m.num}</span>
        ${m.pax > 0 ? `<span class="mesa-pax">×${m.pax}</span>` : ''}
        ${m.estado === 'libre' ? '<span class="mesa-pax">Libre</span>' : ''}
        ${m.estado === 'reservada' ? '<span class="mesa-pax">Rsv</span>' : ''}
        ${m.estado === 'mantenimiento' ? `<span class="mesa-pax">${Icons.wrench({size:11})}</span>` : ''}
        ${tiempoLabel ? `<span class="mesa-time ${timeBadgeCls}">${tiempoLabel}</span>` : ''}
      </div>`;
  }).join('');
}

// ── ÓRDENES RECIENTES ─────────────────────────────────────────
function renderOrdenes() {
  const container = document.getElementById('ordenesList');
  if (!container) return;

  const statusLabel = {
    'pagado':    { cls:'pagado',    txt:'Pagado'   },
    'en-mesa':   { cls:'en-mesa',   txt:'En mesa'  },
    'cocina':    { cls:'cocina',    txt:'Cocina'   },
    'cancelado': { cls:'cancelado', txt:'Cancelado' }
  };

  container.innerHTML = RestaurantData.ordenes.map(o => {
    const s = statusLabel[o.estado] || { cls:'', txt:o.estado };
    return `
      <div class="order-item">
        <div class="order-num">${o.id}</div>
        <div class="order-info">
          <div class="order-name">${o.descripcion}</div>
          <div class="order-meta">Mesa ${o.mesa} · ${o.mesero} · ${o.hora}</div>
        </div>
        <div class="order-amount">$${o.importe.toLocaleString('es-MX')}</div>
        <div class="order-status ${s.cls}">${s.txt}</div>
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
      <div class="platillo-emoji">${Icons.flame({ size: 16 })}</div>
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

// ── ALERTAS DE INVENTARIO ─────────────────────────────────────
function renderAlertas() {
  const container = document.getElementById('alertasList');
  if (!container) return;

  const iconMap = {
    danger:  Icons.x({ size: 14 }),
    warning: Icons.filter({ size: 14 }),
    info:    Icons.check({ size: 14 })
  };

  container.innerHTML = RestaurantData.alertas.map(a => `
    <div class="alert-item">
      <div class="alert-icon ${a.tipo}">${iconMap[a.tipo]}</div>
      <div class="alert-info">
        <div class="alert-name">${a.nombre}</div>
        <div class="alert-detail">${a.detalle}</div>
      </div>
      <div class="alert-stock ${a.tipo}">${a.stock}</div>
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

  // Total en centro
  const totalEl = document.getElementById('donutTotal');
  if (totalEl) totalEl.textContent = `$${(total/1000).toFixed(1)}k`;
}

// ── INTERACCIÓN: CLIC EN MESA ─────────────────────────────────
function onMesaClick(numMesa) {
  const mesa = RestaurantData.mesas.find(m => m.num === numMesa);
  if (!mesa) return;
  const statusText = {
    libre: 'disponible', ocupada: 'ocupada',
    cuenta: 'pidiendo la cuenta', reservada: 'reservada',
    mantenimiento: 'en mantenimiento'
  };
  const msg = mesa.estado === 'ocupada' || mesa.estado === 'cuenta'
    ? `Mesa ${numMesa} — ${statusText[mesa.estado]}\n${mesa.pax} comensales · ${mesa.tiempo} min · ${mesa.mesero}`
    : `Mesa ${numMesa} — ${statusText[mesa.estado]}`;
  showToast(msg, mesa.estado === 'cuenta' ? 'warning' : mesa.estado === 'libre' ? 'success' : 'info');
}

// ── TABS ──────────────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        // Cambiar período visible en gráfica
        const period = tab.dataset.period;
        if (period && charts.ventasHora) {
          // Simulación de cambio de período
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
    success: '#22c55e', warning: '#eab308',
    danger: '#ef4444', info: '#38bdf8'
  };

  const toast = document.createElement('div');
  toast.style.cssText = `
    background:#1e2335; border:1px solid ${colors[type] || colors.info}44;
    border-left: 3px solid ${colors[type] || colors.info};
    border-radius:8px; padding:12px 16px;
    font-size:.8125rem; color:#f0f2f8; font-family:'Inter',sans-serif;
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

// ── BARRA DE PROGRESO — META DEL DÍA ─────────────────────────
function renderMetaProgress() {
  const kpi = RestaurantData.kpis;
  const pct = Math.min(Math.round((kpi.ventasHoy / kpi.ventasMeta) * 100), 100);
  const el = document.getElementById('metaProgressFill');
  if (el) el.style.width = `${pct}%`;
  const pctEl = document.getElementById('metaProgressPct');
  if (pctEl) pctEl.textContent = `${pct}%`;
}

// ── INYECCIÓN DE ÍCONOS ESTÁTICOS (sidebar, header, card titles) ─
function injectStaticIcons() {
  document.querySelectorAll('.nav-item[data-icon]').forEach(item => {
    const slot = item.querySelector('.nav-icon');
    const fn = Icons[item.dataset.icon];
    if (slot && fn) slot.innerHTML = fn({ size: 17 });
  });

  const map = {
    logoIconSlot:      Icons.flame({ size: 18, stroke: '#0f1117' }),
    searchIconSlot:    Icons.search({ size: 15 }),
    bellBtnSlot:       Icons.bell({ size: 17 }),
    userBtnSlot:       Icons.user({ size: 17 }),
    iconVentasHora:    Icons.chartLine({ size: 16 }),
    iconMesas:         Icons.table({ size: 16 }),
    iconDonut:         Icons.dashboard({ size: 16 }),
    iconSemana:        Icons.chartLine({ size: 16 }),
    iconOrdenes:       Icons.clipboard({ size: 16 }),
    iconTopPlatillos:  Icons.trophy({ size: 16 }),
    iconHeatmap:       Icons.flame({ size: 16 }),
    iconAlertas:       Icons.box({ size: 16 }),
    iconMeseros:       Icons.users({ size: 16 }),
  };
  Object.entries(map).forEach(([id, svg]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = svg;
  });
}

// ── ENLACES "Ver más" QUE NAVEGAN A OTRA PÁGINA ──────────────
function initCardActionLinks() {
  document.querySelectorAll('.card-action[data-goto]').forEach(link => {
    link.addEventListener('click', () => navigateTo(link.dataset.goto));
  });
}

// ── PUNTO DE ENTRADA ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Inyectar íconos SVG en sidebar, header y títulos de cards
  injectStaticIcons();

  // Fecha de hoy en el header
  const fechaEl = document.getElementById('headerSubtitle');
  if (fechaEl) {
    fechaEl.textContent = new Date().toLocaleDateString('es-MX', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });
  }

  // Renderizar todos los componentes de la página de resumen
  renderStatusBar();
  renderKpiCards();
  renderMesas();
  renderOrdenes();
  renderTopPlatillos();
  renderAlertas();
  renderMeseros();
  renderDonutLegend();
  renderMetaProgress();

  // Inicializar gráficas (después de render para que sparklines tengan width)
  setTimeout(initAllCharts, 50);

  // Interacciones
  initTabs();
  initRouter();
  initCardActionLinks();
  startClock();

  // Simulación en vivo
  startLiveSimulation();

  console.log('Soft Restaurant Dashboard — Iniciado');
});
