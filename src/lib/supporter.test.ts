import { describe, expect, it } from 'vitest';
import { SUPPORTER_AMOUNTS, SUPPORTER_DEFAULT, checkoutConfig, parsePrices } from './supporter';

const PRICES = '3:pri_01aaa,5:pri_01bbb,10:pri_01ccc,25:pri_01ddd';

describe('supporter amounts', () => {
  it('start at $3 and suggest $5 by default', () => {
    expect(SUPPORTER_AMOUNTS[0]).toBe(3);
    expect(SUPPORTER_AMOUNTS).toContain(SUPPORTER_DEFAULT);
    expect(SUPPORTER_DEFAULT).toBe(5);
  });
});

describe('parsePrices', () => {
  it('maps each amount to its Paddle price id', () => {
    expect(parsePrices(PRICES)).toEqual({
      3: 'pri_01aaa',
      5: 'pri_01bbb',
      10: 'pri_01ccc',
      25: 'pri_01ddd'
    });
  });

  it('tolerates whitespace and a trailing comma', () => {
    expect(parsePrices(' 5 : pri_01bbb , 10:pri_01ccc, ')).toEqual({ 5: 'pri_01bbb', 10: 'pri_01ccc' });
  });

  it('drops amounts the page does not offer and ids that are not price ids', () => {
    expect(parsePrices('4:pri_01xxx,5:pro_01bbb,10:pri_01ccc,25:')).toEqual({ 10: 'pri_01ccc' });
  });

  it('is empty when unset', () => {
    expect(parsePrices(undefined)).toEqual({});
    expect(parsePrices('')).toEqual({});
  });
});

describe('checkoutConfig', () => {
  it('is on for a sandbox token in sandbox', () => {
    expect(checkoutConfig({ env: 'sandbox', token: 'test_abc', prices: PRICES })).toEqual({
      environment: 'sandbox',
      token: 'test_abc',
      prices: parsePrices(PRICES)
    });
  });

  it('is on for a live token in production', () => {
    expect(checkoutConfig({ env: 'production', token: 'live_abc', prices: PRICES })?.environment).toBe(
      'production'
    );
  });

  it('is off when nothing is configured', () => {
    expect(checkoutConfig({})).toBeNull();
  });

  it('never guesses the environment', () => {
    expect(checkoutConfig({ token: 'live_abc', prices: PRICES })).toBeNull();
    expect(checkoutConfig({ env: 'live', token: 'live_abc', prices: PRICES })).toBeNull();
  });

  it('refuses a token from the other environment', () => {
    expect(checkoutConfig({ env: 'production', token: 'test_abc', prices: PRICES })).toBeNull();
    expect(checkoutConfig({ env: 'sandbox', token: 'live_abc', prices: PRICES })).toBeNull();
  });

  it('is off without a single usable price', () => {
    expect(checkoutConfig({ env: 'sandbox', token: 'test_abc', prices: '7:pri_01aaa' })).toBeNull();
  });
});
