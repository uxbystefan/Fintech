<script lang="ts">
	import type { CardData } from '$lib/cardData';

	let { card, onClose = () => {} }: { card: CardData; onClose?: () => void } = $props();

	const maxSpending = $derived(Math.max(...card.spending.map(s => s.amount)));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="detail-backdrop" onclick={onClose}>
	<div class="detail-panel" onclick={(e) => e.stopPropagation()}>
		<!-- Header -->
		<div class="panel-header">
			<div class="header-left">
				<div class="card-icon" style="--c: {card.color}">
					<svg width="24" height="16" viewBox="0 0 24 16" fill="none">
						<rect x="0.5" y="0.5" width="23" height="15" rx="2.5" stroke="{card.color}" stroke-opacity="0.5"/>
						<rect x="3" y="4" width="6" height="4" rx="1" fill="{card.color}" fill-opacity="0.6"/>
					</svg>
				</div>
				<div class="header-info">
					<span class="header-brand">{card.brand} <span class="header-type">{card.type}</span></span>
					<span class="header-number">{card.cardNumber}</span>
				</div>
			</div>
			<button class="close-btn" onclick={onClose}>✕</button>
		</div>

		<!-- Balance hero -->
		<div class="balance-section" style="--c: {card.color}">
			<span class="balance-label">Available Balance</span>
			<span class="balance-amount">{card.balance}</span>
			<span class="balance-currency">{card.currency} • {card.holderName}</span>
		</div>

		<!-- Stats row -->
		<div class="stats-row">
			<div class="stat-item">
				<span class="stat-label">Status</span>
				<span class="stat-value active">● Active</span>
			</div>
			<div class="stat-item">
				<span class="stat-label">Expires</span>
				<span class="stat-value">{card.expiry}</span>
			</div>
			<div class="stat-item">
				<span class="stat-label">Daily Limit</span>
				<span class="stat-value">{card.limits.daily}</span>
			</div>
			<div class="stat-item">
				<span class="stat-label">Used Today</span>
				<div class="limit-bar-wrap">
					<span class="stat-value">{card.limits.used}</span>
					<div class="limit-bar">
						<div
							class="limit-fill"
							style="width: {card.limits.percent}%; --c: {card.color}; {card.limits.percent > 70 ? 'background: #ff6b6b;' : ''}"
						></div>
					</div>
				</div>
			</div>
		</div>

		<!-- Spending chart -->
		<div class="chart-section">
			<h3 class="section-title">Monthly Spending</h3>
			<div class="bar-chart">
				{#each card.spending as sp, i}
					<div class="bar-col">
						<div class="bar-wrapper">
							<div
								class="bar"
								style="height: {(sp.amount / maxSpending) * 100}%; --c: {card.color}; animation-delay: {i * 80}ms"
							></div>
						</div>
						<span class="bar-label">{sp.month}</span>
						<span class="bar-amount">${(sp.amount / 1000).toFixed(1)}k</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Recent transactions -->
		<div class="tx-section">
			<h3 class="section-title">Recent Transactions</h3>
			<div class="tx-list">
				{#each card.recentTx as tx, i}
					<div class="tx-row" style="animation-delay: {i * 60}ms">
						<span class="tx-icon">{tx.icon}</span>
						<div class="tx-info">
							<span class="tx-name">{tx.name}</span>
							<span class="tx-date">{tx.date}</span>
						</div>
						<span class="tx-amount" class:positive={tx.amount.startsWith('+')}>
							{tx.amount}
						</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Action buttons -->
		<div class="actions-row">
			<button class="action-btn" style="--c: {card.color}">
				<span>💸</span> Send Money
			</button>
			<button class="action-btn" style="--c: {card.color}">
				<span>❄️</span> Freeze Card
			</button>
			<button class="action-btn" style="--c: {card.color}">
				<span>📊</span> Full Report
			</button>
		</div>
	</div>
</div>

<style>
	.detail-backdrop {
		position: fixed;
		inset: 0;
		z-index: 100;
		background: rgba(3, 4, 6, 0.7);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.25s ease-out;
		font-family: 'Inter', system-ui, sans-serif;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.detail-panel {
		width: 420px;
		max-height: 88vh;
		overflow-y: auto;
		background: rgba(11, 15, 23, 0.92);
		border: 1px solid rgba(47, 139, 255, 0.15);
		border-radius: 16px;
		padding: 0;
		box-shadow:
			0 0 60px rgba(47, 139, 255, 0.08),
			0 20px 60px rgba(0,0,0,0.5);
		animation: slideUp 0.3s ease-out;
		scrollbar-width: thin;
		scrollbar-color: rgba(47, 139, 255, 0.2) transparent;
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(30px) scale(0.97); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}

	/* Header */
	.panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 24px 16px;
		border-bottom: 1px solid rgba(255,255,255,0.05);
	}
	.header-left {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.card-icon {
		width: 40px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.header-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.header-brand {
		font-size: 13px;
		font-weight: 600;
		color: #E6EDF3;
		letter-spacing: 1px;
	}
	.header-type {
		font-size: 10px;
		font-weight: 400;
		color: #9AA6B2;
		letter-spacing: 0.5px;
	}
	.header-number {
		font-size: 11px;
		color: #7F8A96;
		letter-spacing: 1.5px;
		font-variant-numeric: tabular-nums;
	}
	.close-btn {
		width: 32px;
		height: 32px;
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 8px;
		background: rgba(255,255,255,0.03);
		color: #9AA6B2;
		font-size: 14px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
	}
	.close-btn:hover {
		background: rgba(255,255,255,0.08);
		color: #fff;
	}

	/* Balance */
	.balance-section {
		padding: 24px 24px 20px;
		text-align: center;
	}
	.balance-label {
		display: block;
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 1.5px;
		color: #7F8A96;
		text-transform: uppercase;
		margin-bottom: 8px;
	}
	.balance-amount {
		display: block;
		font-size: 36px;
		font-weight: 700;
		color: #E6EDF3;
		font-variant-numeric: tabular-nums;
		text-shadow: 0 0 30px color-mix(in srgb, var(--c) 30%, transparent);
		margin-bottom: 6px;
	}
	.balance-currency {
		font-size: 11px;
		color: #9AA6B2;
		letter-spacing: 0.5px;
	}

	/* Stats */
	.stats-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 1px;
		background: rgba(255,255,255,0.03);
		border-top: 1px solid rgba(255,255,255,0.05);
		border-bottom: 1px solid rgba(255,255,255,0.05);
	}
	.stat-item {
		padding: 14px 12px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		align-items: center;
		text-align: center;
	}
	.stat-label {
		font-size: 8px;
		font-weight: 500;
		letter-spacing: 1px;
		color: #7F8A96;
		text-transform: uppercase;
	}
	.stat-value {
		font-size: 12px;
		font-weight: 600;
		color: #E6EDF3;
		font-variant-numeric: tabular-nums;
	}
	.stat-value.active { color: #00ff88; }
	.limit-bar-wrap {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
		align-items: center;
	}
	.limit-bar {
		width: 100%;
		height: 3px;
		background: rgba(255,255,255,0.06);
		border-radius: 2px;
		overflow: hidden;
	}
	.limit-fill {
		height: 100%;
		background: var(--c);
		border-radius: 2px;
		transition: width 0.6s ease-out;
	}

	/* Chart */
	.chart-section {
		padding: 20px 24px 16px;
	}
	.section-title {
		font-size: 11px;
		font-weight: 600;
		color: #9AA6B2;
		letter-spacing: 1px;
		text-transform: uppercase;
		margin-bottom: 16px;
	}
	.bar-chart {
		display: flex;
		gap: 8px;
		align-items: flex-end;
		height: 100px;
	}
	.bar-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.bar-wrapper {
		width: 100%;
		height: 80px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}
	.bar {
		width: 70%;
		background: var(--c);
		border-radius: 3px 3px 0 0;
		opacity: 0.7;
		animation: barGrow 0.5s ease-out both;
		min-height: 4px;
	}
	@keyframes barGrow {
		from { height: 0 !important; opacity: 0; }
	}
	.bar-label {
		font-size: 9px;
		color: #7F8A96;
		font-weight: 500;
	}
	.bar-amount {
		font-size: 8px;
		color: #9AA6B2;
		font-variant-numeric: tabular-nums;
	}

	/* Transactions */
	.tx-section {
		padding: 16px 24px;
		border-top: 1px solid rgba(255,255,255,0.05);
	}
	.tx-list {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.tx-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 8px;
		border-radius: 8px;
		transition: background 0.2s;
		animation: txSlide 0.3s ease-out both;
	}
	@keyframes txSlide {
		from { opacity: 0; transform: translateX(-10px); }
	}
	.tx-row:hover {
		background: rgba(255,255,255,0.03);
	}
	.tx-icon {
		font-size: 18px;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255,255,255,0.04);
		border-radius: 8px;
		flex-shrink: 0;
	}
	.tx-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.tx-name {
		font-size: 13px;
		font-weight: 500;
		color: #E6EDF3;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.tx-date {
		font-size: 10px;
		color: #7F8A96;
	}
	.tx-amount {
		font-size: 13px;
		font-weight: 600;
		color: #E6EDF3;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.tx-amount.positive { color: #00ff88; }

	/* Actions */
	.actions-row {
		display: flex;
		gap: 8px;
		padding: 16px 24px 20px;
		border-top: 1px solid rgba(255,255,255,0.05);
	}
	.action-btn {
		flex: 1;
		padding: 10px 8px;
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(255,255,255,0.06);
		border-radius: 8px;
		color: #E6EDF3;
		font-size: 11px;
		font-weight: 500;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		transition: all 0.2s;
		font-family: 'Inter', system-ui, sans-serif;
	}
	.action-btn:hover {
		background: color-mix(in srgb, var(--c) 12%, transparent);
		border-color: color-mix(in srgb, var(--c) 30%, transparent);
		box-shadow: 0 0 15px color-mix(in srgb, var(--c) 15%, transparent);
	}
</style>
