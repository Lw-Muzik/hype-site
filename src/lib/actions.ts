import type { Action } from 'svelte/action';

/** Add the `in` class when the element scrolls into view (works with `.reveal`).
 *  `delay` staggers the transition. Falls back to visible without IO. */
export const reveal: Action<HTMLElement, { delay?: number } | undefined> = (node, params) => {
  const delay = params?.delay ?? 0;
  if (delay) node.style.transitionDelay = `${delay}ms`;
  const show = () => node.classList.add('in');

  if (typeof IntersectionObserver === 'undefined') {
    show();
    return;
  }
  // Reveal immediately if already in (or just below) the viewport on mount —
  // covers fast scrolls and tall elements that never hit a % threshold.
  const r = node.getBoundingClientRect();
  if (r.top < (window.innerHeight || 0) * 0.95 && r.bottom > 0) {
    show();
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          show();
          io.unobserve(node);
        }
      }
    },
    { threshold: 0, rootMargin: '0px 0px -10% 0px' }
  );
  io.observe(node);
  return { destroy: () => io.disconnect() };
};

/** Count from 0 up to `value` once the element is in view. */
export const countup: Action<HTMLElement, number> = (node, value = 0) => {
  let target = value;
  const run = () => {
    const dur = 1100;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = Math.round(eased * target).toString();
      if (p < 1) requestAnimationFrame(tick);
      else node.textContent = target.toString();
    };
    requestAnimationFrame(tick);
  };
  if (typeof IntersectionObserver === 'undefined') {
    node.textContent = String(target);
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          run();
          io.unobserve(node);
        }
      }
    },
    { threshold: 0.6 }
  );
  io.observe(node);
  return {
    update(v: number) {
      target = v;
    },
    destroy: () => io.disconnect()
  };
};
