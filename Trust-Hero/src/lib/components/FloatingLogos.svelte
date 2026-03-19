<script lang="ts">
	import { computePosition, offset, shift } from '@floating-ui/dom';

	type LogoConfig = {
		id: string;
		xFrac: number;
		yFrac: number;
		animDelay: number;
		animDuration: number;
		animName: string;
		opacity: number;
		parallaxFactor: number;
		scale: number;
	};

	let { containerEl }: { containerEl: HTMLElement | null } = $props();

	const logos: LogoConfig[] = [
		{
			id: 'visa',
			xFrac: 0.07,
			yFrac: 0.22,
			animDelay: 0,
			animDuration: 6.4,
			animName: 'float-up',
			opacity: 0.14,
			parallaxFactor: 0.8,
			scale: 1
		},
		{
			id: 'mastercard',
			xFrac: 0.86,
			yFrac: 0.16,
			animDelay: 1.3,
			animDuration: 7.2,
			animName: 'float-down',
			opacity: 0.12,
			parallaxFactor: 1.2,
			scale: 1
		},
		{
			id: 'stripe',
			xFrac: 0.76,
			yFrac: 0.62,
			animDelay: 0.7,
			animDuration: 8.1,
			animName: 'float-drift',
			opacity: 0.14,
			parallaxFactor: 0.6,
			scale: 1
		},
		{
			id: 'paypal',
			xFrac: 0.04,
			yFrac: 0.63,
			animDelay: 1.9,
			animDuration: 6.8,
			animName: 'float-up',
			opacity: 0.11,
			parallaxFactor: 1.0,
			scale: 1
		},
		{
			id: 'coinbase',
			xFrac: 0.88,
			yFrac: 0.44,
			animDelay: 0.4,
			animDuration: 7.6,
			animName: 'float-down',
			opacity: 0.12,
			parallaxFactor: 1.4,
			scale: 1
		},
		{
			id: 'revolut',
			xFrac: 0.42,
			yFrac: 0.84,
			animDelay: 2.2,
			animDuration: 9.0,
			animName: 'float-drift',
			opacity: 0.1,
			parallaxFactor: 0.7,
			scale: 1
		}
	];

	// Container for querying logo children
	let wrapperEl: HTMLElement | null = $state(null);

	// Floating UI computed positions (pixel, container-relative)
	let positions: Array<{ left: number; top: number } | null> = $state(
		new Array(logos.length).fill(null)
	);

	// Whether Floating UI has finished — used to fade logos in
	let ready = $state(false);

	// Mouse parallax state (-1 to 1 range)
	let mouseX = $state(0);
	let mouseY = $state(0);

	async function computeLogoPositions(container: HTMLElement) {
		const wrapper = wrapperEl;
		if (!wrapper) return;

		const logoEls = Array.from(wrapper.querySelectorAll<HTMLElement>('.floating-logo-outer'));
		if (logoEls.length === 0) return;

		const containerRect = container.getBoundingClientRect();

		const newPositions = await Promise.all(
			logos.map(async (logo, i) => {
				const el = logoEls[i];
				if (!el) return { left: logo.xFrac * containerRect.width, top: logo.yFrac * containerRect.height };

				// Virtual reference point at (xFrac, yFrac) of the container, in viewport coords
				const refX = containerRect.left + containerRect.width * logo.xFrac;
				const refY = containerRect.top + containerRect.height * logo.yFrac;

				const virtualRef = {
					getBoundingClientRect(): DOMRect {
						return {
							x: refX,
							y: refY,
							left: refX,
							top: refY,
							right: refX,
							bottom: refY,
							width: 0,
							height: 0,
							toJSON() {
								return this;
							}
						} as DOMRect;
					}
				};

				try {
					const { x, y } = await computePosition(virtualRef, el, {
						strategy: 'fixed',
						placement: 'bottom-start',
						middleware: [
							offset(0),
							// shift() keeps logos within the hero container, preventing overflow
							shift({ padding: 28, boundary: container })
						]
					});

					// Convert viewport-fixed coords → container-relative pixel coords
					return {
						left: x - containerRect.left,
						top: y - containerRect.top
					};
				} catch {
					return {
						left: logo.xFrac * containerRect.width,
						top: logo.yFrac * containerRect.height
					};
				}
			})
		);

		positions = newPositions;
		ready = true;
	}

	$effect(() => {
		const container = containerEl;
		if (!container) return;

		// Wait one frame for logo elements to paint before measuring
		const rafId = requestAnimationFrame(() => computeLogoPositions(container));

		const resizeObserver = new ResizeObserver(() => computeLogoPositions(container));
		resizeObserver.observe(container);

		function handleMouseMove(e: MouseEvent) {
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
			mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
		}

		container.addEventListener('mousemove', handleMouseMove, { passive: true });

		return () => {
			cancelAnimationFrame(rafId);
			resizeObserver.disconnect();
			container.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<div
	bind:this={wrapperEl}
	class="pointer-events-none absolute inset-0 overflow-hidden select-none"
	aria-hidden="true"
>
	{#each logos as logo, i}
		<!-- Float animation wrapper -->
		<div
			class="floating-logo-outer absolute"
			style="
				left: {positions[i] ? positions[i]!.left + 'px' : logo.xFrac * 100 + '%'};
				top: {positions[i] ? positions[i]!.top + 'px' : logo.yFrac * 100 + '%'};
				animation: {logo.animName} {logo.animDuration}s ease-in-out {logo.animDelay}s infinite;
				will-change: transform;
			"
		>
			<!-- Parallax + centering + fade wrapper -->
			<div
				style="
					transform: translate(-50%, -50%) translate(
						{mouseX * -12 * logo.parallaxFactor}px,
						{mouseY * -8 * logo.parallaxFactor}px
					);
					transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.8s ease;
					opacity: {ready ? logo.opacity : 0};
					filter: blur(0.4px);
					will-change: transform, opacity;
				"
			>
				{#if logo.id === 'visa'}
					<svg
						width="76"
						height="28"
						viewBox="0 0 76 28"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<text
							x="0"
							y="23"
							font-family="Times New Roman, Georgia, serif"
							font-size="28"
							font-weight="700"
							font-style="italic"
							fill="white"
							letter-spacing="2"
						>
							VISA
						</text>
					</svg>
				{:else if logo.id === 'mastercard'}
					<svg
						width="68"
						height="44"
						viewBox="0 0 68 44"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="24" cy="22" r="20" fill="none" stroke="white" stroke-width="1.5" />
						<circle cx="44" cy="22" r="20" fill="none" stroke="white" stroke-width="1.5" />
						<path
							d="M34 8.4a20 20 0 0 1 0 27.2A20 20 0 0 1 34 8.4z"
							fill="white"
							opacity="0.08"
						/>
					</svg>
				{:else if logo.id === 'stripe'}
					<svg
						width="88"
						height="34"
						viewBox="0 0 88 34"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<text
							x="0"
							y="27"
							font-family="system-ui, -apple-system, sans-serif"
							font-size="26"
							font-weight="500"
							fill="white"
							letter-spacing="-0.5"
						>
							stripe
						</text>
					</svg>
				{:else if logo.id === 'paypal'}
					<svg
						width="92"
						height="30"
						viewBox="0 0 92 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<!-- P mark left -->
						<text
							x="0"
							y="24"
							font-family="system-ui, -apple-system, sans-serif"
							font-size="22"
							font-weight="700"
							fill="white"
							opacity="0.5"
						>
							P
						</text>
						<!-- P mark offset -->
						<text
							x="8"
							y="28"
							font-family="system-ui, -apple-system, sans-serif"
							font-size="22"
							font-weight="700"
							fill="white"
							opacity="0.8"
						>
							P
						</text>
						<text
							x="26"
							y="26"
							font-family="system-ui, -apple-system, sans-serif"
							font-size="19"
							font-weight="600"
							fill="white"
						>
							ayPal
						</text>
					</svg>
				{:else if logo.id === 'coinbase'}
					<svg
						width="44"
						height="44"
						viewBox="0 0 44 44"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="22" cy="22" r="20.5" stroke="white" stroke-width="1.5" />
						<rect x="11" y="17" width="22" height="10" rx="3" fill="white" opacity="0.9" />
						<rect x="15" y="17" width="14" height="10" rx="0" fill="#0b0f1a" opacity="0.7" />
					</svg>
				{:else if logo.id === 'revolut'}
					<svg
						width="100"
						height="30"
						viewBox="0 0 100 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<!-- R mark -->
						<path
							d="M4 6h9a5 5 0 0 1 0 10H4V6zM4 16l5 8"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							fill="none"
						/>
						<text
							x="22"
							y="22"
							font-family="system-ui, -apple-system, sans-serif"
							font-size="18"
							font-weight="600"
							fill="white"
							letter-spacing="0.3"
						>
							evolut
						</text>
					</svg>
				{/if}
			</div>
		</div>
	{/each}
</div>
