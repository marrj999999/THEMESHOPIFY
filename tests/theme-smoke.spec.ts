import { test, expect, Page } from '@playwright/test';

async function expectNoJSErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`);
  });
  page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));
  // Attach to page for later assertion
  (page as any).__jsErrors = errors;
}

async function assertNoJSErrors(page: Page) {
  const errors: string[] = (page as any).__jsErrors || [];
  expect(errors, `Expected zero JS console/page errors, got: ${errors.join(' ')}`).toEqual([]);
}

async function clickFirstProductFromPage(page: Page) {
  // Prefer explicit test IDs if you added them
  const cardByTestId = page.locator('[data-testid="product-card"]').first();
  if (await cardByTestId.count()) {
    await cardByTestId.click();
    return;
  }
  // Fallback: click first product link we can find
  const firstProductLink = page.locator('a[href*="/products/"]').first();
  await expect(firstProductLink).toBeVisible();
  await firstProductLink.click();
}

test.describe('BBC Theme smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await expectNoJSErrors(page);
  });

  test.afterEach(async ({ page }) => {
    await assertNoJSErrors(page);
  });

  test('Home loads and header is visible', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
    
    const header = page.locator('[data-testid="site-header"]');
    if (await header.count()) {
      await expect(header).toBeVisible();
    } else {
      // Fallback: basic semantic header
      await expect(page.locator('header').first()).toBeVisible();
    }
  });

  test('Navigation menu works', async ({ page }) => {
    await page.goto('/');
    
    // Check nav toggle on mobile
    const navToggle = page.locator('[data-testid="nav-toggle"]');
    if (await navToggle.isVisible()) {
      await navToggle.click();
      await expect(page.locator('nav')).toBeVisible();
    }
  });

  test('Can open a product and add to cart', async ({ page }) => {
    await page.goto('/');

    // Navigate to a product
    await clickFirstProductFromPage(page);

    // Product basics
    const productTitle = page.locator('[data-testid="product-title"]');
    if (await productTitle.count()) {
      await expect(productTitle).toBeVisible();
    } else {
      // Fallback: common Dawn-ish pattern
      await expect(page.locator('h1').first()).toBeVisible();
    }

    // Add to cart
    const addToCart = (await page.locator('[data-testid="add-to-cart"]').count())
      ? page.locator('[data-testid="add-to-cart"]')
      : page.getByRole('button', { name: /add to cart/i });

    await expect(addToCart).toBeVisible();
    await addToCart.click();

    // Cart count updates (drawer or header)
    const cartCount = page.locator('[data-testid="cart-count"]');
    if (await cartCount.count()) {
      await expect(cartCount).toContainText(/[1-9]/);
    }

    // If you have a cart drawer, check it
    const cartDrawer = page.locator('[data-testid="cart-drawer"]');
    if (await cartDrawer.count()) {
      await expect(cartDrawer).toBeVisible();
      const lineItem = cartDrawer.locator('[data-testid="cart-line-item"]').first();
      if (await lineItem.count()) await expect(lineItem).toBeVisible();
    } else {
      // Otherwise go to cart page and assert item exists
      await page.goto('/cart');
      await expect(page).toHaveURL(/\/cart/);
      // Look for any line item container
      const anyLineItem = page.locator('[data-testid="cart-line-item"], form[action^="/cart"]').first();
      await expect(anyLineItem).toBeVisible();
    }
  });

  test('Checkout link exists from cart', async ({ page }) => {
    await page.goto('/cart');

    // Shopify cart usually has a checkout button
    const checkout = (await page.locator('[data-testid="cart-checkout"]').count())
      ? page.locator('[data-testid="cart-checkout"]')
      : page.getByRole('button', { name: /checkout/i }).or(page.getByRole('link', { name: /checkout/i }));

    await expect(checkout.first()).toBeVisible();
  });

  test('Search functionality works', async ({ page }) => {
    await page.goto('/');
    
    // Open search
    const searchOpen = page.locator('[data-testid="search-open"]');
    if (await searchOpen.count()) {
      await searchOpen.click();
      
      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toBeVisible();
      await searchInput.fill('bamboo');
      
      const searchSubmit = page.locator('[data-testid="search-submit"]');
      if (await searchSubmit.count()) {
        await searchSubmit.click();
      } else {
        await searchInput.press('Enter');
      }
      
      await expect(page).toHaveURL(/search/);
    }
  });

  test('Collection page shows products', async ({ page }) => {
    await page.goto('/collections/home-build-kits');
    
    const productGrid = page.locator('[data-testid="product-grid"]');
    if (await productGrid.count()) {
      await expect(productGrid).toBeVisible();
    }
    
    // Should have at least one product
    const products = page.locator('[data-testid="product-card"], .product-card, a[href*="/products/"]');
    await expect(products.first()).toBeVisible();
  });

  test('Footer is visible', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('[data-testid="site-footer"]');
    if (await footer.count()) {
      await expect(footer).toBeVisible();
    } else {
      await expect(page.locator('footer').first()).toBeVisible();
    }
  });

  test('Impact page loads correctly', async ({ page }) => {
    await page.goto('/pages/impact');
    await expect(page).toHaveTitle(/impact/i);
    
    // Check key sections
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
