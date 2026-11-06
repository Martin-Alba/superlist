import { expect, test } from "@playwright/test";

test("registro correcto: entro en la home con la sesión iniciada y veo mi email", async ({
  page,
}) => {
  // Email único por ejecución: los usuarios del e2e se quedan en la rama dev de Neon.
  const email = `ana-${Date.now()}@test.com`;

  await page.goto("/registro");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Contraseña").fill("contraseña-segura");
  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByText(`Sesión iniciada como ${email}`)).toBeVisible();
});
