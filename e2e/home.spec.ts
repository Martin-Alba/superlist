import { expect, test } from "@playwright/test";

test("la home muestra el nombre de la app", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Superlist",
  );
});
