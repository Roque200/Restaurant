// @ts-check
const { test, expect } = require('@playwright/test');

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of VIEWPORTS) {
  test.describe(`PeakForge landing — ${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('carga sin errores de consola y sin scroll horizontal', async ({ page }, testInfo) => {
      const consoleErrors = [];
      const pageErrors = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', (err) => pageErrors.push(err.message));

      await page.goto('/index.html', { waitUntil: 'networkidle' });

      // Hero visible
      await expect(page.locator('.hero-title')).toBeVisible();
      await expect(page.locator('h1')).toContainText('SENDERO');

      // No horizontal overflow (responsividad)
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - document.documentElement.clientWidth;
      });
      expect(overflow, `Hay ${overflow}px de scroll horizontal en ${viewport.name}`).toBeLessThanOrEqual(1);

      // Interacción: menú móvil (solo <=768px)
      if (viewport.width <= 768) {
        const toggle = page.locator('#navToggle');
        await expect(toggle).toBeVisible();
        await toggle.click();
        await expect(page.locator('#mainNav')).toHaveClass(/is-open/);
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await page.locator('#mainNav a', { hasText: 'Modelos' }).click();
        await expect(page.locator('#modelos')).toBeInViewport();
      } else {
        await page.locator('.main-nav a', { hasText: 'Modelos' }).click();
        await expect(page.locator('#modelos')).toBeInViewport();
      }

      // Interacción: scroll a rutas y CTA final, formulario de newsletter visible
      await page.locator('#comunidad').scrollIntoViewIfNeeded();
      const emailInput = page.locator('#email');
      await expect(emailInput).toBeVisible();
      await emailInput.fill('rider@example.com');
      await expect(emailInput).toHaveValue('rider@example.com');

      // Neutraliza elementos fixed antes del full-page screenshot para evitar
      // el artefacto conocido de Chromium que los duplica al capturar fuera del viewport
      await page.addStyleTag({ content: '.site-header { position: absolute !important; }' });

      // Captura de pantalla de página completa
      await page.screenshot({
        path: testInfo.outputPath(`peakforge-${viewport.name}-full.png`),
        fullPage: true,
      });

      expect(consoleErrors, `Errores de consola en ${viewport.name}: ${consoleErrors.join(', ')}`).toEqual([]);
      expect(pageErrors, `Errores JS en ${viewport.name}: ${pageErrors.join(', ')}`).toEqual([]);
    });
  });
}
