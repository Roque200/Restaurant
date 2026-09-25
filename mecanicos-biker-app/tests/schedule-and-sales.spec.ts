import { test, expect, type Page } from "@playwright/test";

async function interceptWindowOpen(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __openedUrls: string[] }).__openedUrls = [];
    window.open = (url?: string | URL) => {
      (window as unknown as { __openedUrls: string[] }).__openedUrls.push(String(url ?? ""));
      return null;
    };
  });
}

async function openedUrls(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { __openedUrls: string[] }).__openedUrls);
}

async function loginAsAdmin(page: Page) {
  await page.goto("/admin/login", { waitUntil: "networkidle" });
  await page.getByLabel("Usuario").fill("admin");
  await page.getByLabel("Contraseña").fill("biker2026");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
}

test.describe("Horario controlado por el administrador", () => {
  test("una excepción cerrada en el panel deja ese día sin cupo en el calendario público", async ({ page }) => {
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    const dateStr = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, "0")}-15`;

    await loginAsAdmin(page);
    await page.goto("/admin/horarios", { waitUntil: "networkidle" });
    await page.getByLabel("Fecha").fill(dateStr);
    await page.getByRole("button", { name: "Agregar excepción" }).click();
    await expect(page.getByText(dateStr)).toBeVisible();
    await expect(page.getByText("Cerrado todo el día")).toBeVisible();

    await page.goto("/", { waitUntil: "networkidle" });
    await page.locator("#contacto").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Mes siguiente" }).click();

    const day15 = page.locator("#contacto .grid.grid-cols-7 button").filter({ hasText: /^15$/ });
    await expect(day15).toBeDisabled();
  });
});

test.describe("Venta de mostrador", () => {
  test("una venta registrada en el panel queda pagada y aparece en pedidos", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/ventas", { waitUntil: "networkidle" });

    await page.getByLabel("Cliente").fill("Venta Mostrador Test");
    await page.getByLabel("Teléfono").fill("5511122233");
    await page.getByLabel("Producto del catálogo").selectOption("PR-01"); // Casco MTB ProShield
    await page.getByRole("button", { name: "Agregar", exact: true }).click();
    await page.getByRole("button", { name: "Registrar venta" }).click();

    await expect(page.getByText(/Venta P-\d+ registrada por/)).toBeVisible();

    await page.goto("/admin/pedidos", { waitUntil: "networkidle" });
    const saleRow = page.locator("button").filter({ hasText: "Venta Mostrador Test" });
    await expect(saleRow).toContainText("Mostrador");
    await expect(saleRow).toContainText("Pagado");
    await saleRow.click();
    await expect(page.getByText("1 × Casco MTB ProShield")).toBeVisible();
  });
});

test.describe("Cotizador de piezas", () => {
  test("arma un total y lo envía por WhatsApp sin guardarlo", async ({ page }) => {
    await interceptWindowOpen(page);
    await loginAsAdmin(page);
    await page.goto("/admin/cotizador", { waitUntil: "networkidle" });

    await page.getByLabel("Pieza del catálogo").selectOption("PR-01"); // Casco MTB ProShield
    await page.getByRole("button", { name: "Agregar", exact: true }).click();
    await expect(page.getByText("Total: $890 MXN")).toBeVisible();

    await page.getByRole("button", { name: "Enviar cotización por WhatsApp" }).click();
    const urls = await openedUrls(page);
    expect(urls.some((u) => u.includes("wa.me"))).toBe(true);
  });
});

test.describe("Exportación del corte", () => {
  test("el dashboard genera un CSV descargable para el rango elegido", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/dashboard", { waitUntil: "networkidle" });

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exportar CSV" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^corte-mecanicos-biker_.*\.csv$/);
  });
});
