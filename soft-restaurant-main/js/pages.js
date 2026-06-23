/**
 * SOFT RESTAURANT DASHBOARD
 * pages.js — Router simple entre vistas del sidebar + renderizado
 * de las secciones básicas (mesas, comandas, inventario, facturación,
 * delivery, ventas, meseros, platillos, reservaciones, configuración,
 * integraciones).
 * Depende de: data.js, icons.js
 */

const PAGE_TITLES = {
  resumen:        { title: 'Resumen del Día',        subtitle: null },
  mesas:          { title: 'Control de Mesas',        subtitle: 'Plano general y estado de las 20 mesas' },
  comandas:       { title: 'Comandas',                subtitle: 'Órdenes activas y su estado en cocina' },
  inventario:     { title: 'Inventario',              subtitle: 'Existencias y niveles mínimos por producto' },
  facturacion:    { title: 'Facturación',              subtitle: 'CFDI emitidos y su estatus ante el SAT' },
  delivery:       { title: 'Delivery',                subtitle: 'Pedidos de plataformas externas en curso' },
  ventas:         { title: 'Reporte de Ventas',        subtitle: 'Comparativo semanal y por categoría' },
  meseros:        { title: 'Meseros',                  subtitle: 'Desempeño del turno actual' },
  platillos:      { title: 'Platillos',                subtitle: 'Ranking de ventas por producto' },
  reservaciones:  { title: 'Reservaciones',            subtitle: 'Próximas reservas confirmadas y pendientes' },
  configuracion:  { title: 'Configuración',            subtitle: 'Preferencias generales del sistema' },
  integraciones:  { title: 'Integraciones',            subtitle: 'Conexiones con plataformas externas' },
};

