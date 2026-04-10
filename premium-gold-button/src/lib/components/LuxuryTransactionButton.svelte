<script lang="ts">
	import { spring } from 'svelte/motion';
	import { Lock, LoaderCircle, CircleCheck } from '@lucide/svelte';

	// ─── State Machine ───────────────────────────────────────────────────
	// The button cycles through four states:
	//   idle → hover → processing → success
	// Each state maps to distinct visual + text treatments.
	type ButtonState = 'idle' | 'hover' | 'processing' | 'success';
	let state: ButtonState = $state('idle');

	// ─── Spring-driven scale for press / release ─────────────────────────
	// Using Svelte spring for a physics-based, premium press effect.
	// Stiffness is low and damping is high → slow, confident settle.
	const scale = spring(1, { stiffness: 0.045, damping: 0.4 });

	// ─── Derived label ───────────────────────────────────────────────────
	// Reactive text that maps each state to the correct label.
	let label = $derived.by(() => {
		switch (state) {
			case 'idle':
				return 'Send $';
			case 'hover':
				return 'Send $ → $2,450 • Alex Morgan';
			case 'processing':
				return 'Processing…';
			case 'success':
				return 'Sent ✓';
		}
	});

	// Track whether the success glow pulse has played
	let showSuccessGlow = $state(false);

	// ─── Interaction Handlers ────────────────────────────────────────────

	function handleMouseEnter() {
		if (state === 'idle') {
			state = 'hover';
		}
	}

	function handleMouseLeave() {
		if (state === 'hover') {
			state = 'idle';
		}
	}

	function handlePointerDown() {
		if (state === 'hover' || state === 'idle') {
			// Spring scale down to 0.97 — subtle, confident press
			scale.set(0.97);
		}
	}

	function handlePointerUp() {
		// Spring back to default scale
		scale.set(1);
	}

	async function handleClick() {
		if (state === 'processing' || state === 'success') return;

		// Transition to processing state
		state = 'processing';

		// Simulate an async financial transaction (2-second delay)
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Transition to success state with a single glow pulse
		state = 'success';
		showSuccessGlow = true;

		// Remove glow class after the single pulse completes (~1.2s)
		setTimeout(() => {
			showSuccessGlow = false;
		}, 1800);

		// Reset to idle after displaying success for 3 seconds
		setTimeout(() => {
			state = 'idle';
		}, 3500);
	}
</script>

