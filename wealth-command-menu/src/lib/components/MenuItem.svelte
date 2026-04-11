<script lang="ts">
	import { Send, TrendingUp, ArrowLeftRight, BarChart3 } from 'lucide-svelte';
	import Sparkline from './Sparkline.svelte';

	let {
		item,
		index = 0,
		onclick
	}: {
		item: {
			id: string;
			label: string;
			meta: string;
			icon: string;
			live?: boolean;
			sparkline?: boolean;
		};
		index?: number;
		onclick: () => void;
	} = $props();

	let hovered = $state(false);

	const icons: Record<string, typeof Send> = {
		send: Send,
		invest: TrendingUp,
		convert: ArrowLeftRight,
		analytics: BarChart3
	};

	const IconComponent = $derived(icons[item.icon]);
	const staggerDelay = $derived(index * 80);
</script>

<button
	class="menu-item"
	class:hovered
	style="animation-delay: {staggerDelay}ms"
	onclick={onclick}
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
>
	<span class="hover-bar"></span>

	<span class="item-left">
		<span class="icon-wrap">
			{#if IconComponent}
				<IconComponent size={18} strokeWidth={1.5} />
			{/if}
		</span>
		<span class="item-label">{item.label}</span>
	</span>

	<span class="item-right">
		{#if item.sparkline}
			<Sparkline width={56} height={18} color="var(--cyan)" />
		{/if}
		{#if item.live}
			<span class="live-dot"></span>
		{/if}
		<span class="item-meta" class:positive={item.meta.startsWith('+')}>
			{item.meta}
		</span>
	</span>
</button>

<style>
	.menu-item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 16px 20px;
		border: none;
		background: transparent;
		cursor: pointer;
		outline: none;
		font-family: var(--font);
		transition: transform 0.3s var(--transition-smooth), background 0.3s ease;
		animation: itemFadeIn 0.5s var(--transition-decel) both;
		overflow: hidden;
	}

	.menu-item:hover {
		transform: translateY(-1px);
		background: var(--surface-hover);
	}

	.hover-bar {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 3px;
		background: var(--gold);
		border-radius: 0 2px 2px 0;
		transform: scaleY(0);
		transition: transform 0.35s var(--transition-smooth);
		box-shadow: 0 0 12px var(--gold-glow);
	}

	.menu-item:hover .hover-bar {
		transform: scaleY(1);
	}

	.item-left {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.icon-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-sm);
		background: var(--gold-dim);
		color: var(--gold);
		transition: background 0.3s, box-shadow 0.3s;
	}

	.menu-item:hover .icon-wrap {
		background: rgba(200, 162, 74, 0.2);
		box-shadow: 0 0 16px var(--gold-dim);
	}

	.item-label {
		font-size: 14px;
		font-weight: 500;
		color: var(--text-primary);
		letter-spacing: 0.3px;
	}

	.item-right {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.item-meta {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-secondary);
		font-variant-numeric: tabular-nums;
		transition: color 0.3s;
	}

	.item-meta.positive {
		color: var(--cyan);
	}

	.menu-item:hover .item-meta {
		color: var(--gold-light);
	}

	.menu-item:hover .item-meta.positive {
		color: var(--cyan);
	}

	.live-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--cyan);
		box-shadow: 0 0 8px var(--cyan-glow);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--cyan-glow); }
		50% { opacity: 0.5; box-shadow: 0 0 16px var(--cyan-glow); }
	}

	@keyframes itemFadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
