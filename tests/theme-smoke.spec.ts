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

// Third-party console noise we do not control and cannot fix from the theme (2026-07-24).
// Shopify's own Shop Pay iframe (shop.app) trips a frame-ancestors CSP rule and 403s on every
// page load, which failed all 8 tests regardless of theme state — a suite that always fails
// tells you nothing. Same exclusion principle estate-check already applies to axe/3rd-party.
// Keep this list tight: only errors originating outside our theme belong here.
const THIRD_PARTY_NOISE = [
  /shop\.app/i,
  /frame-ancestors/i,
  /Failed to load resource: the server responded with a status of 403/i,
];

async function assertNoJSErrors(page: Page) {
  const all: string[] = (page as any).__jsErrors || [];
  const errors = all.filter(e => !THIRD_PARTY_NOISE.some(re => re.test(e)));
  expect(errors, `Expected zero first-party JS console/page errors, got: ${errors.join(' ')}`).toEqual([]);
}

// Product links inside the header/nav dropdowns are in the DOM but hidden until the menu opens,
// and they come FIRST in document order — so a bare `a[href*="/products/"]` .first() resolved to a
// hidden menuitem and failed on a perfectly healthy page (2026-07-24). The `visible: true` filter
// is what fixes it: hidden nav links are skipped without needing to know the markup. Scoped
// selectors are tried first (a real product grid), with a body-wide visible fallback for pages
// like the homepage that surface products outside <main>.
function productLinks(page: Page) {
  const scoped = page.locator(
    '[data-testid="product-card"], main a[href*="/products/"], .rd-collection a[href*="/products/"], .collection a[href*="/products/"]'
  ).filter({ visible: true });
  const anyVisible = page.locator('a[href*="/products/"]').filter({ visible: true });
  return { scoped, anyVisible };
}

async function firstVisibleProduct(page: Page) {
  const { scoped, anyVisible } = productLinks(page);
  return (await scoped.count()) ? scoped.first() : anyVisible.first();
}

async function clickFirstProductFromPage(page: Page) {
  const link = await firstVisibleProduct(page);
  await expect(link).toBeVisible();
  await link.click();
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
    // Start from a collection, not the homepage: homepage merchandising is editorial and may
    // surface zero product links, which made this test fail on a healthy store (2026-07-24).
    // A collection is also the realistic purchase path.
    await page.goto('/collections/home-build-kits');

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

    // Assert the OUTCOME (the item is in the cart), not a particular UI affordance. The previous
    // version required <cart-drawer> to become visible; that element is always present in the DOM
    // and only shown when opened, so the test failed even when the add succeeded (2026-07-24).
    // /cart.js is the source of truth and is independent of drawer-vs-notification-vs-page UX.
    await expect.poll(
      async () => (await (await page.request.get('/cart.js')).json()).item_count,
      { message: 'cart item_count after add-to-cart', timeout: 10000 }
    ).toBeGreaterThan(0);
  });

  test('Checkout link exists from cart', async ({ page }) => {
    // Must seed the cart first. On an EMPTY cart Shopify renders the checkout button hidden and
    // `disabled` — correct behaviour — so the old version of this test asserted a visible checkout
    // on an empty cart and could never pass (2026-07-24). Testing the purchase path means putting
    // something in the basket.
    await page.goto('/collections/home-build-kits');
    await clickFirstProductFromPage(page);
    const addToCart = (await page.locator('[data-testid="add-to-cart"]').count())
      ? page.locator('[data-testid="add-to-cart"]').first()
      : page.getByRole('button', { name: /add to cart/i }).first();
    await expect(addToCart).toBeVisible();
    await addToCart.click();

    await page.goto('/cart');
    // Scope to the cart PAGE form — the cart drawer carries a duplicate #CartDrawer-Checkout that
    // stays hidden while the drawer is closed.
    const checkout = page
      .locator('form[action*="/cart"] button[name="checkout"], form[action*="/cart"] [data-testid="cart-checkout"], a[href*="/checkout"]')
      .filter({ visible: true });
    await expect(checkout.first()).toBeVisible();
    await expect(checkout.first()).toBeEnabled();
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
    
    // Should have at least one product (visible, body-scoped — see productLinks note above)
    await expect(await firstVisibleProduct(page)).toBeVisible();
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
