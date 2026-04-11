<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';

	let { isOpen = false, onclick }: { isOpen: boolean; onclick: () => void } = $props();
</script>

<button
	class="command-button"
	class:active={isOpen}
	onclick={onclick}
>
	<span class="shimmer-border"></span>
	<span class="button-content">
		<span class="label">Manage Funds</span>
		<span class="chevron" class:rotated={isOpen}>
			<ChevronDown size={16} strokeWidth={2} />
		</span>
	</span>
</button>

<style>
	.command-button {
		position: relative;
		padding: 14px 32px;
		border: none;
		border-radius: var(--radius-pill);
		background: transparent;
		cursor: pointer;
		outline: none;
		transition: transform 0.4s var(--transition-smooth), box-shadow 0.4s var(--transition-smooth);
		z-index: 10;
	}

	.command-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(200, 162, 74, 0.12);
	}

	.command-button:active {
		transform: translateY(0);
	}

	.command-button.active {
		transform: translateY(0);
		box-shadow: 0 4px 20px rgba(200, 162, 74, 0.08);
	}

	.shimmer-border {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-pill);
		padding: 1px;
		background: linear-gradient(
			135deg,
			var(--gold-border) 0%,
			var(--gold) 25%,
			var(--gold-border) 50%,
			var(--gold) 75%,
			var(--gold-border) 100%
		);
		background-size: 300% 300%;
		animation: shimmer 3.5s ease-in-out infinite;
		-webkit-mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		mask:
			linear-gradient(#fff 0 0) content-box,
			linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
	}

	.button-content {
		position: relative;
		display: flex;
		align-items: center;
		gap: 10px;
		z-index: 1;
	}

	.label {
		font-family: var(--font);
		font-size: 14px;
		font-weight: 500;
		letter-spacing: 0.5px;
		color: var(--gold);
		text-transform: uppercase;
	}

	.chevron {
		display: flex;
		color: var(--gold);
		transition: transform 0.4s var(--transition-smooth);
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	@keyframes shimmer {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}
</style>
