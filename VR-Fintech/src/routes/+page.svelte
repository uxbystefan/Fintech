<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { ACESFilmicToneMapping, WebGLRenderer } from 'three';
	import FinanceRoom from '$lib/components/FinanceRoom.svelte';
	import CardAnalyticsDashboard from '$lib/components/CardAnalyticsDashboard.svelte';
	import FinancialReportPanel from '$lib/components/FinancialReportPanel.svelte';
	import { cards } from '$lib/cardData';

	const REPORT_CARD_INDEX = 1; // Top-right card (Gold Business)

	let selectedCardIndex: number | null = $state(null);

	function createRenderer(canvas: HTMLCanvasElement) {
		return new WebGLRenderer({
			canvas,
			antialias: true,
			alpha: false,
			powerPreference: 'high-performance'
		});
	}

	function handleSelectCard(index: number) {
		selectedCardIndex = index;
	}

	function handleCloseDetail() {
		selectedCardIndex = null;
	}

	function handleNavigate(index: number) {
		selectedCardIndex = index;
	}
</script>

<svelte:head>
	<title>VR Fintech — Spatial Finance Room</title>
	<meta name="description" content="A spatial fintech interface prototype — immersive 3D finance room built with SvelteKit and Threlte" />
</svelte:head>

<div class="app-container">
	<!-- 3D Canvas fills entire viewport -->
	<div class="canvas-wrapper">
		<Canvas
			{createRenderer}
			toneMapping={ACESFilmicToneMapping}
			colorSpace="srgb"
		>
			<FinanceRoom onSelectCard={handleSelectCard} selectedIndex={selectedCardIndex} />
		</Canvas>
	</div>

	<!-- Overlay HUD -->
	<div class="overlay" class:dimmed={selectedCardIndex !== null}>
		<!-- Top bar -->
		<header class="top-bar">
			<div class="logo">
				<div class="logo-mark"></div>
				<span class="logo-text">FINTECH<span class="logo-accent">VR</span></span>
			</div>
			<div class="status-group">
				<div class="status-dot"></div>
				<span class="status-text">LIVE</span>
			</div>
		</header>

		<!-- Bottom info panels -->
		<div class="bottom-panels">
			<div class="info-panel">
				<div class="panel-label">Portfolio Value</div>
				<div class="panel-value">$1,070,682</div>
				<div class="panel-change positive">+4.2% ↑ this month</div>
			</div>

			<div class="info-panel">
				<div class="panel-label">24h Volume</div>
				<div class="panel-value">$128.4M</div>
				<div class="panel-change positive">+12.8%</div>
			</div>

			<div class="info-panel">
				<div class="panel-label">Active Cards</div>
				<div class="panel-value">4</div>
				<div class="panel-change neutral">Click any card to view</div>
			</div>

			<div class="info-panel">
				<div class="panel-label">Risk Score</div>
				<div class="panel-value">Low</div>
				<div class="panel-change positive">Sharpe 1.82</div>
			</div>
		</div>

		<!-- Corner decoration -->
		<div class="corner-tl"></div>
		<div class="corner-tr"></div>
		<div class="corner-bl"></div>
		<div class="corner-br"></div>
	</div>

	<!-- Financial Report for top-right card -->
	{#if selectedCardIndex === REPORT_CARD_INDEX}
		<FinancialReportPanel
			card={cards[REPORT_CARD_INDEX]}
			onClose={handleCloseDetail}
		/>
	{:else if selectedCardIndex !== null}
		<CardAnalyticsDashboard
			card={cards[selectedCardIndex]}
			selectedIndex={selectedCardIndex}
			onClose={handleCloseDetail}
			onNavigate={handleNavigate}
		/>
	{/if}
</div>

<style>
	.app-container {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #05070A;
	}

	.canvas-wrapper {
		position: absolute;
		inset: 0;
		z-index: 0;
	}

	/* ===== Overlay HUD ===== */
	.overlay {
		position: absolute;
		inset: 0;
		z-index: 10;
		pointer-events: none;
		font-family: 'Inter', system-ui, sans-serif;
		transition: opacity 0.4s ease;
	}
	.overlay.dimmed {
		opacity: 0.15;
		pointer-events: none;
	}

	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px 32px;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.logo-mark {
		width: 10px;
		height: 10px;
		background: #2F8BFF;
		border-radius: 2px;
		box-shadow: 0 0 12px rgba(47, 139, 255, 0.6);
		transform: rotate(45deg);
	}

	.logo-text {
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 3px;
		color: #E6EDF3;
	}

	.logo-accent {
		color: #2F8BFF;
		margin-left: 2px;
	}

	.status-group {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		background: #00ff88;
		border-radius: 50%;
		box-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
		animation: pulse-dot 2s ease-in-out infinite;
	}

	.status-text {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 2px;
		color: #9AA6B2;
	}

	@keyframes pulse-dot {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	/* Bottom panels */
	.bottom-panels {
		position: absolute;
		bottom: 28px;
		left: 32px;
		right: 32px;
		display: flex;
		gap: 16px;
		pointer-events: auto;
	}

	.info-panel {
		background: rgba(11, 15, 23, 0.75);
		border: 1px solid rgba(47, 139, 255, 0.15);
		border-radius: 8px;
		padding: 16px 20px;
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		flex: 1;
		max-width: 260px;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	.info-panel:hover {
		border-color: rgba(47, 139, 255, 0.35);
		box-shadow: 0 0 20px rgba(47, 139, 255, 0.08);
	}

	.panel-label {
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 1.5px;
		color: #7F8A96;
		text-transform: uppercase;
		margin-bottom: 6px;
	}

	.panel-value {
		font-size: 22px;
		font-weight: 600;
		color: #E6EDF3;
		margin-bottom: 4px;
		font-variant-numeric: tabular-nums;
	}

	.panel-change {
		font-size: 11px;
		font-weight: 500;
	}

	.panel-change.positive {
		color: #00ff88;
	}

	.panel-change.neutral {
		color: #9AA6B2;
	}

	/* Corner accents */
	.corner-tl, .corner-tr, .corner-bl, .corner-br {
		position: absolute;
		width: 20px;
		height: 20px;
	}

	.corner-tl {
		top: 12px;
		left: 12px;
		border-top: 1px solid rgba(47, 139, 255, 0.3);
		border-left: 1px solid rgba(47, 139, 255, 0.3);
	}

	.corner-tr {
		top: 12px;
		right: 12px;
		border-top: 1px solid rgba(47, 139, 255, 0.3);
		border-right: 1px solid rgba(47, 139, 255, 0.3);
	}

	.corner-bl {
		bottom: 12px;
		left: 12px;
		border-bottom: 1px solid rgba(47, 139, 255, 0.3);
		border-left: 1px solid rgba(47, 139, 255, 0.3);
	}

	.corner-br {
		bottom: 12px;
		right: 12px;
		border-bottom: 1px solid rgba(47, 139, 255, 0.3);
		border-right: 1px solid rgba(47, 139, 255, 0.3);
	}
</style>
