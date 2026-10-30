import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page, context }) => {
    const response = await page.request.post(
      'https://norma.education-services.ru/api/auth/login',
      {
        data: { email: 'stellar@burgers.com', password: 'burgers' },
      }
    );
    const { accessToken, refreshToken } = await response.json();

    await context.addCookies([
      {
        name: 'accessToken',
        value: accessToken,
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', refreshToken);
    });

    await page.routeFromHAR('tests/hars/api.har', {
      url: '**/api/**',
      update: false,
    });

    await page.goto('/');
  });

  test('Добавление ингредиентов в конструктор', async ({ page }) => {
    const bunText = page.getByText('Краторная булка N-200i').first();
    await expect(bunText).toBeVisible({ timeout: 10000 });

    const constructor = page.locator('section').filter({ hasText: 'Оформить заказ' });

    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(constructor.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(constructor.getByText('Краторная булка N-200i (низ)')).toBeVisible();

    const fillingCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await fillingCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();
  });

  test('Работа модальных окон и проверка данных', async ({ page }) => {
    const modal = page.locator('#modals');

    const bunLink = page.getByRole('link', { name: 'Краторная булка N-200i' }).first();
    await expect(bunLink).toBeVisible({ timeout: 10000 });

    await bunLink.click();
    const modalHeader = page.getByRole('heading', { name: 'Детали ингредиента' });
    await expect(modalHeader).toBeVisible();

    await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
    await expect(modal.getByText('80')).toBeVisible();
    await expect(modal.getByText('24')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modalHeader).not.toBeVisible();
    await expect(modal.getByText('Краторная булка N-200i')).not.toBeVisible();

    const fillingLink = page
      .getByRole('link', { name: 'Биокотлета из марсианской Магнолии' })
      .first();
    await expect(fillingLink).toBeVisible();

    await fillingLink.click();
    await expect(modalHeader).toBeVisible();

    await expect(modal.getByText('Биокотлета из марсианской Магнолии')).toBeVisible();
    await expect(modal.getByText('420')).toBeVisible();
    await expect(modal.getByText('142')).toBeVisible();

    const overlay = page.locator('[class*="modal-overlay"]');

    await expect(overlay).toBeVisible();

    await overlay.click({ position: { x: 10, y: 10 } });

    await expect(modalHeader).not.toBeVisible();
  });

  test('Создание заказа и очистка конструктора', async ({ page }) => {
    const bunText = page.getByText('Краторная булка N-200i').first();
    await expect(bunText).toBeVisible({ timeout: 10000 });

    const constructor = page.locator('section').filter({ hasText: 'Оформить заказ' });

    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const fillingCard = page
      .locator('li')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await fillingCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(constructor.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const orderNumber = page.getByText('105852');
    await expect(orderNumber).toBeVisible();
    await expect(page.getByText('идентификатор заказа')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).click();

    await expect(orderNumber).not.toBeVisible();
    await expect(page.getByText('идентификатор заказа')).not.toBeVisible();

    await expect(
      constructor.getByText('Краторная булка N-200i (верх)')
    ).not.toBeVisible();
    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).not.toBeVisible();

    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructor.getByText('Выберите начинку')).toBeVisible();
  });
});
