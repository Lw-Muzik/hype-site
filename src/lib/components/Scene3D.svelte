<script lang="ts">
  import { onMount } from 'svelte';
  import Spectrum from '$lib/components/Spectrum.svelte';

  /**
   * The hero centrepiece: the 31-band equalizer as a real object in space.
   *
   * Deliberately flat-shaded — no gradients, no environment maps, no bloom.
   * The depth comes from geometry and a single key light, so it reads as an
   * instrument rather than a graphic. three.js is imported dynamically, so a
   * visitor who never sees it (reduced motion, no WebGL) never downloads it.
   */
  let { class: klass = '' }: { class?: string } = $props();

  let host: HTMLDivElement;
  /** Falls back to the flat 2D spectrum when WebGL isn't available. */
  let failed = $state(false);

  onMount(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      let THREE: typeof import('three');
      try {
        THREE = await import('three');
      } catch {
        failed = true;
        return;
      }
      if (cancelled) return;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        failed = true;
        return;
      }

      const BANDS = 31;
      const ROWS = 7;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 6.6, 15.4);
      camera.lookAt(0, 0.6, 0);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearAlpha(0);
      host.appendChild(renderer.domElement);
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';

      // One key light plus a dim fill: enough to separate the faces of a box
      // without inventing a colour ramp across them.
      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 1.5);
      key.position.set(4, 9, 6);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xffca42, 0.5);
      rim.position.set(-6, 3, -4);
      scene.add(rim);

      const geometry = new THREE.BoxGeometry(0.44, 1, 0.44);
      const material = new THREE.MeshLambertMaterial({ color: 0xffca42 });
      const backing = new THREE.MeshLambertMaterial({ color: 0x2b303c });

      // Front row is the live band; the rows behind it are its history, so the
      // object shows the signal moving through time as well as frequency. The
      // two meshes are sized to exactly the instances they use — an unwritten
      // instance keeps an identity matrix and would draw a stray box at 0,0,0.
      const bars = new THREE.InstancedMesh(geometry, material, BANDS);
      const backRows = new THREE.InstancedMesh(geometry, backing, BANDS * (ROWS - 1));

      const dummy = new THREE.Object3D();
      const phases = Array.from({ length: BANDS }, (_, i) => i * 0.55);
      const heights = Array.from({ length: ROWS }, () => new Float32Array(BANDS));

      const group = new THREE.Group();
      group.add(bars, backRows);
      scene.add(group);

      let pointerX = 0;
      let pointerY = 0;
      const onPointer = (e: PointerEvent) => {
        pointerX = (e.clientX / window.innerWidth) * 2 - 1;
        pointerY = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener('pointermove', onPointer, { passive: true });

      const resize = () => {
        const r = host.getBoundingClientRect();
        const w = Math.max(1, r.width);
        const h = Math.max(1, r.height);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      /** Layered sines — the same shape the 2D spectrum draws. */
      const sample = (i: number, t: number) => {
        const p = phases[i];
        const a = Math.sin(t * 0.0016 + p) * 0.5 + 0.5;
        const b = Math.sin(t * 0.0041 + p * 1.7) * 0.5 + 0.5;
        const c = Math.sin(t * 0.0009 + p * 0.6) * 0.5 + 0.5;
        const centre = 1 - Math.abs(i / (BANDS - 1) - 0.5) * 1.15;
        return (a * 0.5 + b * 0.3 + c * 0.2) * (0.3 + 0.7 * Math.max(0, centre));
      };

      let last = 0;
      const write = (t: number) => {
        // Shift history back one row roughly 12×/second, so the wave visibly
        // travels away from the viewer instead of shimmering in place.
        if (t - last > 80) {
          last = t;
          for (let r = ROWS - 1; r > 0; r--) heights[r].set(heights[r - 1]);
          for (let i = 0; i < BANDS; i++) heights[0][i] = sample(i, t);
        }

        for (let r = 0; r < ROWS; r++) {
          for (let i = 0; i < BANDS; i++) {
            const v = Math.max(0.04, heights[r][i]);
            const x = (i - (BANDS - 1) / 2) * 0.5;
            const z = -r * 0.62;
            dummy.position.set(x, (v * 4) / 2, z);
            dummy.scale.set(1, v * 4, 1);
            dummy.updateMatrix();
            if (r === 0) bars.setMatrixAt(i, dummy.matrix);
            else backRows.setMatrixAt((r - 1) * BANDS + i, dummy.matrix);
          }
        }
        bars.instanceMatrix.needsUpdate = true;
        backRows.instanceMatrix.needsUpdate = true;
      };

      let raf = 0;
      const frame = (t: number) => {
        write(t);
        // A slow drift plus a little parallax — the object answers the pointer
        // without chasing it.
        group.rotation.y = Math.sin(t * 0.00012) * 0.14 + pointerX * 0.12;
        group.rotation.x = -0.04 + pointerY * 0.05;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };

      if (reduce) {
        // One static frame: the shape, none of the motion.
        for (let r = 0; r < ROWS; r++)
          for (let i = 0; i < BANDS; i++) heights[r][i] = sample(i, 1200 + r * 90);
        write(1e9);
        renderer.render(scene, camera);
      } else {
        raf = requestAnimationFrame(frame);
      }

      dispose = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener('pointermove', onPointer);
        geometry.dispose();
        material.dispose();
        backing.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      cancelled = true;
      dispose?.();
    };
  });
</script>

{#if failed}
  <Spectrum class={klass} />
{/if}
<div bind:this={host} class="{klass} {failed ? 'hidden' : ''}" aria-hidden="true"></div>
