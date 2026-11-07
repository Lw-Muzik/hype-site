import { describe, expect, it } from 'vitest';
import { PLUS_FEATURES, PLUS_PRICE_LINE, PLUS_PRICE_TEXT, PLUS_PRICE_USD, PLUS_TRIAL_DAYS, checkoutConfig } from './plus';

const PRICE = 'pri_01aaa';

describe('HypeMuzik Plus', () => {
  it('has one fixed price of US$5', () => {
    expect(PLUS_PRICE_USD).toBe(5);
    expect(PLUS_PRICE_TEXT).toBe('US$5');
    expect(PLUS_PRICE_LINE).toBe('US$5 · one-time · yours for life');
  });

  it('has a 7-day free trial', () => {
    expect(PLUS_TRIAL_DAYS).toBe(7);
  });

  it('unlocks exactly six desktop features', () => {
    expect(PLUS_FEATURES.map((f) => f.name)).toEqual([
      'Per-app EQ',
      'Per-app mixer',
      'Convolver',
      '3D Surround',
      'Room reverb',
      'ViPER DDC curves'
    ]);
  });
});

describe('checkoutConfig', () => {
  it('is on for a sandbox token in sandbox', () => {
    expect(checkoutConfig({ env: 'sandbox', token: 'test_abc', priceId: PRICE })).toEqual({
      environment: 'sandbox',
      token: 'test_abc',
      priceId: PRICE
    });
  });

  it('is on for a live token in production', () => {
    expect(checkoutConfig({ env: 'production', token: 'live_abc', priceId: PRICE })?.environment).toBe(
      'production'
    );
  });

  it('trims whitespace around the price id', () => {
    expect(checkoutConfig({ env: 'sandbox', token: 'test_abc', priceId: ` ${PRICE} ` })?.priceId).toBe(PRICE);
  });

  it('is off when nothing is configured', () => {
    expect(checkoutConfig({})).toBeNull();
  });

  it('never guesses the environment', () => {
    expect(checkoutConfig({ token: 'live_abc', priceId: PRICE })).toBeNull();
    expect(checkoutConfig({ env: 'live', token: 'live_abc', priceId: PRICE })).toBeNull();
  });

  it('refuses a token from the other environment', () => {
    expect(checkoutConfig({ env: 'production', token: 'test_abc', priceId: PRICE })).toBeNull();
    expect(checkoutConfig({ env: 'sandbox', token: 'live_abc', priceId: PRICE })).toBeNull();
  });

  it('is off without a usable price id', () => {
    expect(checkoutConfig({ env: 'sandbox', token: 'test_abc' })).toBeNull();
    expect(checkoutConfig({ env: 'sandbox', token: 'test_abc', priceId: 'pro_01aaa' })).toBeNull();
    expect(checkoutConfig({ env: 'sandbox', token: 'test_abc', priceId: '' })).toBeNull();
  });
});
