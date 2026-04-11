<script lang="ts">
	import MenuItem from './MenuItem.svelte';
	import TransactionView from './TransactionView.svelte';

	let { isOpen = false, onclose }: { isOpen: boolean; onclose: () => void } = $props();

	let view = $state<'menu' | 'transaction'>('menu');

	const items = [
		{ id: 'send', label: 'Send Money', meta: '$2,450 ready', icon: 'send' },
		{ id: 'invest', label: 'Invest', meta: '+2.4% today', icon: 'invest', sparkline: true },
		{ id: 'convert', label: 'Convert Currency', meta: 'USD → EUR', icon: 'convert' },
		{ id: 'analytics', label: 'Analytics', meta: 'Live', icon: 'analytics', live: true }
	];

	function handleItemClick(id: string) {
		if (id === 'send') {
			view = 'transaction';
		}
	}

	function handleBack() {
		view = 'menu';
	}

	// Reset view when panel closes
	$effect(() => {
		if (!isOpen) {
			// Small delay so animation finishes before resetting
			const t = setTimeout(() => { view = 'menu'; }, 400);
			return () => clearTimeout(t);
		}
	});
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={onclose} onkeydown={(e) => e.key === 'Escape' && onclose()}></div>
{/if}

<div class="panel-wrapper" class:open={isOpen}>
	<div class="dropdown-panel" class:expanded={view === 'transaction'}>
		<!-- Gold accent lines -->
		<div class="gold-line top" class:visible={isOpen}></div>

		{#if view === 'menu'}
			<div class="menu-items">
				{#each items as item, i (item.id)}
					<MenuItem
						{item}
						index={i}
						onclick={() => handleItemClick(item.id)}
					/>
					{#if i < items.length - 1}
						<div class="divider" style="animation-delay: {(i + 1) * 100 + 200}ms"></div>
					{/if}
				{/each}
			</div>
		{:else}
			<TransactionView onback={handleBack} />
		{/if}

		<div class="gold-line bottom" class:visible={isOpen}></div>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 5;
		animation: backdropIn 0.35s var(--transition-decel) both;
	}

	.panel-wrapper {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		width: 380px;
		pointer-events: none;
		opacity: 0;
		margin-top: 12px;

		/* Panel entrance animation */
		clip-path: inset(0 0 100% 0);
		transition:
			opacity 0.4s var(--transition-decel),
			clip-path 0.55s var(--transition-smooth);
	}

	.panel-wrapper.open {
		pointer-events: auto;
		opacity: 1;
		clip-path: inset(0 0 0% 0);
	}

	.dropdown-panel {
		background: var(--glass-bg);
		backdrop-filter: blur(var(--backdrop-blur));
		-webkit-backdrop-filter: blur(var(--backdrop-blur));
		border: 1px solid var(--glass-border);
		border-radius: var(--radius-lg);
		box-shadow:
			0 24px 80px rgba(0, 0, 0, 0.6),
			0 0 1px rgba(200, 162, 74, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.03);
		overflow: hidden;
		transition: max-height 0.5s var(--transition-smooth);
		max-height: 400px;
	}

	.dropdown-panel.expanded {
		max-height: 500px;
	}

	.gold-line {
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			var(--gold-border) 20%,
			var(--gold) 50%,
			var(--gold-border) 80%,
			transparent 100%
		);
		opacity: 0;
		transform: scaleX(0);
		transition: transform 0.6s var(--transition-smooth), opacity 0.4s;
	}

	.gold-line.visible {
		opacity: 0.6;
		transform: scaleX(1);
	}

	.gold-line.top {
		transition-delay: 0.15s;
	}

	.gold-line.bottom {
		transition-delay: 0.4s;
	}

	.menu-items {
		padding: 8px 0;
	}

	.divider {
		height: 1px;
		margin: 0 20px;
		background: linear-gradient(
			90deg,
			transparent,
			var(--glass-border) 50%,
			transparent
		);
		animation: dividerIn 0.4s var(--transition-decel) both;
	}

	@keyframes backdropIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes dividerIn {
		from {
			opacity: 0;
			transform: scaleX(0);
		}
		to {
			opacity: 1;
			transform: scaleX(1);
		}
	}
</style>
