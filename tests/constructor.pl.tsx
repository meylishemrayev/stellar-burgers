import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'fake-access-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/ingredients',
      update: false,
    });

    await page.route('**/auth/user', async (route) => {
      await route.fulfill({
        json: { success: true, user: { email: 'test@test.com', name: 'TestUser' } },
      });
    });

    await page.route('**/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          json: { success: true, name: 'Burger', order: { number: 12345 } },
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');
  });

  test('Добавление ингредиентов в конструктор', async ({ page }) => {
    const bunText = page.getByText('Краторная булка N-200i').first();
    await expect(bunText).toBeVisible({ timeout: 10000 });

    const addButtons = page.getByRole('button', { name: 'Добавить' });
    await addButtons.first().click();
    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();

    await addButtons.nth(1).click();
    await expect(
      page.getByText('Биокотлета из марсианской Магнолии').first()
    ).toBeVisible();
  });

  test('Работа модальных окон и проверка данных', async ({ page }) => {
    const bunLink = page.getByRole('link', { name: 'Краторная булка N-200i' }).first();
    await expect(bunLink).toBeVisible({ timeout: 10000 });

    await bunLink.click();

    const modalHeader = page.getByRole('heading', { name: 'Детали ингредиента' });
    await expect(modalHeader).toBeVisible();

    const modal = page.locator('#modals');

    await expect(modal.getByText('Краторная булка N-200i')).toBeVisible(); // Имя внутри модалки
    await expect(modal.getByText('80')).toBeVisible(); // Белки (proteins)
    await expect(modal.getByText('24')).toBeVisible(); // Жиры (fat)

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modalHeader).not.toBeVisible();

    await bunLink.click();
    await expect(modalHeader).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(modalHeader).not.toBeVisible();
  });

  test('Создание заказа и очистка конструктора', async ({ page }) => {
    const bunText = page.getByText('Краторная булка N-200i').first();
    await expect(bunText).toBeVisible({ timeout: 10000 });

    const addButtons = page.getByRole('button', { name: 'Добавить' });
    await addButtons.first().click();
    await addButtons.nth(1).click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const orderNumber = page.getByText('12345');
    await expect(orderNumber).toBeVisible();
    await expect(page.getByText('идентификатор заказа')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(orderNumber).not.toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
  });
});
