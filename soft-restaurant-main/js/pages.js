/**
 * LA HACIENDA · GERENCIA DIGITAL
 * pages.js — Router y renderizado de páginas secundarias
 * Páginas: delivery, reservaciones, ventas, meseros, platillos, configuración, integraciones
 * Nota: Mesas, Comandas, Inventario y Facturación son gestionados por Soft Restaurant
 */

const PAGE_TITLES = {
  resumen:       { title: 'Resumen del Día',       subtitle: null },
  delivery:      { title: 'Delivery',               subtitle: 'Pedidos activos en plataformas externas' },
  reservaciones: { title: 'Reservaciones',           subtitle: 'Próximas reservas confirmadas y pendientes' },
  ventas:        { title: 'Reporte de Ventas',       subtitle: 'Comparativo semanal y desglose por categoría' },
  meseros:       { title: 'Meseros',                 subtitle: 'Desempeño del turno actual' },
  platillos:     { title: 'Platillos',               subtitle: 'Ranking de ventas por producto' },
  configuracion: { title: 'Configuración',            subtitle: 'Preferencias generales del sistema' },
  integraciones: { title: 'Integraciones',            subtitle: 'Plataformas externas conectadas' },
};

// ── NAVEGACIÓN ────────────────────────────────────────────────
function navigateTo(view) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${view}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-view="${view}"]`);
  if (navItem) navItem.classList.add('active');

  const meta = PAGE_TITLES[view] || { title: 'La Hacienda · Gerencia Digital', subtitle: null };
  document.getElementById('headerTitle').textContent = meta.title;
  const subEl = document.getElementById('headerSubtitle');
  if (meta.subtitle) {
    subEl.textContent = meta.subtitle;
  } else {
    subEl.textContent = new Date().toLocaleDateString('es-MX', {
      weekday:'long', day:'numeric', month:'long', year:'numeric'
    });
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

const renderedPages = new Set();
function renderPage(view) {
  if (renderedPages.has(view)) return;
  renderedPages.add(view);

  switch (view) {
    case 'delivery':      renderDeliveryPage(); break;
    case 'reservaciones': renderReservacionesPage(); break;
    case 'ventas':        renderVentasPage(); break;
    case 'meseros':       renderMeserosPage(); break;
    case 'platillos':     renderPlatillosPage(); break;
    case 'configuracion': renderConfiguracionPage(); break;
    case 'integraciones': renderIntegracionesPage(); break;
  }
}

// ── HELPERS ───────────────────────────────────────────────────
const fmtMoney = n => `$${n.toLocaleString('es-MX')}`;
const chipEstado = (estado, map) => {
  const m = map[estado] || { cls: 'info', txt: estado };
  return `<span class="chip ${m.cls}">${m.txt}</span>`;
};

// ── PÁGINA: DELIVERY ──────────────────────────────────────────
function renderDeliveryPage() {
  const el = document.getElementById('page-delivery');
  const statusMap = {
    'en-camino': { cls:'info',    txt:'En camino'  },
    preparando:  { cls:'warning', txt:'Preparando' },
    entregado:   { cls:'success', txt:'Entregado'  },
  };
  const platformColor = { 'Uber Eats':'#06c167', 'Rappi':'#ff441f', 'DiDi Food':'#ff7a00' };
  const activos = RestaurantData.deliveryPedidos.filter(p => p.estado !== 'entregado').length;
  const totalVentas = RestaurantData.deliveryPedidos.reduce((s,p) => s + p.importe, 0);

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
        <div class="stat-tile-info"><div class="stat-tile-val">${fmtMoney(totalVentas)}</div><div class="stat-tile-lbl">Ventas delivery hoy</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-info)">${Icons.chartLine({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">12%</div><div class="stat-tile-lbl">Del total de ventas</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">${Icons.truck({ size: 18, className:'card-title-icon' })} Pedidos de Plataformas</div>
        <span class="card-action">Ver historial</span>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>ID</th><th>Plataforma</th><th>Cliente</th>
            <th class="cell-right">Items</th><th>Estado</th><th>Tiempo</th>
            <th class="cell-right">Importe</th>
          </tr></thead>
          <tbody>
            ${RestaurantData.deliveryPedidos.map(p => `
              <tr>
                <td class="cell-mono cell-muted">${p.id}</td>
                <td>
                  <span style="display:inline-flex;align-items:center;gap:7px">
                    <span style="width:9px;height:9px;border-radius:50%;background:${platformColor[p.plataforma]};box-shadow:0 0 8px ${platformColor[p.plataforma]}"></span>
                    ${p.plataforma}
                  </span>
                </td>
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

