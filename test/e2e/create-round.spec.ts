import { expect, test, type Page } from "@playwright/test";

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

test.skip(
  !email || !password,
  "Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run the create-round flow.",
);

async function signIn(page: Page) {
  await page.goto("/login?next=/rounds/new");

  const signInForm = page.locator("form").filter({
    has: page.getByRole("button", { name: "Logga in" }),
  });

  await signInForm.getByLabel("E-post").fill(email ?? "");
  await signInForm.getByLabel("Lösenord").fill(password ?? "");
  await signInForm.getByRole("button", { name: "Logga in" }).click();
  await expect(page).toHaveURL(/\/rounds\/new$/);
}

async function fillVisibleHoleEntries(page: Page) {
  const strokeInputs = page.getByLabel("Slag");
  const puttInputs = page.getByLabel("Puttar");

  await expect(strokeInputs).toHaveCount(9);
  await expect(puttInputs).toHaveCount(9);

  for (let index = 0; index < 9; index += 1) {
    await strokeInputs.nth(index).fill("5");
    await puttInputs.nth(index).fill("2");
  }
}

test("creates a complete round and cleans it up", async ({ page }) => {
  const playerName = `E2E Rond ${Date.now()}`;

  await signIn(page);

  await page.getByLabel("Spelare").fill(playerName);
  await page.getByLabel("Speldatum").fill("2026-05-26");
  await page.getByLabel("Tee").selectOption("yellow");
  await page.getByLabel("Registrerat handicap").fill("18,4");
  await page.getByRole("button", { name: "Fortsätt till Fram 9" }).click();

  await expect(
    page.getByRole("heading", { name: "Registrera de första nio hålen" }),
  ).toBeVisible();
  await fillVisibleHoleEntries(page);
  await page.getByRole("button", { name: "Fortsätt till Bak 9" }).click();

  await expect(
    page.getByRole("heading", { name: "Avsluta ronden med de sista nio hålen" }),
  ).toBeVisible();
  await fillVisibleHoleEntries(page);
  await page.getByRole("button", { name: "Fortsätt till sparöversikt" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Granska registreringen innan du sparar",
    }),
  ).toBeVisible();
  await expect(page.getByText("Totalt registrerade slag")).toBeVisible();
  await expect(page.getByText("90")).toBeVisible();

  await page.getByRole("button", { name: "Spara rond" }).click();
  await expect(page).toHaveURL(/\/rounds\/[0-9a-f-]+$/);
  await expect(
    page.getByRole("heading", { name: new RegExp(playerName) }),
  ).toBeVisible();
  await expect(page.getByText("Totalresultat")).toBeVisible();
  await expect(page.getByText("Totalt antal puttar")).toBeVisible();
  await expect(page.getByText("36")).toBeVisible();

  await page.getByRole("button", { name: "Ta bort rond" }).click();
  await page.getByRole("button", { name: "Ja, ta bort ronden" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByText(playerName)).toHaveCount(0);
});
