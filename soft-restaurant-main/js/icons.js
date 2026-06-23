/**
 * SOFT RESTAURANT DASHBOARD
 * icons.js — Librería de íconos SVG inline (reemplaza emojis)
 * Cada ícono es una función que retorna un string SVG listo para usar.
 * Uso: Icons.dashboard(), Icons.table({ size: 20 })
 */

const Icons = (() => {
  const base = (paths, viewBox = '0 0 24 24') => (opts = {}) => {
    const { size = 18, stroke = 'currentColor', strokeWidth = 1.8, className = '' } = opts;
    return `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="${viewBox}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
  };

  return {
    // Navegación principal
    dashboard: base(`<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>`),

    table: base(`<path d="M3 9h18M3 15h18M9 3v18M15 3v18"/><rect x="3" y="3" width="18" height="18" rx="2"/>`),

    clipboard: base(`<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 3v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V3"/><path d="M9 11h6M9 15h6"/>`),

    box: base(`<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>`),

    invoice: base(`<path d="M6 2h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h6M9 9h2"/>`),

    truck: base(`<rect x="1" y="6" width="13" height="10" rx="1"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="5" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>`),

    chartLine: base(`<path d="M3 17l5-6 4 3 6-8"/><path d="M3 21h18"/>`),

    users: base(`<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2c2.2.3 4 2.3 4.5 5.8"/>`),

    trophy: base(`<path d="M8 4h8v4a4 4 0 0 1-8 0V4z"/><path d="M8 5H5a2 2 0 0 0 0 4h1.3M16 5h3a2 2 0 0 1 0 4h-1.3"/><path d="M10 13v2M14 13v2"/><path d="M7 21h10M9 21v-2.5a3 3 0 0 1 6 0V21"/>`),

    calendar: base(`<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><circle cx="8" cy="14" r="1"/><circle cx="12" cy="14" r="1"/><circle cx="16" cy="14" r="1"/>`),

    settings: base(`<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V20a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.04H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H10a1.7 1.7 0 0 0 1.04-1.56V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V10a1.7 1.7 0 0 0 1.56 1.04H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.56 1.04z"/>`),

    plug: base(`<path d="M9 2v6M15 2v6"/><path d="M5 8h14v3a7 7 0 0 1-14 0V8z"/><path d="M12 19v3"/>`),

    // Header
    search: base(`<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>`),
    bell: base(`<path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z"/><path d="M10 19a2 2 0 0 0 4 0"/>`),
    user: base(`<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5"/>`),
    chevronDown: base(`<path d="M6 9l6 6 6-6"/>`),
    chevronRight: base(`<path d="M9 6l6 6-6 6"/>`),
    plus: base(`<path d="M12 5v14M5 12h14"/>`),
    download: base(`<path d="M12 3v12M7 11l5 5 5-5"/><path d="M5 21h14"/>`),
    filter: base(`<path d="M4 5h16M7 12h10M10 19h4"/>`),
    arrowUp: base(`<path d="M12 19V5M6 11l6-6 6 6"/>`),
    arrowDown: base(`<path d="M12 5v14M6 13l6 6 6-6"/>`),
    money: base(`<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 10v.01M18 14v.01"/>`),
    receipt: base(`<path d="M6 2h12v18l-3-2-3 2-3-2-3 2V2z"/><path d="M9 7h6M9 11h6M9 15h3"/>`),
    seat: base(`<path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><path d="M3 10h18l-1.5 9h-15z"/><path d="M3 10v3M21 10v3"/>`),
    grid: base(`<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>`),
    flame: base(`<path d="M12 2c2 3-1 4-1 7a4 4 0 1 0 8 0c0-1-.4-2-1-3 1 5-2 5-2 8a4 4 0 1 1-8 0c0-3 2-4 2-7 0-2-1-3-1-5 1 0 2 0 3 0z"/>`),
    cog: base(`<circle cx="12" cy="12" r="3"/><path d="M12 1v3M12 20v3M4.2 4.2l2.2 2.2M17.6 17.6l2.2 2.2M1 12h3M20 12h3M4.2 19.8l2.2-2.2M17.6 6.4l2.2-2.2"/>`),
    print: base(`<rect x="6" y="9" width="12" height="7" rx="1"/><path d="M6 9V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5"/><path d="M8 16v4h8v-4"/>`),
    edit: base(`<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>`),
    trash: base(`<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>`),
    check: base(`<path d="M20 6L9 17l-5-5"/>`),
    x: base(`<path d="M18 6L6 18M6 6l12 12"/>`),
    star: base(`<path d="M12 2l3.1 6.3 7 1-5 5 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-5 7-1z"/>`),
    link: base(`<path d="M9 17H7a5 5 0 0 1 0-10h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><path d="M8 12h8"/>`),
    wrench: base(`<path d="M14.7 6.3a4 4 0 1 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2z"/>`),
    sliders: base(`<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/>`),
  };
})();
