/**
 * BBC Prefetch Test Script
 * Tests and reports on prefetch optimization performance
 * Run this in browser console to verify fixes are working
 */

(function() {
  'use strict';

  const PrefetchTest = {
    
    /**
     * Count total prefetch links on page
     */
    countPrefetches() {
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
      return prefetchLinks.length;
    },

    /**
     * Count checkout-related prefetch links
     */
    countCheckoutPrefetches() {
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
      let checkoutCount = 0;
      
      prefetchLinks.forEach(link => {
        if (link.href.includes('checkout-web') || 
            link.href.includes('PaymentButtons') ||
            link.href.includes('ShopPay') ||
            link.href.includes('polyfills.D-3tW6RD.js')) {
          checkoutCount++;
        }
      });
      
      return checkoutCount;
    },

    /**
     * Get current page type
     */
    getPageType() {
      const template = document.documentElement.getAttribute('data-template') || 'unknown';
      const pageType = document.documentElement.getAttribute('data-page-type') || 'unknown';
      return { template, pageType };
    },

    /**
     * Check if prefetch optimization is working
     */
    testOptimization() {
      const pageInfo = this.getPageType();
      const totalPrefetches = this.countPrefetches();
      const checkoutPrefetches = this.countCheckoutPrefetches();
      
      console.group('🔍 BBC Prefetch Optimization Test');
      console.log('📄 Page Type:', pageInfo);
      console.log('🔗 Total Prefetches:', totalPrefetches);
      console.log('🛒 Checkout Prefetches:', checkoutPrefetches);
      
      // Determine if optimization should be active
      const shouldOptimize = ['index', 'page', 'blog', 'article'].includes(pageInfo.template);
      
      if (shouldOptimize) {
        if (checkoutPrefetches === 0) {
          console.log('✅ SUCCESS: Checkout prefetches correctly removed on', pageInfo.template, 'page');
        } else {
          console.log('❌ ISSUE: Found', checkoutPrefetches, 'checkout prefetches on', pageInfo.template, 'page (should be 0)');
        }
      } else {
        if (checkoutPrefetches > 0) {
          console.log('✅ SUCCESS: Checkout prefetches kept on', pageInfo.template, 'page');
        } else {
          console.log('⚠️ WARNING: No checkout prefetches on', pageInfo.template, 'page (might be expected)');
        }
      }

      console.groupEnd();
      
      return {
        pageInfo,
        totalPrefetches,
        checkoutPrefetches,
        optimized: shouldOptimize && checkoutPrefetches === 0
      };
    },

    /**
     * List all prefetch URLs for debugging
     */
    listPrefetches() {
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
      const prefetchUrls = Array.from(prefetchLinks).map(link => link.href);
      
      console.group('🔗 All Prefetch URLs');
      prefetchUrls.forEach((url, index) => {
        const isCheckout = url.includes('checkout-web') || url.includes('PaymentButtons') || url.includes('ShopPay');
        console.log(`${index + 1}.`, isCheckout ? '🛒' : '📄', url);
      });
      console.groupEnd();
      
      return prefetchUrls;
    },

    /**
     * Performance impact analysis
     */
    analyzePerformance() {
      const beforeOptimization = 36; // Original count from the issue
      const afterOptimization = this.countCheckoutPrefetches();
      const pageInfo = this.getPageType();
      
      console.group('📊 Performance Impact Analysis');
      console.log('Before optimization:', beforeOptimization, 'checkout prefetches');
      console.log('After optimization:', afterOptimization, 'checkout prefetches');
      console.log('Network requests saved:', beforeOptimization - afterOptimization);
      console.log('Page type:', pageInfo.template);
      
      // Check if immediate blocking is active
      if (window.BBC_ImmediateBlockingActive) {
        console.log('⚡ Immediate blocking system: ACTIVE');
      } else {
        console.log('⚠️ Immediate blocking system: INACTIVE');
      }
      
      if (pageInfo.template === 'index' && afterOptimization === 0) {
        console.log('🚀 EXCELLENT: Homepage optimization successful!');
      } else if (pageInfo.template === 'index' && afterOptimization > 0) {
        console.log('❌ ISSUE: Still found', afterOptimization, 'checkout prefetches on homepage');
        this.listRemainingCheckoutPrefetches();
      }
      
      console.groupEnd();
      
      return {
        before: beforeOptimization,
        after: afterOptimization,
        saved: beforeOptimization - afterOptimization,
        immediateBlocking: !!window.BBC_ImmediateBlockingActive
      };
    },

    /**
     * List remaining checkout prefetches for debugging
     */
    listRemainingCheckoutPrefetches() {
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"], link[rel="preload"]');
      const checkoutPatterns = [
        'polyfills.D-3tW6RD.js', 'app.DAqj4RIl.js', 'vendor.DyY7uuKy.js',
        'PaymentButtons', 'LocalPickup', 'ShopPay', 'checkout-web'
      ];
      
      console.group('❌ Remaining Checkout Prefetches');
      prefetchLinks.forEach(link => {
        const href = link.href || '';
        const isCheckout = checkoutPatterns.some(pattern => href.includes(pattern));
        if (isCheckout) {
          console.log('🛒 BLOCKED:', href);
        }
      });
      console.groupEnd();
    },

    /**
     * Run complete test suite
     */
    runFullTest() {
      console.log('🧪 Running BBC Prefetch Optimization Test Suite...\n');
      
      const optimization = this.testOptimization();
      const prefetches = this.listPrefetches();
      const performance = this.analyzePerformance();
      
      console.log('\n📋 Test Summary:');
      console.log('Optimization Status:', optimization.optimized ? '✅ Working' : '❌ Issues Found');
      console.log('Network Requests Saved:', performance.saved);
      console.log('Total Prefetches Remaining:', optimization.totalPrefetches);
      
      return {
        optimization,
        prefetches,
        performance,
        summary: {
          working: optimization.optimized,
          networkSaved: performance.saved,
          totalPrefetches: optimization.totalPrefetches
        }
      };
    }
  };

  // Auto-run test on load for debugging
  if (window.location.search.includes('prefetch-test')) {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => PrefetchTest.runFullTest(), 1000);
    });
  }

  // Make available globally for manual testing
  window.BBC_PrefetchTest = PrefetchTest;

  console.log('🔧 BBC Prefetch Test loaded. Run BBC_PrefetchTest.runFullTest() to test optimization.');

})();