<!-- ─── Template ──────────────────────────────────────────────────────── -->
<!-- The outer wrapper centres the component and holds the balance subtext. -->
<div class="button-wrapper">
	<button
		class="luxury-btn"
		class:is-hover={state === 'hover'}
		class:is-processing={state === 'processing'}
		class:is-success={state === 'success'}
		class:success-glow={showSuccessGlow}
		style="transform: scale({$scale})"
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		onpointerdown={handlePointerDown}
		onpointerup={handlePointerUp}
		onclick={handleClick}
		disabled={state === 'processing'}
	>
		<!-- Animated border layer (conic-gradient spinner during processing) -->
		<span class="border-glow"></span>

		<!-- Content layer sits above the animated border -->
		<span class="btn-content">
			<!-- Contextual icon from Lucide -->
			{#if state === 'hover'}
				<span class="lock-icon">
					<Lock size={14} strokeWidth={1.8} />
				</span>
			{:else if state === 'processing'}
				<span class="processing-icon">
					<LoaderCircle size={14} strokeWidth={1.8} />
				</span>
			{:else if state === 'success'}
				<span class="success-icon">
					<CircleCheck size={14} strokeWidth={1.8} />
				</span>
			{/if}

			<span class="label">{label}</span>
		</span>
	</button>

	<!-- Balance subtext — only visible in success state -->
	{#if state === 'success'}
		<span class="balance-subtext">New balance: $18,540</span>
	{/if}
</div>

<!-- ─── Styles ────────────────────────────────────────────────────────── -->
<!-- All animation timing, colors, and layout are driven by CSS custom
     properties so the component is easy to theme and reuse.              -->
<style>
	/* ── Custom Properties ──────────────────────────────────────────── */
	:root {
		--clr-black: #0b0b0b;
		--clr-gold-light: #ffd700;
		--clr-gold-mid: #c6a85a;
		--clr-gold-dark: #b8963a;
		--clr-gold-border: rgba(198, 168, 90, 0.25);
		--clr-gold-border-hover: rgba(198, 168, 90, 0.55);
		--clr-gold-border-active: rgba(198, 168, 90, 0.75);
		--clr-success-bg: #121008;

		/* Animation curves — slow, elegant, institutional feel */
		--ease-premium: cubic-bezier(0.25, 0.1, 0.25, 1);
		--duration-slow: 1.2s;
		--duration-shimmer: 4.5s;
		--duration-spin: 3.6s;
	}

	/* ── Wrapper ────────────────────────────────────────────────────── */
	.button-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
	}

	/* ── Button Base ────────────────────────────────────────────────── */
	/* Pill-shaped, matte black, with a thin gold outline.
	   The button is built as a layered stack:
	     1. .border-glow   — animated border / conic spinner
	     2. .btn-content   — inner black face with text                  */
	.luxury-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 220px;
		padding: 0;
		border: none;
		border-radius: 999px;
		background: transparent;
		cursor: pointer;
		outline: none;
		/* Smooth transform origin for scale spring */
		transform-origin: center center;
		transition:
			filter var(--duration-slow) var(--ease-premium),
			box-shadow var(--duration-slow) var(--ease-premium);
		-webkit-tap-highlight-color: transparent;
	}

	.luxury-btn:disabled {
		cursor: wait;
	}

	/* ── Animated Border Layer ──────────────────────────────────────── */
	/* This span fills the button and acts as the visible border.
	   In idle/hover states it's a simple gold outline.
	   In processing state a conic-gradient rotates around it.          */
	.border-glow {
		position: absolute;
		inset: 0;
		border-radius: 999px;
		/* Default idle border — very subtle gold */
		background: var(--clr-gold-border);
		transition: background 1.4s var(--ease-premium);
		z-index: 0;
	}

	/* Hover: brighter border + travelling shimmer via gradient animation */
	.is-hover .border-glow {
		background: linear-gradient(
			90deg,
			var(--clr-gold-border) 0%,
			var(--clr-gold-border-hover) 40%,
			var(--clr-gold-light) 50%,
			var(--clr-gold-border-hover) 60%,
			var(--clr-gold-border) 100%
		);
		background-size: 300% 100%;
		animation: shimmer var(--duration-shimmer) var(--ease-premium) infinite;
	}

	/* Processing: slow breathing pulse — the border gently brightens
	   and dims in a calm, confident rhythm. No spinning or flashy
	   motion; just a quiet gold inhale/exhale that signals activity.    */
	.is-processing .border-glow {
		background: var(--clr-gold-border-hover);
		animation: borderBreathe var(--duration-spin) var(--ease-premium) infinite;
	}

	/* Success: solid subtle gold border */
	.is-success .border-glow {
		background: var(--clr-gold-border-active);
	}

	/* ── Content Layer ──────────────────────────────────────────────── */
	/* Sits 1px inward so the border-glow peeks through as a border.   */
	.btn-content {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		/* 1px inset = the visible "border" thickness */
		margin: 1px;
		padding: 16px 36px;
		border-radius: 999px;
		background: var(--clr-black);
		transition: background var(--duration-slow) var(--ease-premium);
		width: calc(100% - 2px);
	}

	/* Success background tint — very dark gold */
	.is-success .btn-content {
		background: var(--clr-success-bg);
	}

	/* ── Typography ─────────────────────────────────────────────────── */
	/* Gold gradient text via background-clip technique.                */
	.label {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter',
			'Helvetica Neue', Arial, sans-serif;
		font-size: 15px;
		font-weight: 500;
		letter-spacing: 0.04em;
		white-space: nowrap;
		/* Gold gradient fills the text */
		background: linear-gradient(
			135deg,
			var(--clr-gold-mid) 0%,
			var(--clr-gold-light) 50%,
			var(--clr-gold-dark) 100%
		);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		/* Smooth label transitions between states */
		transition: opacity 0.9s var(--ease-premium);
	}

	/* ── Lock Icon ──────────────────────────────────────────────────── */
	/* Fades in on hover with a slight upward shift for elegance.       */
	.lock-icon {
		color: var(--clr-gold-mid);
		opacity: 0;
		transform: translateY(2px);
		animation: fadeInUp 1s var(--ease-premium) forwards;
		flex-shrink: 0;
		display: inline-flex;
	}

	/* ── Processing Icon ────────────────────────────────────────────── */
	/* Slow, calm rotation — not frantic, just quietly working.         */
	.processing-icon {
		color: var(--clr-gold-mid);
		opacity: 0;
		display: inline-flex;
		animation:
			fadeInUp 0.8s var(--ease-premium) forwards,
			slowSpin 3s linear infinite;
		flex-shrink: 0;
	}

	/* ── Success Icon ───────────────────────────────────────────────── */
	.success-icon {
		color: var(--clr-gold-light);
		opacity: 0;
		display: inline-flex;
		animation: fadeInUp 1s var(--ease-premium) forwards;
		flex-shrink: 0;
	}

	/* ── Success Glow Pulse ─────────────────────────────────────────── */
	/* A single soft gold glow that plays once on success,
	   then disappears — never loops.                                   */
	.success-glow {
		animation: glowPulse 1.8s var(--ease-premium) forwards;
	}

	/* ── Balance Subtext ────────────────────────────────────────────── */
	.balance-subtext {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter',
			'Helvetica Neue', Arial, sans-serif;
		font-size: 12px;
		font-weight: 400;
		letter-spacing: 0.06em;
		color: var(--clr-gold-dark);
		opacity: 0;
		animation: fadeInUp 1.2s var(--ease-premium) 0.4s forwards;
	}

	/* ── Keyframes ──────────────────────────────────────────────────── */

	/* Shimmer: a gold highlight sweeps across the border (hover) */
	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* Breathe: border slowly pulses between dim and bright gold */
	@keyframes borderBreathe {
		0%,
		100% {
			background: rgba(198, 168, 90, 0.2);
			box-shadow: inset 0 0 8px rgba(198, 168, 90, 0.05);
		}
		50% {
			background: rgba(198, 168, 90, 0.55);
			box-shadow: inset 0 0 12px rgba(198, 168, 90, 0.12);
		}
	}

	/* Fade-in with slight upward motion (lock icon, subtext) */
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Slow, calm rotation for the processing spinner icon */
	@keyframes slowSpin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Single glow pulse for success confirmation */
	@keyframes glowPulse {
		0% {
			box-shadow: 0 0 0 0 rgba(198, 168, 90, 0);
		}
		40% {
			box-shadow: 0 0 30px 6px rgba(198, 168, 90, 0.2);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(198, 168, 90, 0);
		}
	}
</style>
