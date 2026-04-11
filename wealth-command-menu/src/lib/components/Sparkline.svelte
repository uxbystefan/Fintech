<script lang="ts">
	import { onMount } from 'svelte';

	let {
		points = [] as number[],
		width = 60,
		height = 20,
		color = 'var(--cyan)'
	}: {
		points?: number[];
		width?: number;
		height?: number;
		color?: string;
	} = $props();

	let animatedPoints = $state<number[]>([]);
	let pathD = $derived(buildPath(animatedPoints));

	function buildPath(pts: number[]): string {
		if (pts.length < 2) return '';
		const stepX = width / (pts.length - 1);
		const min = Math.min(...pts);
		const max = Math.max(...pts);
		const range = max - min || 1;

		let d = '';
		for (let i = 0; i < pts.length; i++) {
			const x = i * stepX;
			const y = height - ((pts[i] - min) / range) * (height - 4) - 2;
			if (i === 0) {
				d += `M ${x} ${y}`;
			} else {
				const prevX = (i - 1) * stepX;
				const prevY = height - ((pts[i - 1] - min) / range) * (height - 4) - 2;
				const cpx1 = prevX + stepX * 0.4;
				const cpx2 = x - stepX * 0.4;
				d += ` C ${cpx1} ${prevY} ${cpx2} ${y} ${x} ${y}`;
			}
		}
		return d;
	}

	onMount(() => {
		animatedPoints = points.length > 0 ? points : [2, 5, 3, 8, 6, 9, 7, 11, 10, 13];

		const interval = setInterval(() => {
			animatedPoints = [
				...animatedPoints.slice(1),
				animatedPoints[animatedPoints.length - 1] + (Math.random() - 0.35) * 2
			];
		}, 1200);

		return () => clearInterval(interval);
	});
</script>

<svg
	{width}
	{height}
	viewBox="0 0 {width} {height}"
	class="sparkline"
>
	<defs>
		<linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0%" stop-color={color} stop-opacity="0.1" />
			<stop offset="100%" stop-color={color} stop-opacity="0.6" />
		</linearGradient>
	</defs>
	{#if pathD}
		<path
			d={pathD}
			fill="none"
			stroke="url(#sparkGrad)"
			stroke-width="1.5"
			stroke-linecap="round"
		/>
		<path
			d={pathD}
			fill="none"
			stroke={color}
			stroke-width="1.5"
			stroke-linecap="round"
			opacity="0.5"
			filter="blur(2px)"
		/>
	{/if}
</svg>

<style>
	.sparkline {
		overflow: visible;
		flex-shrink: 0;
	}
</style>
