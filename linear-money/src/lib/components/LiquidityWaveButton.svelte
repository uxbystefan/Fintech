<!--
  LiquidityWaveButton.svelte
  ─────────────────────────────────────────────────────────────
  Premium fintech "Liquidity Wave" button.
  States: idle → melting → flowing → reforming → success

  Key design decision: a SINGLE persistent element morphs through
  every phase — no DOM swaps — so all transitions are seamless.
  Uses Svelte 5 runes + tweened stores for smooth, controlled motion.
-->
<script>
	import { tweened } from 'svelte/motion';
	import { cubicInOut, cubicOut } from 'svelte/easing';

	/* ── custom easing: slow-start, long sustain, soft land ── */
	/** @param {number} t */
	function easeFlow(t) {
		// custom bezier-like: very slow out of the gate, sustained middle, gentle stop
		return t < 0.15
			? t * t * 22.22       // slow start  (quadratic in)
			: t < 0.85
				? 0.5 + (t - 0.5) * 1.0  // linear sustain
				: 1 - (1 - t) * (1 - t) * 22.22; // soft land (quadratic out)
	}

	/* ── state machine ─────────────────────────────────────── */
	/** @type {'idle' | 'melting' | 'flowing' | 'reforming' | 'success'} */
	let state = $state('idle');

	/* ── tweened values ────────────────────────────────────── */

	// Button press / scale
	const scaleX = tweened(1, { duration: 280, easing: cubicOut });
	const scaleY = tweened(1, { duration: 280, easing: cubicOut });

	// Text opacity (idle label)
	const textOpacity = tweened(1, { duration: 300, easing: cubicInOut });

	// Clip-path wave deformation  (0 = rectangle, 1 = full melt)
	const meltAmount = tweened(0, { duration: 900, easing: cubicInOut });

	// Width morph: 260px (button) → viewport width → back to 260px
	// Expressed as a multiplier of viewport width (0..1)
	const widthRatio = tweened(0, { duration: 1800, easing: easeFlow });

	// Height morph: 60px → 8px (strip) → 60px
	const heightPx = tweened(60, { duration: 800, easing: cubicInOut });

	// Border radius morph: 50px → 4px → 50px
	const radius = tweened(50, { duration: 800, easing: cubicInOut });

	// Gradient scroll position for flowing gold (0 → 2, loops through gradient)
	const gradientShift = tweened(0, { duration: 2000, easing: easeFlow });

	// Border opacity (fades during flow)
	const borderOpacity = tweened(0.4, { duration: 400, easing: cubicInOut });

	// Success text opacity
	const successOpacity = tweened(0, { duration: 600, easing: cubicInOut });

	// Glow pulse (0 → 1 → 0)
	const glowIntensity = tweened(0, { duration: 500, easing: cubicOut });

	// Strip glow during flow phase
	const stripGlow = tweened(0, { duration: 600, easing: cubicInOut });

	/* ── derived clip-path for liquid deformation ──────────── */
	// 20 control points along the bottom edge for a smooth sinusoidal wave
	let clipPath = $derived.by(() => {
		const m = $meltAmount;
		if (m < 0.01) return 'none';

		const points = 20;
		let path = '0% 0%, 100% 0%, '; // top edge

		// Right edge down to wavy bottom
		const segments = [];
		for (let i = points; i >= 0; i--) {
			const x = (i / points) * 100;
			// Two superimposed sine waves for organic look
			const wave1 = Math.sin((i / points) * Math.PI * 3) * 6 * m;
			const wave2 = Math.sin((i / points) * Math.PI * 5 + 1.2) * 3 * m;
			const droop = Math.sin((i / points) * Math.PI) * 8 * m; // center droops more
			const y = 100 + wave1 + wave2 + droop;
			segments.push(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
		}

		return `polygon(${path}${segments.join(', ')})`;
	});

	/* ── computed inline styles ────────────────────────────── */
	let morphStyle = $derived.by(() => {
		const w = $widthRatio;
		const h = $heightPx;
		const r = $radius;
		const sx = $scaleX;
		const sy = $scaleY;
		const gs = $gradientShift;
		const bo = $borderOpacity;
		const glow = $glowIntensity;
		const sg = $stripGlow;

		// Width: interpolate between 260px (button) and ~95vw
		const widthVal = w === 0 ? '260px' : `calc(260px + ${w} * (95vw - 260px))`;

		let boxShadow = 'none';
		if (sg > 0) {
			// Strip glow during flow
			boxShadow = `0 0 ${sg * 20}px ${sg * 6}px rgba(255, 215, 0, ${sg * 0.3}), 0 0 ${sg * 60}px ${sg * 12}px rgba(198, 168, 90, ${sg * 0.08})`;
		}
		if (glow > 0) {
			// Success glow pulse
			boxShadow = `0 0 ${glow * 35}px ${glow * 10}px rgba(255, 215, 0, ${glow * 0.4}), 0 0 ${glow * 60}px ${glow * 16}px rgba(198, 168, 90, ${glow * 0.15})`;
		}

		const clipStr = clipPath !== 'none' ? `clip-path: ${clipPath};` : '';

		return `
			width: ${widthVal};
			height: ${h}px;
			border-radius: ${r}px;
			transform: scaleX(${sx}) scaleY(${sy});
			border-color: rgba(198, 168, 90, ${bo});
			background-position: ${gs * 100}% 50%;
			box-shadow: ${boxShadow};
			${clipStr}
		`;
	});

	/* ── animation orchestrator ────────────────────────────── */
	async function handleClick() {
		if (state !== 'idle') return;

		/* Phase 1 — CLICK: subtle compress + fade text */
		state = 'melting';
		scaleX.set(1.02, { duration: 120, easing: cubicOut });
		scaleY.set(0.96, { duration: 120, easing: cubicOut });
		textOpacity.set(0, { duration: 280, easing: cubicInOut });

		// hold the press briefly, then release
		await new Promise((r) => setTimeout(r, 150));
		scaleX.set(1, { duration: 250, easing: cubicInOut });
		await scaleY.set(1, { duration: 250, easing: cubicInOut });

		/* Phase 2 — MELT: organic wave deformation on bottom edge */
		await meltAmount.set(1);

		// brief hold at peak deformation for visual weight
		await new Promise((r) => setTimeout(r, 120));

		/* Phase 3 — FLOW: morph into thin strip, expand across viewport */
		state = 'flowing';

		// Smooth out the wave while collapsing height
		meltAmount.set(0, { duration: 600, easing: cubicInOut });
		heightPx.set(8, { duration: 700, easing: cubicInOut });
		radius.set(4, { duration: 700, easing: cubicInOut });
		borderOpacity.set(0, { duration: 400, easing: cubicInOut });
		stripGlow.set(1, { duration: 800, easing: cubicOut });

		// Small delay so height collapse starts before width expands (stagger)
		await new Promise((r) => setTimeout(r, 200));

		// Expand width + scroll gradient simultaneously
		widthRatio.set(1, { duration: 1800, easing: easeFlow });
		await gradientShift.set(2, { duration: 2000, easing: easeFlow });

		// Fade strip glow near end of flow
		await stripGlow.set(0, { duration: 400, easing: cubicInOut });

		/* Phase 4 — REFORM: contract back into pill shape */
		state = 'reforming';

		// Bring all dimensions back smoothly (staggered for organic feel)
		heightPx.set(60, { duration: 900, easing: cubicInOut });
		radius.set(50, { duration: 900, easing: cubicInOut });
		borderOpacity.set(0.5, { duration: 600, easing: cubicInOut });

		// Width contracts slightly after height starts growing
		await new Promise((r) => setTimeout(r, 150));
		await widthRatio.set(0, { duration: 1000, easing: cubicInOut });

		/* Phase 5 — SUCCESS: show confirmation */
		state = 'success';
		await successOpacity.set(1);

		// Single glow pulse — fades in fast, fades out slow
		await glowIntensity.set(1, { duration: 400, easing: cubicOut });
		await glowIntensity.set(0, { duration: 1200, easing: cubicInOut });

		// Hold success state, then auto-reset
		await new Promise((r) => setTimeout(r, 1800));
		await successOpacity.set(0, { duration: 500, easing: cubicInOut });
		reset();
	}

	/* ── reset (for demo) ─────────────────────────────────── */
	function reset() {
		state = 'idle';
		scaleX.set(1, { duration: 0 });
		scaleY.set(1, { duration: 0 });
		textOpacity.set(1, { duration: 0 });
		meltAmount.set(0, { duration: 0 });
		widthRatio.set(0, { duration: 0 });
		heightPx.set(60, { duration: 0 });
		radius.set(50, { duration: 0 });
		gradientShift.set(0, { duration: 0 });
		borderOpacity.set(0.4, { duration: 0 });
		successOpacity.set(0, { duration: 0 });
		glowIntensity.set(0, { duration: 0 });
		stripGlow.set(0, { duration: 0 });
	}
</script>

<!-- ─────────────────────────  MARKUP  ───────────────────────── -->

<div class="scene">
	<!--
		Single persistent element — morphs through every phase.
		No DOM swaps = no visual discontinuity.
	-->
	<button
		class="liquidity-btn"
		class:success={state === 'success'}
		onclick={handleClick}
		disabled={state !== 'idle'}
		style={morphStyle}
	>
		<!-- Idle text -->
		<span class="btn-text idle-text" style="opacity: {$textOpacity};">
			Transfer $5,000
		</span>

		<!-- Success text -->
		<span class="btn-text success-text" style="opacity: {$successOpacity};">
			Sent ✓
		</span>

		<!-- Subtle shimmer overlay (idle only) -->
		{#if state === 'idle'}
			<div class="shimmer"></div>
		{/if}
	</button>

	<!-- Subtext after success -->
	{#if state === 'success'}
		<p class="subtext" style="opacity: {$successOpacity};">
			Transfer complete
		</p>
	{/if}


</div>

<!-- ─────────────────────────  STYLES  ───────────────────────── -->

<style>
	/* ── Scene container ──────────────────────────────────── */
	.scene {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #000000;
		position: relative;
		overflow: hidden;
	}

	/* ── The button / morph element ────────────────────────── */
	.liquidity-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;

		/* Initial dimensions (overridden by inline style during animation) */
		width: 260px;
		height: 60px;

		/*
			Rich multi-stop gold gradient — wide background-size allows
			the gradient to scroll during the flow phase.
		*/
		background: linear-gradient(
			90deg,
			#8B7330 0%,
			#B8963A 10%,
			#C6A85A 20%,
			#FFD700 35%,
			#E8C84A 45%,
			#C6A85A 55%,
			#FFD700 65%,
			#D4AF37 75%,
			#C6A85A 85%,
			#B8963A 92%,
			#8B7330 100%
		);
		background-size: 300% 100%;
		background-position: 0% 50%;

		/* Subtle gold border */
		border: 1px solid rgba(198, 168, 90, 0.4);
		border-radius: 50px;

		/* Typography */
		color: #0B0B0B;
		font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 16px;
		font-weight: 600;
		letter-spacing: 0.06em;

		cursor: pointer;
		overflow: hidden;
		transform-origin: center center;
		will-change: transform, clip-path, width, height, border-radius, box-shadow, background-position;
	}

	.liquidity-btn:hover:not(:disabled) {
		box-shadow: 0 0 24px 3px rgba(255, 215, 0, 0.12);
	}

	.liquidity-btn:disabled {
		cursor: default;
	}

	/* ── Success state — slightly muted gold ──────────────── */
	.liquidity-btn.success {
		background: linear-gradient(135deg, #9A7B2E 0%, #B8963A 40%, #C6A85A 60%, #9A7B2E 100%);
		background-size: 100% 100%;
	}

	/* ── Button text ──────────────────────────────────────── */
	.btn-text {
		position: absolute;
		white-space: nowrap;
		pointer-events: none;
		will-change: opacity;
		transition: none; /* controlled entirely by tweened stores */
	}

	.idle-text {
		font-weight: 600;
		letter-spacing: 0.06em;
	}

	.success-text {
		font-weight: 600;
		letter-spacing: 0.08em;
	}

	/* ── Shimmer overlay (very subtle, almost invisible) ──── */
	.shimmer {
		position: absolute;
		top: 0;
		left: -100%;
		width: 50%;
		height: 100%;
		background: linear-gradient(
			105deg,
			transparent 35%,
			rgba(255, 255, 255, 0.05) 50%,
			transparent 65%
		);
		animation: shimmer 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		pointer-events: none;
	}

	@keyframes shimmer {
		0%, 100% {
			left: -100%;
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		50% {
			left: 150%;
		}
	}

	/* ── Subtext ──────────────────────────────────────────── */
	.subtext {
		margin-top: 16px;
		font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		font-size: 13px;
		font-weight: 400;
		letter-spacing: 0.04em;
		color: rgba(198, 168, 90, 0.55);
		will-change: opacity;
	}


</style>
