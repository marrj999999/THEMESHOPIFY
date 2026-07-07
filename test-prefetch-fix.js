/**
 * Test script to verify prefetch fixes are working
 * Run this in browser console on the homepage
 */

console.log('🧪 Testing BBC Prefetch Fixes...\n');

// Test 1: Check if immediate blocking is active
console.log('Test 1: Immediate Blocking System');
console.log('Status:', window.BBC_ImmediateBlockingActive ? '✅ ACTIVE' : '❌ INACTIVE');

// Test 2: Count all prefetch links
const allPrefetches = document.querySelectorAll('link[rel="prefetch"], link[rel="preload"]');
console.log('\nTest 2: Total Prefetch/Preload Links');
console.log('Count:', allPrefetches.length);

// Test 3: Check for checkout-related prefetches
const checkoutPatterns = [
  'polyfills.D-3tW6RD.js',
  'app.DAqj4RIl.js', 
  'vendor.DyY7uuKy.js',
  'PaymentButtons',
  'LocalPickup',
  'ShopPay',
  'checkout-web',
  'OnePage.DYH7B_vD.css',
  'MobileOrderSummary'
];

let foundCheckoutPrefetches = 0;
const checkoutLinks = [];

allPrefetches.forEach(link => {
  const href = link.href || '';
  const isCheckout = checkoutPatterns.some(pattern => href.includes(pattern));
  if (isCheckout) {
    foundCheckoutPrefetches++;
    checkoutLinks.push(href);
  }
});

console.log('\nTest 3: Checkout Prefetches Found');
console.log('Count:', foundCheckoutPrefetches);
console.log('Status:', foundCheckoutPrefetches === 0 ? '✅ SUCCESS' : '❌ ISSUE');

if (foundCheckoutPrefetches > 0) {
  console.log('Remaining checkout prefetches:');
  checkoutLinks.forEach((link, i) => console.log(`${i + 1}. ${link}`));
}

// Test 4: Check current page template
const template = document.documentElement.getAttribute('data-template') || 'unknown';
console.log('\nTest 4: Page Template');
console.log('Template:', template);
console.log('Should block checkout:', ['index', 'page', 'blog', 'article'].includes(template) ? 'YES' : 'NO');

// Test 5: Performance impact
console.log('\nTest 5: Performance Impact');
console.log('Before fix: 36 checkout prefetches');
console.log('After fix:', foundCheckoutPrefetches, 'checkout prefetches');
console.log('Network requests saved:', 36 - foundCheckoutPrefetches);

// Final result
console.log('\n🏆 FINAL RESULT');
if (template === 'index' && foundCheckoutPrefetches === 0) {
  console.log('✅ SUCCESS: Homepage optimization working perfectly!');
  console.log('🚀 Performance: 36 fewer network requests on homepage load');
} else if (template === 'index' && foundCheckoutPrefetches > 0) {
  console.log(`❌ ISSUE: Still ${foundCheckoutPrefetches} checkout prefetches on homepage`);
  console.log('🔧 Need to investigate why blocking failed');
} else {
  console.log(`ℹ️ INFO: On ${template} page, blocking status as expected`);
}