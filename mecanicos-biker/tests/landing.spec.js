// @ts-check
const { test, expect } = require('@playwright/test');

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of VIEWPORTS) {
  test.describe(`Mecánicos Biker — ${viewport.name} (${viewport.width}px)`, () => {
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
      await expect(page.locator('h1')).toContainText('MANOS');

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
        await page.locator('#mainNav a', { hasText: 'Servicios' }).click();
        await expect(page.locator('#servicios')).toBeInViewport();
      } else {
        await page.locator('.main-nav a', { hasText: 'Servicios' }).click();
        await expect(page.locator('#servicios')).toBeInViewport();
      }

      // Interacción: acordeón de preguntas frecuentes
      const firstFaq = page.locator('.faq-item').first();
      const faqButton = firstFaq.locator('.faq-question');
      await faqButton.scrollIntoViewIfNeeded();
      await faqButton.click();
      await expect(firstFaq).toHaveClass(/is-open/);
      await expect(faqButton).toHaveAttribute('aria-expanded', 'true');
      await expect(firstFaq.locator('.faq-answer p')).toBeVisible();

      // Interacción: formulario de contacto
      await page.locator('#contacto').scrollIntoViewIfNeeded();
      await page.locator('#nombre').fill('Rider de prueba');
      await page.locator('#telefono').fill('3312345678');
      await page.locator('#servicio').selectOption('suspension');
      await expect(page.locator('#nombre')).toHaveValue('Rider de prueba');

      // Neutraliza elementos fixed antes del full-page screenshot para evitar
      // el artefacto conocido de Chromium que los duplica al capturar fuera del viewport
      await page.addStyleTag({ content: '.site-header { position: absolute !important; }' });

      await page.screenshot({
        path: testInfo.outputPath(`mecanicos-biker-${viewport.name}-full.png`),
        fullPage: true,
      });

      expect(consoleErrors, `Errores de consola en ${viewport.name}: ${consoleErrors.join(', ')}`).toEqual([]);
      expect(pageErrors, `Errores JS en ${viewport.name}: ${pageErrors.join(', ')}`).toEqual([]);
    });
  });
}
