<script lang="ts">
	import CommandButton from '$lib/components/CommandButton.svelte';
	import DropdownPanel from '$lib/components/DropdownPanel.svelte';

	let isOpen = $state(false);

	function toggle() {
		isOpen = !isOpen;
	}

	function close() {
		isOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			close();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="scene">
	<!-- Ambient background glow -->
	<div class="ambient-glow"></div>

	<!-- Subtle grid pattern -->
	<div class="grid-pattern"></div>

	<!-- Main command area -->
	<div class="command-center">
		<div class="command-anchor">
			<CommandButton {isOpen} onclick={toggle} />
			<DropdownPanel {isOpen} onclose={close} />
		</div>
	</div>

	<!-- Branding footer -->
	<div class="footer">
		<span class="footer-text">Wealth Command Interface</span>
		<span class="footer-dot"></span>
		<span class="footer-secure">Secured</span>
	</div>
</div>

<style>
	.scene {
		position: fixed;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: var(--black);
		overflow: hidden;
	}

	.ambient-glow {
		position: absolute;
		top: 30%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 600px;
		height: 600px;
		background: radial-gradient(
			circle,
			rgba(200, 162, 74, 0.04) 0%,
			transparent 60%
		);
		pointer-events: none;
	}

	.grid-pattern {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(200, 162, 74, 0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(200, 162, 74, 0.02) 1px, transparent 1px);
		background-size: 60px 60px;
		pointer-events: none;
		mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, black 30%, transparent 70%);
		-webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, black 30%, transparent 70%);
	}

	.command-center {
		position: relative;
		z-index: 2;
	}

	.command-anchor {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.footer {
		position: fixed;
		bottom: 32px;
		display: flex;
		align-items: center;
		gap: 8px;
		z-index: 1;
	}

	.footer-text {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	.footer-dot {
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: var(--gold);
		opacity: 0.4;
	}

	.footer-secure {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--green);
		opacity: 0.5;
	}
</style>
