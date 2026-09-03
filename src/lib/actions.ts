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
  let io: IntersectionObserver;
  try {
    io = new IntersectionObserver(
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
  } catch {
    show();
    return;
  }

  // Watchdog. The reveal hides real content, so it must never be the reason a
  // section stays blank: if the observer hasn't fired by now, show it anyway.
  const watchdog = window.setTimeout(show, 2500);

  return {
    destroy() {
      clearTimeout(watchdog);
      io.disconnect();
    }
  };
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

/**
 * Pointer-driven 3D tilt.
 *
 * The rotation is small on purpose — this is depth in answer to a person's
 * movement, not a novelty. Skipped entirely for coarse pointers (a phone can't
 * hover, and the transform would only fight the scroll) and for reduced motion.
 */
export const tilt = (node: HTMLElement, max = 6) => {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || still) return;

  let raf = 0;
  let leaveTimer = 0;

  const apply = (rx: number, ry: number, lift: number) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      node.style.transform =
        `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${lift}px)`;
    });
  };

  const onMove = (e: PointerEvent) => {
    // `.reveal` animates transform for 700ms on entry. Tilting during that
    // window would replace the in-flight transform and snap the card.
    if (node.classList.contains('reveal') && !node.classList.contains('in')) return;

    // `transition: none`, not '': clearing the inline value would hand control
    // back to `.reveal`'s class rule, which eases transform over 700ms and
    // makes the tilt lag a third of a second behind the pointer.
    node.style.transition = 'none';
    const r = node.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    apply(-py * max, px * max, -2);
  };

  const onLeave = () => {
    cancelAnimationFrame(raf);
    // Ease back to flat, then hand the transition property back to CSS.
    node.style.transition = 'transform 220ms var(--ease-brand)';
    node.style.transform = '';
    clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(() => {
      node.style.transition = '';
    }, 260);
  };

  node.style.transformStyle = 'preserve-3d';
  node.addEventListener('pointermove', onMove);
  node.addEventListener('pointerleave', onLeave);
  // A touch-drag on a hybrid laptop reports as a fine pointer; without this an
  // interrupted gesture leaves the card tilted until the next pointer event.
  node.addEventListener('pointercancel', onLeave);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      clearTimeout(leaveTimer);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      node.removeEventListener('pointercancel', onLeave);
    }
  };
};