// ── PÁGINA: RESERVACIONES ─────────────────────────────────────
function renderReservacionesPage() {
  const el = document.getElementById('page-reservaciones');
  const statusMap = {
    confirmada: { cls:'success', txt:'Confirmada' },
    pendiente:  { cls:'warning', txt:'Pendiente'  },
    cancelada:  { cls:'danger',  txt:'Cancelada'  },
  };
  const confirmadas = RestaurantData.reservaciones.filter(r => r.estado === 'confirmada').length;
  const pendientes  = RestaurantData.reservaciones.filter(r => r.estado === 'pendiente').length;
  const totalPersonas = RestaurantData.reservaciones
    .filter(r => r.estado !== 'cancelada')
    .reduce((s,r) => s + r.personas, 0);

  el.innerHTML = `
    <div class="stat-tile-grid">
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-success)">${Icons.calendar({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${confirmadas}</div><div class="stat-tile-lbl">Confirmadas</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-warning)">${Icons.filter({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${pendientes}</div><div class="stat-tile-lbl">Pendientes</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-accent)">${Icons.users({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${totalPersonas}</div><div class="stat-tile-lbl">Comensales esperados</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-info)">${Icons.chartLine({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${RestaurantData.reservaciones.length}</div><div class="stat-tile-lbl">Total reservaciones</div></div>
      </div>
    </div>

    <div class="page-toolbar">
      <div class="page-toolbar-left">
        <input class="input" type="date" style="width:160px">
        <select class="select"><option>Todos los estados</option><option>Confirmada</option><option>Pendiente</option><option>Cancelada</option></select>
      </div>
      <div class="page-toolbar-right">
        <button class="btn btn-primary">${Icons.plus({ size: 14 })} Nueva reservación</button>
      </div>
    </div>

    <div class="card">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>Cliente</th><th class="cell-right">Personas</th>
            <th>Fecha</th><th>Hora</th><th>Mesa</th><th>Estado</th><th></th>
          </tr></thead>
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
                  <button class="icon-btn" title="Editar">${Icons.edit({ size: 14 })}</button>
                  <button class="icon-btn" title="Cancelar">${Icons.trash({ size: 14 })}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ── PÁGINA: VENTAS ────────────────────────────────────────────
function renderVentasPage() {
  const el = document.getElementById('page-ventas');
  el.innerHTML = `
    <div class="content-grid-2">
      <div class="card">
        <div class="card-header">
          <div class="card-title">${Icons.chartLine({ size: 18, className:'card-title-icon' })} Ventas — Esta Semana vs Anterior</div>
        </div>
        <div class="chart-wrapper" style="height:260px; padding-top:16px">
          <canvas id="chartVentasSemanaPage"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">${Icons.dashboard({ size: 18, className:'card-title-icon' })} Por Categoría</div>
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
      <div class="card-header">
        <div class="card-title">${Icons.chartLine({ size: 18, className:'card-title-icon' })} Resumen Diario — Últimos 7 días</div>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>Día</th><th class="cell-right">Ventas</th>
            <th class="cell-right">Semana anterior</th><th class="cell-right">Variación</th>
          </tr></thead>
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
                  <td class="cell-right">
                    <span class="kpi-delta ${up ? 'up':'down'}">${up ? '+' : ''}${delta}%</span>
                  </td>
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

// ── PÁGINA: MESEROS ───────────────────────────────────────────
function renderMeserosPage() {
  const el = document.getElementById('page-meseros');
  const total = RestaurantData.meseros.reduce((s,m) => s + m.ventasDia, 0);

  el.innerHTML = `
    <div class="stat-tile-grid">
      <div class="stat-tile">
        <div class="stat-tile-icon">${Icons.users({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${RestaurantData.meseros.length}</div><div class="stat-tile-lbl">Meseros en turno</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-success)">${Icons.money({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${fmtMoney(total)}</div><div class="stat-tile-lbl">Ventas del equipo</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-warning)">${Icons.receipt({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${fmtMoney(Math.round(total / RestaurantData.meseros.length))}</div><div class="stat-tile-lbl">Ticket promedio equipo</div></div>
      </div>
      <div class="stat-tile">
        <div class="stat-tile-icon" style="color:var(--color-info)">${Icons.seat({ size: 20 })}</div>
        <div class="stat-tile-info"><div class="stat-tile-val">${RestaurantData.meseros.reduce((s,m)=>s+m.mesas,0)}</div><div class="stat-tile-lbl">Mesas activas</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">${Icons.users({ size: 18, className:'card-title-icon' })} Desempeño del Turno</div>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>Mesero</th>
            <th class="cell-right">Mesas activas</th>
            <th class="cell-right">Ventas del día</th>
            <th class="cell-right">Ticket promedio</th>
          </tr></thead>
          <tbody>
            ${RestaurantData.meseros.map(m => `
              <tr>
                <td>
                  <span style="display:inline-flex;align-items:center;gap:10px">
                    <span class="mesero-avatar" style="background:${m.color};width:28px;height:28px;font-size:.65rem">${m.iniciales}</span>
                    ${m.nombre}
                  </span>
                </td>
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

// ── PÁGINA: PLATILLOS ─────────────────────────────────────────
function renderPlatillosPage() {
  const el = document.getElementById('page-platillos');
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title">${Icons.trophy({ size: 18, className:'card-title-icon' })} Ranking de Ventas — Hoy</div>
      </div>
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>#</th><th>Platillo</th>
            <th class="cell-right">Unidades vendidas</th><th>Participación</th>
          </tr></thead>
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

// ── PÁGINA: CONFIGURACIÓN ─────────────────────────────────────
function renderConfiguracionPage() {
  const el = document.getElementById('page-configuracion');
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title">${Icons.cog({ size: 18, className:'card-title-icon' })} General</div>
      </div>
      <div class="setting-row">
        <div class="setting-icon">${Icons.table({ size: 18 })}</div>
        <div class="setting-info">
          <div class="setting-name">Nombre del restaurante</div>
          <div class="setting-desc">Aparece en el encabezado del sistema y en los reportes</div>
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
          <div class="setting-name">Notificaciones del sistema</div>
          <div class="setting-desc">Recibir alertas de delivery, reservaciones y metas</div>
        </div>
        <div class="toggle on" onclick="this.classList.toggle('on')"><div class="toggle-knob"></div></div>
      </div>
      <div class="setting-row">
        <div class="setting-icon">${Icons.money({ size: 18 })}</div>
        <div class="setting-info">
          <div class="setting-name">Meta de ventas diaria</div>
          <div class="setting-desc">Usada para calcular el avance en el resumen ejecutivo</div>
        </div>
        <input class="input" value="$${RestaurantData.kpis.ventasMeta.toLocaleString('es-MX')}" style="width:140px">
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">${Icons.truck({ size: 18, className:'card-title-icon' })} Delivery</div>
      </div>
      <div class="setting-row">
        <div class="setting-icon">${Icons.link({ size: 18 })}</div>
        <div class="setting-info">
          <div class="setting-name">Sincronización automática de pedidos</div>
          <div class="setting-desc">Importar pedidos de Uber Eats, Rappi y DiDi en tiempo real</div>
        </div>
        <div class="toggle on" onclick="this.classList.toggle('on')"><div class="toggle-knob"></div></div>
      </div>
      <div class="setting-row">
        <div class="setting-icon">${Icons.bell({ size: 18 })}</div>
        <div class="setting-info">
          <div class="setting-name">Alertas de pedidos retrasados</div>
          <div class="setting-desc">Notificar cuando un pedido lleve más de 30 min en preparación</div>
        </div>
        <div class="toggle on" onclick="this.classList.toggle('on')"><div class="toggle-knob"></div></div>
      </div>
    </div>
  `;
}

// ── PÁGINA: INTEGRACIONES ─────────────────────────────────────
function renderIntegracionesPage() {
  const el = document.getElementById('page-integraciones');
  const conectadas = RestaurantData.integraciones.filter(i => i.estado === 'conectado').length;
  const pendientes = RestaurantData.integraciones.filter(i => i.estado === 'desconectado').length;

  el.innerHTML = `
    <div class="page-toolbar">
      <div class="page-toolbar-left">
        <span class="chip success">${conectadas} conectadas</span>
        <span class="chip warning">${pendientes} pendientes</span>
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
