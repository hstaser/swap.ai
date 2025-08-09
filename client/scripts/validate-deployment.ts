#!/usr/bin/env tsx

// Deployment Validation Script
// Run this before deploying to ensure all queue/stock requirements are met

import { validateInfluencerMappings, INFLUENCER_COUNT, VERIFIED_INFLUENCER_COUNT } from '../data/influencer.map';
import { STOCK_COUNT, getAllStocks, validateStock } from '../data/stocks.catalog';
import { validateQueueIntegrity } from '../store/queue';

console.log('🔍 Running Deployment Validation...\n');

let hasErrors = false;

// 1. Validate Stock Catalog
console.log('📊 Validating Stock Catalog...');
const allStocks = getAllStocks();

if (STOCK_COUNT === 0) {
  console.error('❌ CRITICAL: No stocks in catalog!');
  hasErrors = true;
} else {
  console.log(`✅ Found ${STOCK_COUNT} stocks in catalog`);
}

// Check required stocks exist
const requiredStocks = ['AAPL', 'NKE', 'PEP', 'MSFT', 'GOOGL', 'NVDA', 'TSLA', 'AMZN'];
const missingStocks: string[] = [];

requiredStocks.forEach(symbol => {
  const validation = validateStock(symbol);
  if (!validation.isValid) {
    missingStocks.push(symbol);
  }
});

if (missingStocks.length > 0) {
  console.error(`❌ CRITICAL: Missing required stocks: ${missingStocks.join(', ')}`);
  hasErrors = true;
} else {
  console.log('✅ All required stocks present in catalog');
}

// Validate stock data structure
let invalidStocks = 0;
allStocks.forEach(stock => {
  if (!stock.id || !stock.symbol || !stock.name || typeof stock.price !== 'number') {
    console.error(`❌ Invalid stock data structure: ${stock.symbol}`);
    invalidStocks++;
    hasErrors = true;
  }
});

if (invalidStocks === 0) {
  console.log('✅ All stocks have valid data structure');
}

// 2. Validate Influencer Mappings
console.log('\n👤 Validating Influencer Mappings...');
const influencerValidation = validateInfluencerMappings();

console.log(`📊 Total influencers: ${INFLUENCER_COUNT}`);
console.log(`✅ Verified influencers: ${VERIFIED_INFLUENCER_COUNT}`);

if (!influencerValidation.isValid) {
  console.error('❌ CRITICAL: Influencer mapping validation failed:');
  influencerValidation.errors.forEach(error => {
    console.error(`   - ${error}`);
  });
  hasErrors = true;
} else {
  console.log('✅ Influencer mappings are valid');
}

if (influencerValidation.warnings.length > 0) {
  console.warn('⚠️  Influencer mapping warnings:');
  influencerValidation.warnings.forEach(warning => {
    console.warn(`   - ${warning}`);
  });
}

// 3. Check LeBron James Specific Requirements
console.log('\n🏀 Validating LeBron James Requirements...');

if (VERIFIED_INFLUENCER_COUNT === 0) {
  console.warn('⚠️  No verified influencers - LeBron section will be empty in production');
} else {
  console.log('✅ At least one influencer is verified');
}

// 4. Validate Queue System
console.log('\n🗂️  Validating Queue System...');
const queueIntegrity = validateQueueIntegrity();

if (!queueIntegrity.isValid) {
  console.error('❌ Queue integrity check failed:');
  queueIntegrity.errors.forEach(error => {
    console.error(`   - ${error}`);
  });
  hasErrors = true;
} else {
  console.log('✅ Queue system integrity validated');
}

// 5. Test Critical User Flows
console.log('\n🧪 Testing Critical User Flows...');

// Import queue functions for testing
import { addToQueue, clearQueue, isInQueue, getQueue } from '../store/queue';

// Clear any existing queue
clearQueue();

// Test: Add Nike from different sources
const nikeSwipeResult = addToQueue('NKE', 'bullish', 'swipe');
const nikeLebronResult = addToQueue('nke', 'bullish', 'lebron');

if (!nikeSwipeResult.success || !nikeLebronResult.success) {
  console.error('❌ CRITICAL: Failed to add Nike to queue');
  hasErrors = true;
} else if (getQueue().length !== 1) {
  console.error('❌ CRITICAL: Nike duplication detected');
  hasErrors = true;
} else {
  console.log('✅ Nike deduplication working correctly');
}

// Test: Case normalization
clearQueue();
const caseTestResults = [
  addToQueue('aapl', 'bullish'),
  addToQueue('AAPL', 'bullish'),
  addToQueue('  aapl  ', 'bullish')
];

if (caseTestResults.some(r => !r.success) || getQueue().length !== 1) {
  console.error('❌ CRITICAL: Case normalization failed');
  hasErrors = true;
} else {
  console.log('✅ Case normalization working correctly');
}

// Test: Invalid symbol rejection
const invalidResult = addToQueue('ZZZZ', 'bullish');
if (invalidResult.success) {
  console.error('❌ CRITICAL: Invalid symbols not being rejected');
  hasErrors = true;
} else {
  console.log('✅ Invalid symbol rejection working correctly');
}

// Cleanup
clearQueue();

// 6. Final Report
console.log('\n📋 Deployment Validation Report');
console.log('================================');

if (hasErrors) {
  console.error('\n❌ DEPLOYMENT BLOCKED - Critical errors found!');
  console.error('Please fix all errors before deploying.');
  process.exit(1);
} else {
  console.log('\n✅ ALL CHECKS PASSED - Safe to deploy!');
  
  console.log('\n📊 Summary:');
  console.log(`- Stock Catalog: ${STOCK_COUNT} stocks`);
  console.log(`- Influencers: ${VERIFIED_INFLUENCER_COUNT}/${INFLUENCER_COUNT} verified`);
  console.log(`- Required stocks: All present`);
  console.log(`- Queue system: Functional`);
  console.log(`- Deduplication: Working`);
  console.log(`- Validation: Strict`);
  
  if (VERIFIED_INFLUENCER_COUNT === 0) {
    console.log('\n⚠️  NOTE: LeBron section will be empty until influencer mappings are verified by PM/Legal');
  }
  
  process.exit(0);
}
