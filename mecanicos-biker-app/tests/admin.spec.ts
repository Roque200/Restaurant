import { test, expect } from "@playwright/test";

test.describe("Panel administrativo", () => {
  test("bloquea el acceso directo y permite iniciar sesión", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    // Acceso directo sin sesión debe rebotar a /admin/login
    await page.goto("/admin/dashboard", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/admin\/login/);

    // Credenciales incorrectas muestran error
    await page.getByLabel("Usuario").fill("admin");
    await page.getByLabel("Contraseña").fill("incorrecta");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();
    await expect(page.getByText("Usuario o contraseña incorrectos.")).toBeVisible();

    // Credenciales correctas entran al dashboard
    await page.getByLabel("Contraseña").fill("biker2026");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.getByRole("heading", { name: "Resumen" })).toBeVisible();

    expect(consoleErrors, `Errores de consola: ${consoleErrors.join(", ")}`).toEqual([]);
  });

  test("navega entre secciones y valida las interacciones clave", async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/admin/login", { waitUntil: "networkidle" });
    await page.getByLabel("Usuario").fill("admin");
    await page.getByLabel("Contraseña").fill("biker2026");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `Hay ${overflow}px de scroll horizontal`).toBeLessThanOrEqual(1);

    // Citas: cambiar el estado de la primera fila
    await page.getByRole("link", { name: "Citas" }).click();
    await expect(page).toHaveURL(/\/admin\/citas/);
    const firstStatusSelect = page.locator("table tbody tr").first().locator("select");
    await firstStatusSelect.selectOption("completada");
    await expect(page.locator("table tbody tr").first().locator("span")).toHaveText("Completada");

    // Filtro por estado
    await page.getByRole("button", { name: "Cancelada" }).click();
    await expect(page.locator("table tbody tr")).toHaveCount(1);

    // Pedidos: expandir uno y cambiar estado
    await page.getByRole("link", { name: "Pedidos" }).click();
    await expect(page).toHaveURL(/\/admin\/pedidos/);
    const firstOrderToggle = page.locator("button").filter({ hasText: "P-3301" });
    await firstOrderToggle.click();
    await expect(page.getByText("1 × Casco MTB ProShield")).toBeVisible();

    // Productos: crear uno nuevo
    await page.getByRole("link", { name: "Productos" }).click();
    await expect(page).toHaveURL(/\/admin\/productos/);
    await page.getByRole("button", { name: "Nuevo producto" }).click();
    await page.getByLabel("Nombre").fill("Cámara de prueba");
    await page.getByLabel("Precio (MXN)").fill("199");
    await page.getByLabel("Stock", { exact: true }).fill("10");
    await page.getByLabel(/Alertar cuando/).fill("3");
    await page.getByRole("button", { name: "Agregar" }).click();
    await expect(page.getByText("Cámara de prueba")).toBeVisible();

    // Clientes: buscar
    await page.getByRole("link", { name: "Clientes" }).click();
    await expect(page).toHaveURL(/\/admin\/clientes/);
    await page.getByPlaceholder("Buscar por nombre o teléfono…").fill("Roberto");
    await expect(page.locator("table tbody tr")).toHaveCount(1);
    await expect(page.getByText("Roberto Salas")).toBeVisible();

    // Cerrar sesión regresa al login y vuelve a bloquear el acceso
    await page.getByRole("button", { name: "Cerrar sesión" }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/login/);

    expect(consoleErrors, `Errores de consola: ${consoleErrors.join(", ")}`).toEqual([]);
    expect(pageErrors, `Errores JS: ${pageErrors.join(", ")}`).toEqual([]);
  });

  test("responsive: el menú lateral funciona en mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/admin/login", { waitUntil: "networkidle" });
    await page.getByLabel("Usuario").fill("admin");
    await page.getByLabel("Contraseña").fill("biker2026");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);

    await page.getByLabel("Abrir menú").click();
    await page.getByRole("link", { name: "Citas" }).click();
    await expect(page).toHaveURL(/\/admin\/citas/);
  });
});
