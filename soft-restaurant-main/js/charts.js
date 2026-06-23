/**
 * SOFT RESTAURANT DASHBOARD
 * charts.js — Lógica de renderizado de gráficas
 * Depende de: Chart.js (CDN), data.js
 */

// ── CONFIGURACIÓN GLOBAL DE CHART.JS ────────────────────────
Chart.defaults.color = '#8892b0';
Chart.defaults.borderColor = '#2a2f45';
Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
Chart.defaults.plugins.legend.display = false;
Chart.defaults.plugins.tooltip.backgroundColor = '#1e2335';
Chart.defaults.plugins.tooltip.borderColor = '#2a2f45';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.titleColor = '#f0f2f8';
Chart.defaults.plugins.tooltip.bodyColor = '#8892b0';

const ACCENT   = '#f97316';
const SUCCESS  = '#22c55e';
const INFO     = '#38bdf8';
const WARNING  = '#eab308';
const PURPLE   = '#a78bfa';
const MUTED    = '#4f5a7a';

// Referencia a instancias para actualización
const charts = {};

// ── GRAFICA DE VENTAS POR HORA ───────────────────────────────
function initVentasHoraChart() {
  const ctx = document.getElementById('chartVentasHora');
  if (!ctx) return;
  const d = RestaurantData.ventasPorHora;

  charts.ventasHora = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'Hoy',
          data: d.hoy,
          backgroundColor: d.hoy.map((v, i) =>
            i === d.hoy.length - 1
              ? 'rgba(249,115,22,.25)'
              : `rgba(249,115,22,${0.4 + (v / Math.max(...d.hoy)) * 0.5})`
          ),
          borderColor: d.hoy.map((v, i) =>
            i === d.hoy.length - 1 ? 'rgba(249,115,22,.4)' : ACCENT
          ),
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Ayer',
          data: d.ayer,
          backgroundColor: 'rgba(136,146,176,.08)',
          borderColor: 'rgba(136,146,176,.3)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          type: 'bar',
        },
        {
          label: 'Meta',
          data: d.meta,
          type: 'line',
          borderColor: 'rgba(234,179,8,.5)',
          borderWidth: 1.5,
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false,
          tension: 0.4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('es-MX')}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11, family: "'JetBrains Mono', monospace" } }
        },
        y: {
          grid: { color: 'rgba(42,47,69,.5)', lineWidth: 1 },
          ticks: {
            font: { size: 11, family: "'JetBrains Mono', monospace" },
            callback: v => `$${(v/1000).toFixed(0)}k`
          },
          border: { display: false }
        }
      }
    }
  });
}

// ── GRAFICA DE VENTAS SEMANAL ────────────────────────────────
function initVentasSemanaChart() {
  const ctx = document.getElementById('chartVentasSemana');
  if (!ctx) return;
  const d = RestaurantData.ventasSemana;

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(249,115,22,.3)');
  gradient.addColorStop(1, 'rgba(249,115,22,0)');

  charts.ventasSemana = new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'Esta semana',
          data: d.semanaActual,
          borderColor: ACCENT,
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: ACCENT,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBorderColor: '#0f1117',
          pointBorderWidth: 2,
        },
        {
          label: 'Semana anterior',
          data: d.semanaAnterior,
          borderColor: 'rgba(136,146,176,.4)',
          borderWidth: 1.5,
          borderDash: [4,4],
          fill: false,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('es-MX')}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(42,47,69,.5)' },
          ticks: {
            font: { size: 11, family: "'JetBrains Mono', monospace" },
            callback: v => `$${(v/1000).toFixed(0)}k`
          },
          border: { display: false }
        }
      }
    }
  });
}