// ── NAVEGACIÓN ─────────────────────────────────────────────
function navigateTo(view) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${view}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-view="${view}"]`);
  if (navItem) navItem.classList.add('active');

  const meta = PAGE_TITLES[view] || { title: 'Soft Restaurant', subtitle: null };
  document.getElementById('headerTitle').textContent = meta.title;
  const subEl = document.getElementById('headerSubtitle');
  if (meta.subtitle) {
    subEl.textContent = meta.subtitle;
  } else {
    subEl.textContent = new Date().toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  }

  renderPage(view);
  window.scrollTo({ top: 0, behavior: 'instant' });
  document.querySelector('.main').scrollTo({ top: 0, behavior: 'instant' });
}

function initRouter() {
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.view));
  });
}

// Llama al render correspondiente solo la primera vez (lazy)
const renderedPages = new Set();
function renderPage(view) {
  if (renderedPages.has(view)) return;
  renderedPages.add(view);

  switch (view) {
    case 'mesas':         renderMesasPage(); break;
    case 'comandas':      renderComandasPage(); break;
    case 'inventario':    renderInventarioPage(); break;
    case 'facturacion':   renderFacturacionPage(); break;
    case 'delivery':      renderDeliveryPage(); break;
    case 'ventas':        renderVentasPage(); break;
    case 'meseros':       renderMeserosPage(); break;
    case 'platillos':     renderPlatillosPage(); break;
    case 'reservaciones': renderReservacionesPage(); break;
    case 'configuracion': renderConfiguracionPage(); break;
    case 'integraciones': renderIntegracionesPage(); break;
  }
}

// ── HELPERS DE FORMATO ───────────────────────────────────────
const fmtMoney = n => `$${n.toLocaleString('es-MX')}`;
const chipEstado = (estado, map) => {
  const m = map[estado] || { cls: 'info', txt: estado };
  return `<span class="chip ${m.cls}">${m.txt}</span>`;
};

// ── PÁGINA: MESAS (vista completa, tipo plano) ───────────────
function renderMesasPage() {
  const el = document.getElementById('page-mesas');
  const totalLibres   = RestaurantData.mesas.filter(m => m.estado === 'libre').length;
  const totalOcupadas = RestaurantData.mesas.filter(m => m.estado === 'ocupada').length;
  const totalCuenta   = RestaurantData.mesas.filter(m => m.estado === 'cuenta').length;
  const totalReserva  = RestaurantData.mesas.filter(m => m.estado === 'reservada').length;

  el.innerHTML = `
    <div class="stat-tile-grid">
      <div class="stat-tile">
        <div class="stat-tile-icon">${Icons.seat({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${totalLibres}</div><div class="stat-tile-lbl">Mesas libres</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-accent)">${Icons.table({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${totalOcupadas}</div><div class="stat-tile-lbl">Ocupadas</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-warning)">${Icons.receipt({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${totalCuenta}</div><div class="stat-tile-lbl">Pidiendo cuenta</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-info)">${Icons.calendar({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${totalReserva}</div><div class="stat-tile-lbl">Reservadas</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">${Icons.grid({ size: 18, className:'card-title-icon' })}Plano del Restaurante</div>
        <div class="page-toolbar-right">
          <button class="btn btn-sm">${Icons.filter({ size: 14 })} Filtrar</button>
        </div>
      </div>
      <div class="mesas-grid" style="grid-template-columns:repeat(8,1fr); padding:24px" id="mesasGridFull"></div>
      <div class="mesas-legend">
        <div class="legend-item"><div class="legend-dot" style="background:rgba(34,197,94,.5)"></div><span>Libre</span></div>
        <div class="legend-item"><div class="legend-dot" style="background:rgba(249,115,22,.6)"></div><span>Ocupada</span></div>
        <div class="legend-item"><div class="legend-dot" style="background:rgba(234,179,8,.6)"></div><span>Pidiendo cuenta</span></div>
        <div class="legend-item"><div class="legend-dot" style="background:rgba(56,189,248,.5)"></div><span>Reservada</span></div>
        <div class="legend-item"><div class="legend-dot" style="background:rgba(239,68,68,.5)"></div><span>Mantenimiento</span></div>
      </div>
    </div>
  `;

  const grid = document.getElementById('mesasGridFull');
  grid.innerHTML = RestaurantData.mesas.map(m => {
    const tiempoLabel = m.tiempo || '';
    const tiempoMinutos = tiempoLabel ? parseInt(tiempoLabel.split(':')[0]) * 60 + parseInt(tiempoLabel.split(':')[1]) : 0;
    const timeBadgeCls = tiempoMinutos >= 90 ? 'danger' : tiempoMinutos >= 60 ? 'warning' : '';
    return `
      <div class="mesa ${m.estado}" onclick="onMesaClick(${m.num})" title="Mesa ${m.num}">
        <span class="mesa-num">${m.num}</span>
        ${m.pax > 0 ? `<span class="mesa-pax">×${m.pax}</span>` : ''}
        ${m.estado === 'libre' ? '<span class="mesa-pax">Libre</span>' : ''}
        ${m.estado === 'reservada' ? '<span class="mesa-pax">Rsv</span>' : ''}
        ${m.estado === 'mantenimiento' ? `<span class="mesa-pax">${Icons.wrench({size:11})}</span>` : ''}
        ${tiempoLabel ? `<span class="mesa-time ${timeBadgeCls}">${tiempoLabel}</span>` : ''}
      </div>`;
  }).join('');
}

// ── PÁGINA: COMANDAS ──────────────────────────────────────────
function renderComandasPage() {
  const el = document.getElementById('page-comandas');
  const statusMap = {
    pagado:    { cls:'success', txt:'Pagado'   },
    'en-mesa': { cls:'accent',  txt:'En mesa'  },
    cocina:    { cls:'warning', txt:'Cocina'   },
    cancelado: { cls:'danger',  txt:'Cancelado'}
  };

  el.innerHTML = `
    <div class="page-toolbar">
      <div class="page-toolbar-left">
        <input class="input" placeholder="Buscar folio o mesa..." style="width:220px">
        <select class="select"><option>Todos los estados</option><option>En mesa</option><option>Cocina</option><option>Pagado</option></select>
      </div>
      <div class="page-toolbar-right">
        <button class="btn btn-primary">${Icons.plus({ size: 14 })} Nueva comanda</button>
      </div>
    </div>
    <div class="card">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>Folio</th><th>Mesa</th><th>Descripción</th><th>Mesero</th><th>Hora</th><th>Estado</th><th class="cell-right">Importe</th><th></th>
          </tr></thead>
          <tbody>
            ${RestaurantData.ordenes.map(o => `
              <tr>
                <td class="cell-mono cell-muted">${o.id}</td>
                <td>Mesa ${o.mesa}</td>
                <td>${o.descripcion}</td>
                <td>${o.mesero}</td>
                <td class="cell-mono cell-muted">${o.hora}</td>
                <td>${chipEstado(o.estado, statusMap)}</td>
                <td class="cell-right cell-mono">${fmtMoney(o.importe)}</td>
                <td class="cell-actions">
                  <button class="icon-btn" title="Editar">${Icons.edit({ size: 15 })}</button>
                  <button class="icon-btn" title="Imprimir">${Icons.print({ size: 15 })}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── PÁGINA: INVENTARIO ────────────────────────────────────────
function renderInventarioPage() {
  const el = document.getElementById('page-inventario');
  const statusMap = {
    critico: { cls:'danger',  txt:'Crítico' },
    bajo:    { cls:'warning', txt:'Bajo'    },
    normal:  { cls:'success', txt:'Normal'  },
  };
  const criticos = RestaurantData.inventario.filter(i => i.estado === 'critico').length;
  const bajos    = RestaurantData.inventario.filter(i => i.estado === 'bajo').length;

  el.innerHTML = `
    <div class="stat-tile-grid">
      <div class="stat-tile">
        <div class="stat-tile-icon">${Icons.box({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${RestaurantData.inventario.length}</div><div class="stat-tile-lbl">Productos registrados</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-danger)">${Icons.x({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${criticos}</div><div class="stat-tile-lbl">Stock crítico</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-warning)">${Icons.filter({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${bajos}</div><div class="stat-tile-lbl">Stock bajo</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-success)">${Icons.check({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${RestaurantData.inventario.length - criticos - bajos}</div><div class="stat-tile-lbl">Niveles normales</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">${Icons.box({ size: 18, className:'card-title-icon' })}Existencias por Producto</div>
        <button class="btn btn-primary">${Icons.plus({ size: 14 })} Agregar producto</button>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Producto</th><th>Categoría</th><th class="cell-right">Stock actual</th><th class="cell-right">Mínimo</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            ${RestaurantData.inventario.map(i => `
              <tr>
                <td>${i.producto}</td>
                <td class="cell-muted">${i.categoria}</td>
                <td class="cell-right cell-mono">${i.stock} ${i.unidad}</td>
                <td class="cell-right cell-mono cell-muted">${i.minimo} ${i.unidad}</td>
                <td>${chipEstado(i.estado, statusMap)}</td>
                <td class="cell-actions">
                  <button class="icon-btn" title="Editar">${Icons.edit({ size: 15 })}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── PÁGINA: FACTURACIÓN ───────────────────────────────────────
function renderFacturacionPage() {
  const el = document.getElementById('page-facturacion');
  const statusMap = {
    timbrada: { cls:'success', txt:'Timbrada' },
    cancelada:{ cls:'danger',  txt:'Cancelada'},
  };
  const totalDia = RestaurantData.facturas.reduce((s,f) => f.estado === 'timbrada' ? s + f.importe : s, 0);

  el.innerHTML = `
    <div class="page-toolbar">
      <div class="page-toolbar-left">
        <div class="stat-tile" style="padding:12px 18px">
          <div class="stat-tile-icon">${Icons.invoice({ size: 18 })}</div>
          <div class="stat-tile-info"><div class="stat-tile-val">${fmtMoney(totalDia)}</div><div class="stat-tile-lbl">Timbrado hoy</div></div>
        </div>
      </div>
      <div class="page-toolbar-right">
        <button class="btn">${Icons.download({ size: 14 })} Exportar XML</button>
        <button class="btn btn-primary">${Icons.plus({ size: 14 })} Nueva factura</button>
      </div>
    </div>
    <div class="card">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Folio</th><th>Cliente</th><th>RFC</th><th>Fecha</th><th>Estado</th><th class="cell-right">Importe</th><th></th></tr></thead>
          <tbody>
            ${RestaurantData.facturas.map(f => `
              <tr>
                <td class="cell-mono cell-muted">${f.folio}</td>
                <td>${f.cliente}</td>
                <td class="cell-mono cell-muted">${f.rfc}</td>
                <td class="cell-muted">${f.fecha}</td>
                <td>${chipEstado(f.estado, statusMap)}</td>
                <td class="cell-right cell-mono">${fmtMoney(f.importe)}</td>
                <td class="cell-actions">
                  <button class="icon-btn" title="Descargar PDF">${Icons.download({ size: 15 })}</button>
                  <button class="icon-btn" title="Imprimir">${Icons.print({ size: 15 })}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── PÁGINA: DELIVERY ───────────────────────────────────────────
function renderDeliveryPage() {
  const el = document.getElementById('page-delivery');
  const statusMap = {
    'en-camino': { cls:'info',    txt:'En camino' },
    preparando:  { cls:'warning', txt:'Preparando'},
    entregado:   { cls:'success', txt:'Entregado'  },
  };
  const platformColor = { 'Uber Eats':'#06c167', 'Rappi':'#ff441f', 'DiDi Food':'#ff7a00' };
  const activos = RestaurantData.deliveryPedidos.filter(p => p.estado !== 'entregado').length;

  el.innerHTML = `
    <div class="stat-tile-grid">
      <div class="stat-tile">
        <div class="stat-tile-icon">${Icons.truck({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${activos}</div><div class="stat-tile-lbl">Pedidos activos</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:#06c167">${Icons.link({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">3</div><div class="stat-tile-lbl">Plataformas conectadas</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-success)">${Icons.money({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${fmtMoney(RestaurantData.deliveryPedidos.reduce((s,p)=>s+p.importe,0))}</div><div class="stat-tile-lbl">Ventas delivery hoy</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-info)">${Icons.chartLine({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">12%</div><div class="stat-tile-lbl">Del total de ventas</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">${Icons.truck({ size: 18, className:'card-title-icon' })}Pedidos de Plataformas</div>
        <span class="card-action">Ver historial</span>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>ID</th><th>Plataforma</th><th>Cliente</th><th class="cell-right">Items</th><th>Estado</th><th>Tiempo</th><th class="cell-right">Importe</th></tr></thead>
          <tbody>
            ${RestaurantData.deliveryPedidos.map(p => `
              <tr>
                <td class="cell-mono cell-muted">${p.id}</td>
                <td><span style="display:inline-flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:${platformColor[p.plataforma]}"></span>${p.plataforma}</span></td>
                <td>${p.cliente}</td>
                <td class="cell-right cell-mono">${p.items}</td>
                <td>${chipEstado(p.estado, statusMap)}</td>
                <td class="cell-muted">${p.tiempo}</td>
                <td class="cell-right cell-mono">${fmtMoney(p.importe)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── PÁGINA: VENTAS (reporte) ──────────────────────────────────
function renderVentasPage() {
  const el = document.getElementById('page-ventas');
  el.innerHTML = `
    <div class="content-grid-2">
      <div class="card">
        <div class="card-header">
          <div class="card-title">${Icons.chartLine({ size: 18, className:'card-title-icon' })}Ventas — Esta Semana vs Anterior</div>
        </div>
        <div class="chart-wrapper" style="height:260px; padding-top:16px">
          <canvas id="chartVentasSemanaPage"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">${Icons.dashboard({ size: 18, className:'card-title-icon' })}Por Categoría</div>
        </div>
        <div class="donut-wrap">
          <div class="donut-canvas-wrap">
            <canvas id="chartCategoriasPage" width="140" height="140"></canvas>
            <div class="donut-center">
              <div class="donut-center-val" id="donutTotalPage">...</div>
              <div class="donut-center-lbl">Total</div>
            </div>
          </div>
          <div class="donut-legend" id="donutLegendPage"></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">${Icons.invoice({ size: 18, className:'card-title-icon' })}Resumen Diario (últimos 7 días)</div></div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Día</th><th class="cell-right">Ventas</th><th class="cell-right">Semana anterior</th><th class="cell-right">Variación</th></tr></thead>
          <tbody>
            ${RestaurantData.ventasSemana.labels.map((d, i) => {
              const actual = RestaurantData.ventasSemana.semanaActual[i];
              const anterior = RestaurantData.ventasSemana.semanaAnterior[i];
              const delta = (((actual - anterior) / anterior) * 100).toFixed(1);
              const up = delta >= 0;
              return `
                <tr>
                  <td>${d}</td>
                  <td class="cell-right cell-mono">${fmtMoney(actual)}</td>
                  <td class="cell-right cell-mono cell-muted">${fmtMoney(anterior)}</td>
                  <td class="cell-right"><span class="kpi-delta ${up ? 'up':'down'}">${up?'+':''}${delta}%</span></td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  setTimeout(() => {
    initVentasSemanaChartOn('chartVentasSemanaPage');
    initCategoryDonutOn('chartCategoriasPage', 'donutLegendPage', 'donutTotalPage');
  }, 30);
}

// ── PÁGINA: MESEROS (detalle) ─────────────────────────────────
function renderMeserosPage() {
  const el = document.getElementById('page-meseros');
  el.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">${Icons.users({ size: 18, className:'card-title-icon' })}Desempeño del Turno</div></div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Mesero</th><th class="cell-right">Mesas activas</th><th class="cell-right">Ventas del día</th><th class="cell-right">Ticket promedio</th></tr></thead>
          <tbody>
            ${RestaurantData.meseros.map(m => `
              <tr>
                <td><span style="display:inline-flex;align-items:center;gap:10px">
                  <span class="mesero-avatar" style="background:${m.color};width:26px;height:26px;font-size:.65rem">${m.iniciales}</span>
                  ${m.nombre}
                </span></td>
                <td class="cell-right cell-mono">${m.mesas}</td>
                <td class="cell-right cell-mono">${fmtMoney(m.ventasDia)}</td>
                <td class="cell-right cell-mono cell-muted">${fmtMoney(m.ticket)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── PÁGINA: PLATILLOS (detalle) ───────────────────────────────
function renderPlatillosPage() {
  const el = document.getElementById('page-platillos');
  el.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">${Icons.trophy({ size: 18, className:'card-title-icon' })}Ranking de Ventas — Hoy</div></div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>#</th><th>Platillo</th><th class="cell-right">Unidades vendidas</th><th>Participación</th></tr></thead>
          <tbody>
            ${RestaurantData.topPlatillos.map((p, i) => `
              <tr>
                <td class="cell-mono cell-muted">${i+1}</td>
                <td>${p.nombre}</td>
                <td class="cell-right cell-mono">${p.vendidos}</td>
                <td style="width:200px">
                  <div class="platillo-bar-wrap" style="margin-top:0">
                    <div class="platillo-bar" style="width:${p.pctBar}%"></div>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── PÁGINA: RESERVACIONES ─────────────────────────────────────
function renderReservacionesPage() {
  const el = document.getElementById('page-reservaciones');
  const statusMap = {
    confirmada: { cls:'success', txt:'Confirmada' },
    pendiente:  { cls:'warning', txt:'Pendiente'  },
    cancelada:  { cls:'danger',  txt:'Cancelada'  },
  };

  el.innerHTML = `
    <div class="page-toolbar">
      <div class="page-toolbar-left">
        <input class="input" type="date" style="width:160px">
      </div>
      <div class="page-toolbar-right">
        <button class="btn btn-primary">${Icons.plus({ size: 14 })} Nueva reservación</button>
      </div>
    </div>
    <div class="card">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Cliente</th><th class="cell-right">Personas</th><th>Fecha</th><th>Hora</th><th>Mesa</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            ${RestaurantData.reservaciones.map(r => `
              <tr>
                <td>${r.cliente}</td>
                <td class="cell-right cell-mono">${r.personas}</td>
                <td class="cell-muted">${r.fecha}</td>
                <td class="cell-mono">${r.hora}</td>
                <td class="cell-muted">${r.mesa ? 'Mesa ' + r.mesa : 'Por asignar'}</td>
                <td>${chipEstado(r.estado, statusMap)}</td>
                <td class="cell-actions">
                  <button class="icon-btn" title="Editar">${Icons.edit({ size: 15 })}</button>
                  <button class="icon-btn" title="Cancelar">${Icons.trash({ size: 15 })}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── PÁGINA: CONFIGURACIÓN ─────────────────────────────────────
function renderConfiguracionPage() {
  const el = document.getElementById('page-configuracion');
  el.innerHTML = `
    <div class="card">
      <div class="card-header"><div class="card-title">${Icons.cog({ size: 18, className:'card-title-icon' })}General</div></div>
      <div class="setting-row">
        <div class="setting-icon">${Icons.table({ size: 18 })}</div>
        <div class="setting-info">
          <div class="setting-name">Nombre del restaurante</div>
          <div class="setting-desc">Aparece en tickets, facturas y el encabezado del sistema</div>
        </div>
        <input class="input" value="${RestaurantData.restaurante.nombre}" style="width:220px">
      </div>
      <div class="setting-row">
        <div class="setting-icon">${Icons.calendar({ size: 18 })}</div>
        <div class="setting-info">
          <div class="setting-name">Horario de apertura</div>
          <div class="setting-desc">Hora en que inicia el turno de comida</div>
        </div>
        <input class="input" type="time" value="13:00" style="width:140px">
      </div>
      <div class="setting-row">
        <div class="setting-icon">${Icons.bell({ size: 18 })}</div>
        <div class="setting-info">
          <div class="setting-name">Notificaciones de inventario crítico</div>
          <div class="setting-desc">Recibir alerta cuando un producto llegue al mínimo</div>
        </div>
        <div class="toggle on" onclick="this.classList.toggle('on')"><div class="toggle-knob"></div></div>
      </div>
      <div class="setting-row">
        <div class="setting-icon">${Icons.money({ size: 18 })}</div>
        <div class="setting-info">
          <div class="setting-name">Meta de ventas diaria</div>
          <div class="setting-desc">Usada para calcular el avance mostrado en el resumen</div>
        </div>
        <input class="input" value="$${RestaurantData.kpis.ventasMeta.toLocaleString('es-MX')}" style="width:140px">
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">${Icons.users({ size: 18, className:'card-title-icon' })}Usuarios y Accesos</div></div>
      <div class="setting-row">
        <div class="setting-icon">${Icons.user({ size: 18 })}</div>
        <div class="setting-info">
          <div class="setting-name">Permitir a meseros cancelar comandas</div>
          <div class="setting-desc">Si está apagado, solo el gerente puede cancelar</div>
        </div>
        <div class="toggle" onclick="this.classList.toggle('on')"><div class="toggle-knob"></div></div>
      </div>
      <div class="setting-row">
        <div class="setting-icon">${Icons.sliders({ size: 18 })}</div>
        <div class="setting-info">
          <div class="setting-name">Doble autorización para descuentos</div>
          <div class="setting-desc">Requiere PIN de gerente para aplicar descuentos mayores a 10%</div>
        </div>
        <div class="toggle on" onclick="this.classList.toggle('on')"><div class="toggle-knob"></div></div>
      </div>
    </div>
  `;
}

// ── PÁGINA: INTEGRACIONES ─────────────────────────────────────
function renderIntegracionesPage() {
  const el = document.getElementById('page-integraciones');
  el.innerHTML = `
    <div class="page-toolbar">
      <div class="page-toolbar-left">
        <span class="chip success">4 conectadas</span>
        <span class="chip warning">2 pendientes</span>
      </div>
      <div class="page-toolbar-right">
        <button class="btn btn-primary">${Icons.plus({ size: 14 })} Agregar integración</button>
      </div>
    </div>
    <div class="integration-grid">
      ${RestaurantData.integraciones.map(i => `
        <div class="integration-card">
          <div class="integration-top">
            <div class="integration-logo" style="background:${i.color}">${i.nombre.charAt(0)}</div>
            ${i.estado === 'conectado'
              ? '<span class="chip success">Conectado</span>'
              : '<span class="chip warning">Pendiente</span>'}
          </div>
          <div class="integration-name">${i.nombre}</div>
          <div class="integration-desc">${i.desc}</div>
          <button class="btn ${i.estado === 'conectado' ? '' : 'btn-primary'} btn-sm" style="align-self:flex-start; margin-top:4px">
            ${i.estado === 'conectado' ? 'Configurar' : 'Conectar'}
          </button>
        </div>
      `).join('')}
    </div>
  `;
}
