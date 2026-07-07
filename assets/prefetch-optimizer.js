/**
 * BBC Prefetch Optimizer
 * Removes unnecessary checkout-related prefetch links on non-commerce pages
 * to improve homepage performance and reduce network requests.
 */

(function() {
  'use strict';

  // Pages where checkout prefetches are NOT needed
  const NON_COMMERCE_PAGES = [
    'index',     // Homepage
    'page',      // Static pages (About, Contact, etc.)
    'blog',      // Blog listing
    'article',   // Blog posts
    'list-collections', // Collection listing
    '404'        // Error pages
  ];

  // Checkout-related prefetch patterns to remove on non-commerce pages
  const CHECKOUT_PREFETCH_PATTERNS = [
    '/shopifycloud/checkout-web/',
    '/shopifycloud/portable-wallets/',
    // Exact files from the issue
    'polyfills.D-3tW6RD.js',
    'app.DAqj4RIl.js',
    'vendor.DyY7uuKy.js', 
    'locale-en.B292wwYD.js',
    'page-OnePage.DC_xdU7w.js',
    'PaymentButtons.B0tAoVq3.js',
    'LocalPickup.UDKID1QF.js',
    'useShopPayButtonClassName.DMpSye9n.js',
    'VaultedPayment.D7kAR9jq.js',
    'MarketsProDisclaimer.DgQ5j7Nq.js',
    'AddDiscountButton.BzvfSd-v.js',
    'RememberMeDescriptionText.CYpfBtrv.js',
    'ShopPayOptInDisclaimer.BRLfXC3a.js',
    'MobileOrderSummary.8j4pEh-_.js',
    'PayButtonSection.BFEwmbrp.js',
    'SeparatePaymentsNotice.RItqkkr0.js',
    'PaymentOptions.DleHMyGO.js',
    'usePreselectSpi.CKbBX41H.js',
    'StockProblemsLineItemList.v68VtXnI.js',
    'component-ShopPayVerificationSwitch.Czh-Zv95.js',
    'useSubscribeMessenger.BRR0i60s.js',
    'shop-js-index.CaKY8b_6.js',
    'v4.BKrj-4V8.js',
    'ShipmentBreakdown.B6_fNclP.js',
    'MerchandiseModal.Czgdb_PJ.js',
    'StackedMerchandisePreview.DB-fHtQe.js',
    // CSS files
    'app.tXiHaxMF.css',
    'OnePage.DYH7B_vD.css',
    'LocalPickup.BD02NT8N.css',
    'AddDiscountButton.CZ33y7Va.css',
    'MobileOrderSummary.7lB-c-sA.css',
    'PaymentOptions.PpwvcyQt.css',
    'ShopPayVerificationSwitch.WW3cs_z5.css',
    'useShopPayButtonClassName.BrcQzLuH.css',
    'VaultedPayment.OxMVm7u-.css',
    'StackedMerchandisePreview',
    // General patterns  
    'PaymentButtons.',
    'LocalPickup.',
    'ShopPay',
    'Payment',
    'checkout',
    'cart-drawer'
  ];

  /**
   * Get current page type from Shopify
   */
  function getCurrentPageType() {
    // Check Shopify global if available
    if (window.Shopify && window.Shopify.theme) {
      return window.Shopify.theme.role || 'unknown';
    }
    
    // Fallback: detect from URL patterns
    const path = window.location.pathname;
    
    if (path === '/' || path === '/index') return 'index';
    if (path.startsWith('/pages/')) return 'page';
    if (path.startsWith('/blogs/') && !path.includes('/articles/')) return 'blog';
    if (path.includes('/articles/')) return 'article';
    if (path === '/collections' || path.startsWith('/collections') && path.split('/').length === 2) return 'list-collections';
    if (path.startsWith('/collections/')) return 'collection';
    if (path.startsWith('/products/')) return 'product';
    if (path === '/cart') return 'cart';
    if (path.includes('404')) return '404';
    
    return 'unknown';
  }

  /**
   * Check if checkout prefetches should be removed for current page
   */
  function shouldRemoveCheckoutPrefetches() {
    // Check if prefetch controller explicitly blocked checkout prefetches
    if (window.BBC_BlockCheckoutPrefetches) {
      return true;
    }
    
    // Check data attributes set by prefetch controller
    const checkoutPrefetchAllowed = document.documentElement.getAttribute('data-checkout-prefetch') === 'true';
    if (!checkoutPrefetchAllowed) {
      return true;
    }
    
    // Fallback to page type detection
    const pageType = getCurrentPageType();
    const isNonCommercePage = NON_COMMERCE_PAGES.includes(pageType);
    
    // Always keep prefetches on product, cart, and checkout pages
    if (['product', 'cart', 'checkout'].includes(pageType)) {
      return false;
    }
    
    // Remove on non-commerce pages
    return isNonCommercePage;
  }

  /**
   * Remove checkout-related prefetch links
   */
  function removeCheckoutPrefetches() {
    const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
    let removedCount = 0;
    
    prefetchLinks.forEach(link => {
      const href = link.href;
      
      // Check if this prefetch link matches checkout patterns
      const isCheckoutPrefetch = CHECKOUT_PREFETCH_PATTERNS.some(pattern => 
        href.includes(pattern)
      );
      
      if (isCheckoutPrefetch) {
        console.log('[Prefetch Optimizer] Removing checkout prefetch:', href);
        link.remove();
        removedCount++;
      }
    });
    
    if (removedCount > 0) {
      console.log(`[Prefetch Optimizer] Removed ${removedCount} unnecessary checkout prefetches on ${getCurrentPageType()} page`);
    }
    
    return removedCount;
  }

  /**
   * Optimize prefetch links based on page type
   */
  function optimizePrefetches() {
    const pageType = getCurrentPageType();
    
    if (shouldRemoveCheckoutPrefetches()) {
      const removedCount = removeCheckoutPrefetches();
      
      // Log performance improvement
      if (removedCount > 0) {
        console.log(`[Prefetch Optimizer] Performance improved: ${removedCount} fewer network requests on ${pageType} page`);
      }
    } else {
      console.log(`[Prefetch Optimizer] Keeping checkout prefetches on ${pageType} page`);
    }
  }

  /**
   * Immediate optimization - runs as soon as script loads
   */
  function immediateOptimization() {
    // Run immediately to catch early prefetches
    optimizePrefetches();
    
    // Also observe for new prefetch links added by content_for_header
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1 && node.tagName === 'LINK' && node.rel === 'prefetch') {
            // Check if this is a checkout prefetch that should be removed
            const isCheckoutPrefetch = CHECKOUT_PREFETCH_PATTERNS.some(pattern => 
              node.href.includes(pattern)
            );
            
            if (isCheckoutPrefetch && shouldRemoveCheckoutPrefetches()) {
              console.log('[Prefetch Optimizer] Removing dynamically added checkout prefetch:', node.href);
              node.remove();
            }
          }
        });
      });
    });
    
    // Start observing for new prefetch links
    observer.observe(document.head, { childList: true, subtree: true });
  }

  /**
   * Run optimization when DOM is ready
   */
  function init() {
    // Run immediate optimization
    immediateOptimization();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizePrefetches);
    } else {
      optimizePrefetches();
    }
  }

  // Initialize the prefetch optimizer immediately
  init();

  // Export for debugging
  window.BBC_PrefetchOptimizer = {
    getCurrentPageType,
    shouldRemoveCheckoutPrefetches,
    removeCheckoutPrefetches,
    optimizePrefetches
  };

})();