// ── DONUT DE CATEGORÍAS ──────────────────────────────────────
function initCategoryDonut() {
  const ctx = document.getElementById('chartCategorias');
  if (!ctx) return;
  const d = RestaurantData.categorias;

  charts.categorias = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: d.map(c => c.nombre),
      datasets: [{
        data: d.map(c => c.valor),
        backgroundColor: d.map(c => c.color),
        borderColor: '#181c27',
        borderWidth: 3,
        hoverOffset: 8,
        hoverBorderColor: '#1e2335',
      }]
    },
    options: {
      cutout: '72%',
      responsive: false,
      animation: { animateScale: true },
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: $${ctx.parsed.toLocaleString('es-MX')}`
          }
        }
      }
    }
  });
}

// ── MINI SPARKLINES SVG ──────────────────────────────────────
function renderSparkline(containerId, data, color = '#f97316') {
  const el = document.getElementById(containerId);
  if (!el) return;

  const W = el.clientWidth || 160;
  const H = 32;
  const padding = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (W - padding * 2);
    const y = H - padding - ((v - min) / range) * (H - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `M ${points[0]} L ${points.join(' L ')} L ${W - padding},${H} L ${padding},${H} Z`;

  el.innerHTML = `
    <svg class="sparkline-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg_${containerId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity=".4"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path class="sparkline-area" d="${areaD}" fill="url(#sg_${containerId})"/>
      <path class="sparkline-path" d="${pathD}" stroke="${color}"/>
      <circle cx="${points[points.length-1].split(',')[0]}" cy="${points[points.length-1].split(',')[1]}"
              r="2.5" fill="${color}" stroke="#181c27" stroke-width="1.5"/>
    </svg>`;
}

// ── GAUGE SVG ────────────────────────────────────────────────
function renderGauge(svgId, value, max, color = '#f97316') {
  const svg = document.getElementById(svgId);
  if (!svg) return;

  const pct = Math.min(value / max, 1);
  const r = 70;
  const cx = 90; const cy = 90;
  const startAngle = -180;
  const endAngle = 0;
  const totalAngle = endAngle - startAngle;
  const filled = totalAngle * pct;

  function polarToXY(angleDeg, radius) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  const s = polarToXY(startAngle, r);
  const eTrack = polarToXY(endAngle, r);
  const eArc = polarToXY(startAngle + filled, r);

  svg.innerHTML = `
    <!-- Track -->
    <path d="M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${eTrack.x} ${eTrack.y}"
          fill="none" stroke="#2a2f45" stroke-width="10" stroke-linecap="round"/>
    <!-- Fill -->
    <path d="M ${s.x} ${s.y} A ${r} ${r} 0 ${filled > 180 ? 1 : 0} 1 ${eArc.x} ${eArc.y}"
          fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round"
          style="filter: drop-shadow(0 0 6px ${color}55)"/>
    <!-- Dot -->
    <circle cx="${eArc.x}" cy="${eArc.y}" r="5" fill="${color}" stroke="#181c27" stroke-width="2"/>
  `;
}

// ── HEATMAP DE OCUPACIÓN ─────────────────────────────────────
function renderHeatmap() {
  const container = document.getElementById('heatmapGrid');
  if (!container) return;

  const d = RestaurantData.heatmap;
  let html = '';

  // Fila de encabezados de horas
  html += '<div class="heatmap-label"></div>';
  d.horas.forEach(h => {
    html += `<div class="heatmap-col-label">${h}</div>`;
  });

  // Filas de datos
  d.dias.forEach((dia, di) => {
    html += `<div class="heatmap-label">${dia}</div>`;
    d.horas.forEach((_, hi) => {
      const val = d.datos[di][hi];
      const venta = val > 0 ? `title="${val * 12} comandas aprox."` : '';
      html += `<div class="heatmap-cell heat-${val}" ${venta}></div>`;
    });
  });

  container.innerHTML = html;
}

// ── INICIALIZAR TODO ─────────────────────────────────────────
function initAllCharts() {
  initVentasHoraChart();
  initVentasSemanaChart();
  initCategoryDonut();
  renderHeatmap();

  // Sparklines
  const sp = RestaurantData.sparklines;
  setTimeout(() => {
    renderSparkline('sparkVentas',   sp.ventas,   '#f97316');
    renderSparkline('sparkTicket',   sp.ticket,   '#22c55e');
    renderSparkline('sparkClientes', sp.clientes, '#38bdf8');
    renderSparkline('sparkOcupacion',sp.ocupacion,'#eab308');
  }, 100);

  // Gauge de ventas vs meta
  const kpi = RestaurantData.kpis;
  renderGauge('gaugeVentas', kpi.ventasHoy, kpi.ventasMeta, '#f97316');
}

// ── VERSIONES REUTILIZABLES (para otras páginas) ─────────────
function initVentasSemanaChartOn(canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || charts[canvasId]) return;
  const d = RestaurantData.ventasSemana;

  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 220);
  gradient.addColorStop(0, 'rgba(249,115,22,.3)');
  gradient.addColorStop(1, 'rgba(249,115,22,0)');

  charts[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: d.labels,
      datasets: [
        { label: 'Esta semana', data: d.semanaActual, borderColor: ACCENT, borderWidth: 2.5,
          backgroundColor: gradient, fill: true, tension: 0.4,
          pointBackgroundColor: ACCENT, pointRadius: 4, pointHoverRadius: 7,
          pointBorderColor: '#0f1117', pointBorderWidth: 2 },
        { label: 'Semana anterior', data: d.semanaAnterior, borderColor: 'rgba(136,146,176,.4)',
          borderWidth: 1.5, borderDash: [4,4], fill: false, tension: 0.4,
          pointRadius: 2, pointHoverRadius: 5 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString('es-MX')}` } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { grid: { color: 'rgba(42,47,69,.5)' }, ticks: { font: { size: 11, family: "'JetBrains Mono', monospace" }, callback: v => `$${(v/1000).toFixed(0)}k` }, border: { display: false } }
      }
    }
  });
}

