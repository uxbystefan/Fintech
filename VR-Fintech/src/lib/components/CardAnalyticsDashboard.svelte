<script lang="ts">
	import type { CardData } from '$lib/cardData';
	import { cards } from '$lib/cardData';

	let {
		card,
		selectedIndex,
		onClose = () => {},
		onNavigate = (_i: number) => {}
	}: {
		card: CardData;
		selectedIndex: number;
		onClose?: () => void;
		onNavigate?: (index: number) => void;
	} = $props();

	// ---- Chart computations ----
	const CW = 340, CH = 140, PAD = 20;

	const maxSpending = $derived(Math.max(...card.spending.map(s => s.amount)));
	const totalSpending = $derived(card.spending.reduce((sum, s) => sum + s.amount, 0));
	const avgSpending = $derived(totalSpending / card.spending.length);

	const lastChange = $derived((() => {
		const sp = card.spending;
		if (sp.length < 2) return 0;
		const prev = sp[sp.length - 2].amount;
		const curr = sp[sp.length - 1].amount;
		return prev === 0 ? 0 : ((curr - prev) / prev * 100);
	})());

	const chartPoints = $derived(card.spending.map((s, i) => ({
		x: PAD + (i / Math.max(card.spending.length - 1, 1)) * (CW - 2 * PAD),
		y: CH - PAD - ((s.amount / maxSpending) * (CH - 2 * PAD))
	})));

	function smoothPath(pts: { x: number; y: number }[]): string {
		if (pts.length < 2) return '';
		let d = `M${pts[0].x},${pts[0].y}`;
		for (let i = 1; i < pts.length; i++) {
			const prev = pts[i - 1];
			const curr = pts[i];
			const cpx = (prev.x + curr.x) / 2;
			d += ` C${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
		}
		return d;
	}

	const linePath = $derived(smoothPath(chartPoints));
	const areaPath = $derived(
		linePath +
		` L${chartPoints[chartPoints.length - 1].x},${CH - PAD}` +
		` L${chartPoints[0].x},${CH - PAD} Z`
	);

	// ---- Donut chart: spending categories ----
	interface Category { name: string; percent: number; color: string }

	const categories = $derived<Category[]>((() => {
		switch (card.type) {
			case 'Platinum':
				return [
					{ name: 'Cloud Services', percent: 38, color: '#2F8BFF' },
					{ name: 'Subscriptions', percent: 24, color: '#59B0FF' },
					{ name: 'Dining & Travel', percent: 18, color: '#00ff88' },
					{ name: 'Other', percent: 20, color: '#9AA6B2' }
				];
			case 'Gold Business':
				return [
					{ name: 'Infrastructure', percent: 42, color: '#59B0FF' },
					{ name: 'Team Tools', percent: 28, color: '#2F8BFF' },
					{ name: 'Marketing', percent: 18, color: '#00ff88' },
					{ name: 'Other', percent: 12, color: '#9AA6B2' }
				];
			case 'Corporate':
				return [
					{ name: 'Payroll', percent: 52, color: '#1a5cff' },
					{ name: 'Operations', percent: 22, color: '#2F8BFF' },
					{ name: 'Legal & Insurance', percent: 16, color: '#59B0FF' },
					{ name: 'Other', percent: 10, color: '#9AA6B2' }
				];
			default:
				return [
					{ name: 'Development', percent: 44, color: '#4a9eff' },
					{ name: 'Entertainment', percent: 26, color: '#59B0FF' },
					{ name: 'Transfers', percent: 20, color: '#00ff88' },
					{ name: 'Other', percent: 10, color: '#9AA6B2' }
				];
		}
	})());

	const DONUT_R = 35;
	const DONUT_C = 2 * Math.PI * DONUT_R;

	const donutSegments = $derived((() => {
		let offset = 0;
		return categories.map(cat => {
			const length = (cat.percent / 100) * DONUT_C;
			const seg = { ...cat, length, offset: -offset };
			offset += length;
			return seg;
		});
	})());

	// ---- Navigation ----
	function handlePrev() {
		onNavigate((selectedIndex - 1 + cards.length) % cards.length);
	}
	function handleNext() {
		onNavigate((selectedIndex + 1) % cards.length);
	}
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
		if (e.key === 'ArrowLeft') handlePrev();
		if (e.key === 'ArrowRight') handleNext();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="dashboard" onclick={onClose}>
	<div class="dashboard-inner" onclick={(e) => e.stopPropagation()}>

		<!-- Header -->
		<header class="dash-header">
			<button class="back-btn" onclick={onClose}>
				<span class="back-arrow">←</span> Back to Overview
			</button>
			<div class="card-id">
				<span class="brand-tag" style="--c: {card.color}">{card.brand}</span>
				<span class="type-tag">{card.type}</span>
			</div>
		</header>

		<!-- Main content keyed to animate on card switch -->
		{#key selectedIndex}
			<div class="dash-content">
				<div class="dash-grid">
					<!-- LEFT COLUMN -->
					<div class="left-col">
						<!-- Balance panel -->
						<div class="glass-panel balance-panel" style="--c: {card.color}">
							<div class="card-mini-icon">
								<svg width="32" height="22" viewBox="0 0 32 22" fill="none">
									<rect x="0.5" y="0.5" width="31" height="21" rx="3.5" stroke="{card.color}" stroke-opacity="0.6"/>
									<rect x="4" y="5" width="8" height="5" rx="1" fill="{card.color}" fill-opacity="0.5"/>
									<line x1="4" y1="14" x2="28" y2="14" stroke="{card.color}" stroke-opacity="0.2" stroke-width="0.5"/>
								</svg>
							</div>
							<span class="card-num-display">{card.cardNumber}</span>
							<span class="card-holder-display">{card.holderName}</span>
							<div class="balance-hero">
								<span class="balance-tag">AVAILABLE BALANCE</span>
								<span class="balance-value">{card.balance}</span>
							</div>
						</div>

						<!-- Vitals -->
						<div class="glass-panel vitals-panel" style="animation-delay: 0.08s">
							<h3 class="section-label">CARD VITALS</h3>
							<div class="vitals-list">
								<div class="vital-row"><span class="vital-key">Status</span><span class="vital-val active">● Active</span></div>
								<div class="vital-row"><span class="vital-key">Expires</span><span class="vital-val">{card.expiry}</span></div>
								<div class="vital-row"><span class="vital-key">Currency</span><span class="vital-val">{card.currency}</span></div>
								<div class="vital-row"><span class="vital-key">Daily Limit</span><span class="vital-val">{card.limits.daily}</span></div>
								<div class="vital-row">
									<span class="vital-key">Used Today</span>
									<div class="limit-inline">
										<span class="vital-val">{card.limits.used}</span>
										<div class="limit-track">
											<div class="limit-fill" style="width: {card.limits.percent}%; background: {card.limits.percent > 70 ? '#ff6b6b' : card.color}"></div>
										</div>
										<span class="limit-pct">{card.limits.percent}%</span>
									</div>
								</div>
							</div>
						</div>

						<!-- Spending categories donut -->
						<div class="glass-panel donut-panel" style="animation-delay: 0.14s">
							<h3 class="section-label">SPENDING BREAKDOWN</h3>
							<div class="donut-layout">
								<svg viewBox="0 0 100 100" class="donut-svg">
									{#each donutSegments as seg, i}
										<circle
											cx="50" cy="50" r={DONUT_R}
											fill="none"
											stroke={seg.color}
											stroke-width="7"
											stroke-dasharray="{seg.length} {DONUT_C - seg.length}"
											stroke-dashoffset={seg.offset}
											transform="rotate(-90, 50, 50)"
											class="donut-seg"
											style="animation-delay: {i * 100 + 300}ms"
										/>
									{/each}
									<text x="50" y="48" text-anchor="middle" fill="#E6EDF3" font-size="9" font-weight="700" font-family="Inter, sans-serif">{lastChange >= 0 ? '↑' : '↓'}</text>
									<text x="50" y="58" text-anchor="middle" fill="#7F8A96" font-size="5" font-family="Inter, sans-serif">{Math.abs(lastChange).toFixed(0)}% vs prev</text>
								</svg>
								<div class="cat-legend">
									{#each categories as cat}
										<div class="cat-item">
											<span class="cat-dot" style="background: {cat.color}"></span>
											<span class="cat-name">{cat.name}</span>
											<span class="cat-pct">{cat.percent}%</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>

					<!-- RIGHT COLUMN -->
					<div class="right-col">
						<!-- Spending trend chart -->
						<div class="glass-panel chart-panel" style="animation-delay: 0.05s; --c: {card.color}">
							<div class="chart-header">
								<h3 class="section-label">SPENDING TREND</h3>
								<div class="chart-summary">
									<span class="summary-stat">Avg <strong>${(avgSpending / 1000).toFixed(1)}k</strong>/mo</span>
									<span class="summary-sep">·</span>
									<span class="summary-stat">Total <strong>${(totalSpending / 1000).toFixed(1)}k</strong></span>
								</div>
							</div>
							<div class="chart-wrap">
								<svg viewBox="0 0 {CW} {CH}" class="area-chart-svg">
									<defs>
										<linearGradient id="areaG-{selectedIndex}" x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stop-color="{card.color}" stop-opacity="0.3"/>
											<stop offset="100%" stop-color="{card.color}" stop-opacity="0.02"/>
										</linearGradient>
										<linearGradient id="lineG-{selectedIndex}" x1="0" y1="0" x2="1" y2="0">
											<stop offset="0%" stop-color="{card.color}" stop-opacity="0.5"/>
											<stop offset="50%" stop-color="{card.color}" stop-opacity="1"/>
											<stop offset="100%" stop-color="{card.color}" stop-opacity="0.7"/>
										</linearGradient>
									</defs>
									{#each [0.25, 0.5, 0.75] as frac}
										<line
											x1={PAD} y1={PAD + frac * (CH - 2 * PAD)}
											x2={CW - PAD} y2={PAD + frac * (CH - 2 * PAD)}
											stroke="rgba(255,255,255,0.06)" stroke-width="0.5"
										/>
									{/each}
									<path d={areaPath} fill="url(#areaG-{selectedIndex})" class="area-fill"/>
									<path d={linePath} fill="none" stroke="url(#lineG-{selectedIndex})" stroke-width="2.5" stroke-linecap="round" class="area-line"/>
									{#each chartPoints as pt, i}
										<circle cx={pt.x} cy={pt.y} r="4" fill="{card.color}" class="chart-dot" style="animation-delay: {i * 80 + 300}ms"/>
										<circle cx={pt.x} cy={pt.y} r="7" fill="{card.color}" opacity="0.12"/>
									{/each}
								</svg>
								<div class="month-labels">
									{#each card.spending as sp}
										<span class="month-lbl">{sp.month}</span>
									{/each}
								</div>
							</div>
						</div>

						<!-- Transactions -->
						<div class="glass-panel tx-panel" style="animation-delay: 0.12s">
							<h3 class="section-label">RECENT TRANSACTIONS</h3>
							<div class="tx-list">
								{#each card.recentTx as tx, i}
									<div class="tx-row" style="animation-delay: {i * 60 + 200}ms">
										<span class="tx-icon">{tx.icon}</span>
										<div class="tx-info">
											<span class="tx-name">{tx.name}</span>
											<span class="tx-date">{tx.date}</span>
										</div>
										<span class="tx-amount" class:positive={tx.amount.startsWith('+')}>{tx.amount}</span>
									</div>
								{/each}
							</div>
						</div>

						<!-- Actions -->
						<div class="actions-row" style="animation-delay: 0.18s">
							<button class="action-btn" style="--c: {card.color}">💸 Send Money</button>
							<button class="action-btn" style="--c: {card.color}">❄️ Freeze Card</button>
							<button class="action-btn" style="--c: {card.color}">📊 Full Report</button>
						</div>
					</div>
				</div>
			</div>
		{/key}

		<!-- Navigation bar -->
		<nav class="dash-nav">
			<button class="nav-arrow" onclick={handlePrev} aria-label="Previous card">‹</button>
			<div class="nav-dots">
				{#each cards as _, i}
					<button
						class="nav-dot"
						class:active={i === selectedIndex}
						style="--c: {cards[i].color}"
						onclick={() => onNavigate(i)}
						aria-label="View card {i + 1}"
					></button>
				{/each}
			</div>
			<span class="nav-label">Card {selectedIndex + 1} of {cards.length}</span>
			<button class="nav-arrow" onclick={handleNext} aria-label="Next card">›</button>
		</nav>

	</div>
</div>

<style>
	/* ===== Backdrop ===== */
	.dashboard {
		position: fixed;
		inset: 0;
		z-index: 50;
		background: rgba(3, 4, 6, 0.45);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.3s ease-out;
		font-family: 'Inter', system-ui, sans-serif;
		color: #E6EDF3;
	}
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
	.dashboard-inner {
		width: 100%;
		max-width: 1100px;
		max-height: 94vh;
		display: flex;
		flex-direction: column;
		padding: 0 24px;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(47, 139, 255, 0.15) transparent;
	}

	/* ===== Header ===== */
	.dash-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 0 12px;
		flex-shrink: 0;
	}
	.back-btn {
		background: rgba(11, 15, 23, 0.6);
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 8px;
		padding: 8px 16px;
		color: #9AA6B2;
		font-size: 12px;
		font-family: inherit;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 8px;
		transition: all 0.2s;
	}
	.back-btn:hover { color: #fff; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }
	.back-arrow { font-size: 18px; }
	.card-id { display: flex; align-items: center; gap: 10px; }
	.brand-tag {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 2px;
		color: var(--c);
		text-shadow: 0 0 12px var(--c);
	}
	.type-tag {
		font-size: 10px;
		letter-spacing: 1px;
		color: #7F8A96;
		background: rgba(255,255,255,0.04);
		padding: 4px 10px;
		border-radius: 4px;
	}

	/* ===== Content (keyed for transitions) ===== */
	.dash-content {
		animation: contentIn 0.35s ease-out;
	}
	@keyframes contentIn {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* ===== Grid layout ===== */
	.dash-grid {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 14px;
	}
	.left-col, .right-col {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	/* ===== Glass panels ===== */
	.glass-panel {
		background: rgba(11, 15, 23, 0.72);
		border: 1px solid rgba(47, 139, 255, 0.1);
		border-radius: 12px;
		padding: 18px;
		backdrop-filter: blur(8px);
		animation: panelUp 0.4s ease-out backwards;
	}
	@keyframes panelUp {
		from { opacity: 0; transform: translateY(14px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.section-label {
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 2px;
		color: #7F8A96;
		margin: 0 0 12px;
	}

	/* ===== Balance panel ===== */
	.balance-panel { animation-delay: 0.02s; }
	.card-mini-icon { margin-bottom: 10px; }
	.card-num-display {
		display: block;
		font-size: 11px;
		letter-spacing: 2px;
		color: #9AA6B2;
		font-variant-numeric: tabular-nums;
		margin-bottom: 2px;
	}
	.card-holder-display {
		display: block;
		font-size: 10px;
		letter-spacing: 1px;
		color: #7F8A96;
		margin-bottom: 14px;
	}
	.balance-hero {
		border-top: 1px solid rgba(255,255,255,0.05);
		padding-top: 12px;
	}
	.balance-tag {
		display: block;
		font-size: 8px;
		font-weight: 600;
		letter-spacing: 2px;
		color: #7F8A96;
		margin-bottom: 6px;
	}
	.balance-value {
		display: block;
		font-size: 26px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		text-shadow: 0 0 20px color-mix(in srgb, var(--c) 30%, transparent);
	}

	/* ===== Vitals ===== */
	.vitals-list { display: flex; flex-direction: column; gap: 9px; }
	.vital-row { display: flex; justify-content: space-between; align-items: center; }
	.vital-key { font-size: 11px; color: #7F8A96; }
	.vital-val { font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums; }
	.vital-val.active { color: #00ff88; }
	.limit-inline { display: flex; align-items: center; gap: 6px; }
	.limit-track {
		width: 40px;
		height: 3px;
		background: rgba(255,255,255,0.06);
		border-radius: 2px;
		overflow: hidden;
	}
	.limit-fill {
		height: 100%;
		border-radius: 2px;
		transition: width 0.6s ease-out;
	}
	.limit-pct { font-size: 9px; color: #7F8A96; }

	/* ===== Donut ===== */
	.donut-layout { display: flex; gap: 14px; align-items: center; }
	.donut-svg { width: 90px; height: 90px; flex-shrink: 0; }
	.donut-seg {
		animation: donutDraw 0.6s ease-out backwards;
	}
	@keyframes donutDraw {
		from { stroke-dasharray: 0 220; }
	}
	.cat-legend { display: flex; flex-direction: column; gap: 6px; flex: 1; }
	.cat-item { display: flex; align-items: center; gap: 6px; }
	.cat-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
	.cat-name { font-size: 10px; color: #9AA6B2; flex: 1; }
	.cat-pct { font-size: 10px; font-weight: 600; color: #E6EDF3; }

	/* ===== Chart ===== */
	.chart-panel { padding-bottom: 12px; }
	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}
	.chart-summary { display: flex; align-items: center; gap: 8px; }
	.summary-stat { font-size: 10px; color: #9AA6B2; }
	.summary-stat strong { color: #E6EDF3; font-weight: 600; }
	.summary-sep { color: #7F8A96; font-size: 8px; }
	.chart-wrap { position: relative; }
	.area-chart-svg { width: 100%; height: auto; display: block; }
	.area-fill { animation: chartFadeIn 0.8s ease-out backwards; animation-delay: 0.2s; }
	.area-line {
		stroke-dasharray: 600;
		stroke-dashoffset: 600;
		animation: lineReveal 1.2s ease-out forwards;
		animation-delay: 0.2s;
	}
	@keyframes lineReveal { to { stroke-dashoffset: 0; } }
	@keyframes chartFadeIn { from { opacity: 0; } to { opacity: 1; } }
	.chart-dot { animation: dotPop 0.3s ease-out backwards; }
	@keyframes dotPop { from { r: 0; opacity: 0; } to { r: 4; opacity: 1; } }
	.month-labels {
		display: flex;
		justify-content: space-between;
		padding: 4px 20px 0;
	}
	.month-lbl { font-size: 9px; color: #7F8A96; letter-spacing: 0.5px; }

	/* ===== Transactions ===== */
	.tx-list { display: flex; flex-direction: column; gap: 2px; }
	.tx-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 10px;
		border-radius: 8px;
		transition: background 0.2s;
		animation: txSlide 0.3s ease-out backwards;
	}
	@keyframes txSlide {
		from { opacity: 0; transform: translateX(12px); }
		to { opacity: 1; transform: translateX(0); }
	}
	.tx-row:hover { background: rgba(255,255,255,0.03); }
	.tx-icon { font-size: 17px; flex-shrink: 0; }
	.tx-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
	.tx-name { font-size: 12px; font-weight: 500; }
	.tx-date { font-size: 10px; color: #7F8A96; }
	.tx-amount {
		font-size: 12px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: #ff6b6b;
	}
	.tx-amount.positive { color: #00ff88; }

	/* ===== Actions ===== */
	.actions-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 8px;
		animation: panelUp 0.4s ease-out backwards;
	}
	.action-btn {
		background: rgba(11, 15, 23, 0.6);
		border: 1px solid rgba(47, 139, 255, 0.1);
		border-radius: 8px;
		padding: 10px 8px;
		color: #E6EDF3;
		font-size: 11px;
		font-family: inherit;
		cursor: pointer;
		transition: all 0.2s;
		text-align: center;
	}
	.action-btn:hover {
		border-color: var(--c);
		background: rgba(47, 139, 255, 0.06);
		box-shadow: 0 0 16px color-mix(in srgb, var(--c) 15%, transparent);
	}

	/* ===== Navigation ===== */
	.dash-nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		padding: 14px 0 12px;
		flex-shrink: 0;
	}
	.nav-arrow {
		width: 34px;
		height: 34px;
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 50%;
		background: rgba(255,255,255,0.02);
		color: #9AA6B2;
		font-size: 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		font-family: inherit;
	}
	.nav-arrow:hover {
		color: #fff;
		border-color: rgba(47, 139, 255, 0.4);
		background: rgba(47, 139, 255, 0.08);
	}
	.nav-dots { display: flex; gap: 8px; }
	.nav-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: none;
		background: rgba(255,255,255,0.15);
		cursor: pointer;
		transition: all 0.25s;
		padding: 0;
	}
	.nav-dot.active {
		background: var(--c);
		box-shadow: 0 0 8px var(--c);
		transform: scale(1.3);
	}
	.nav-label {
		font-size: 11px;
		color: #7F8A96;
		letter-spacing: 0.5px;
	}
</style>