function initCategoryDonutOn(canvasId, legendId, totalId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx || charts[canvasId]) return;
  const d = RestaurantData.categorias;

  charts[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: d.map(c => c.nombre),
      datasets: [{ data: d.map(c => c.valor), backgroundColor: d.map(c => c.color),
        borderColor: '#181c27', borderWidth: 3, hoverOffset: 8, hoverBorderColor: '#1e2335' }]
    },
    options: {
      cutout: '72%', responsive: false, animation: { animateScale: true },
      plugins: { tooltip: { callbacks: { label: ctx => ` ${ctx.label}: $${ctx.parsed.toLocaleString('es-MX')}` } } }
    }
  });

  const total = d.reduce((s, c) => s + c.valor, 0);
  const legendEl = document.getElementById(legendId);
  if (legendEl) {
    legendEl.innerHTML = d.map(c => `
      <div class="donut-legend-item">
        <div class="donut-legend-dot" style="background:${c.color}"></div>
        <span class="donut-legend-label">${c.nombre}</span>
        <span class="donut-legend-val">$${c.valor.toLocaleString('es-MX')}</span>
        <span class="donut-legend-pct">${((c.valor/total)*100).toFixed(0)}%</span>
      </div>`).join('');
  }
  const totalEl = document.getElementById(totalId);
  if (totalEl) totalEl.textContent = `$${(total/1000).toFixed(1)}k`;
}

// ── SIMULACIÓN DE DATOS EN VIVO ──────────────────────────────
function startLiveSimulation() {
  setInterval(() => {
    const variation = () => (Math.random() - 0.5) * 200;

    if (charts.ventasHora) {
      const d = charts.ventasHora.data.datasets[0].data;
      const lastIdx = d.length - 1;
      d[lastIdx] = Math.max(0, d[lastIdx] + variation());
      charts.ventasHora.update('none');
    }

    // Actualizar KPI de ventas en vivo
    RestaurantData.kpis.ventasHoy += Math.floor(Math.random() * 80);
    const el = document.getElementById('kpiVentasHoy');
    if (el) {
      const v = RestaurantData.kpis.ventasHoy;
      el.textContent = `$${v.toLocaleString('es-MX')}`;
    }
  }, 5000);
}
