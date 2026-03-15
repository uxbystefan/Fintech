<script lang="ts">
	import type { CardData } from '$lib/cardData';

	let { card, onClose = () => {} }: { card: CardData; onClose?: () => void } = $props();

	// ===== FINANCIAL REPORT DATA =====
	const revenueData = [
		{ month: 'Jul', revenue: 68500, expenses: 42300, profit: 26200 },
		{ month: 'Aug', revenue: 72100, expenses: 44800, profit: 27300 },
		{ month: 'Sep', revenue: 84300, expenses: 48200, profit: 36100 },
		{ month: 'Oct', revenue: 79600, expenses: 46100, profit: 33500 },
		{ month: 'Nov', revenue: 91200, expenses: 52400, profit: 38800 },
		{ month: 'Dec', revenue: 88400, expenses: 58900, profit: 29500 },
		{ month: 'Jan', revenue: 96800, expenses: 54200, profit: 42600 },
		{ month: 'Feb', revenue: 102400, expenses: 56800, profit: 45600 },
		{ month: 'Mar', revenue: 118500, expenses: 62100, profit: 56400 }
	];

	const cashFlowData = [
		{ label: 'Opening', value: 124830, type: 'neutral' as const },
		{ label: 'Revenue', value: 118500, type: 'positive' as const },
		{ label: 'COGS', value: -38200, type: 'negative' as const },
		{ label: 'OpEx', value: -23900, type: 'negative' as const },
		{ label: 'Payroll', value: -28400, type: 'negative' as const },
		{ label: 'Tax', value: -8200, type: 'negative' as const },
		{ label: 'Interest', value: 2800, type: 'positive' as const },
		{ label: 'Net', value: 147430, type: 'neutral' as const }
	];

	const expenseBreakdown = [
		{ name: 'Infrastructure', percent: 32, color: '#2F8BFF', amount: '$19,872' },
		{ name: 'Personnel', percent: 28, color: '#59B0FF', amount: '$17,388' },
		{ name: 'Marketing', percent: 18, color: '#00ff88', amount: '$11,178' },
		{ name: 'Operations', percent: 12, color: '#FFB020', amount: '$7,452' },
		{ name: 'Other', percent: 10, color: '#9AA6B2', amount: '$6,210' }
	];

	const quarterlyPL = [
		{ quarter: 'Q2 2025', revenue: '$225.0K', cogs: '$94.5K', gross: '$130.5K', opex: '$68.2K', net: '$62.3K', margin: '27.7%' },
		{ quarter: 'Q3 2025', revenue: '$259.2K', cogs: '$103.7K', gross: '$155.5K', opex: '$72.8K', net: '$82.7K', margin: '31.9%' },
		{ quarter: 'Q4 2025', revenue: '$317.7K', cogs: '$120.9K', gross: '$196.8K', opex: '$84.1K', net: '$112.7K', margin: '35.5%' },
		{ quarter: 'Q1 2026', revenue: '$317.7K', cogs: '$118.4K', gross: '$199.3K', opex: '$88.6K', net: '$110.7K', margin: '34.8%' }
	];

	const revenueBySegment = [
		{ segment: 'SaaS Subscriptions', value: 44, color: '#2F8BFF' },
		{ segment: 'API Services', value: 26, color: '#59B0FF' },
		{ segment: 'Consulting', value: 18, color: '#00ff88' },
		{ segment: 'Licensing', value: 12, color: '#FFB020' }
	];

	// ===== KPI DATA =====
	const kpis = [
		{ label: 'Revenue', value: '$118.5K', change: '+15.7%', positive: true, icon: '📈' },
		{ label: 'Net Income', value: '$56.4K', change: '+23.7%', positive: true, icon: '💰' },
		{ label: 'EBITDA', value: '$68.2K', change: '+18.4%', positive: true, icon: '📊' },
		{ label: 'Gross Margin', value: '62.1%', change: '+2.3pp', positive: true, icon: '🎯' },
		{ label: 'Operating Margin', value: '47.6%', change: '+5.1pp', positive: true, icon: '⚡' },
		{ label: 'Burn Rate', value: '$62.1K', change: '-4.2%', positive: true, icon: '🔥' }
	];

	// ===== CHART COMPUTATIONS =====
	const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
	const maxExpense = Math.max(...revenueData.map(d => d.expenses));
	const maxVal = Math.max(maxRevenue, maxExpense) * 1.15;

	// Revenue trend line
	const CW = 460, CH = 160, PAD = 30;
	const revPoints = revenueData.map((d, i) => ({
		x: PAD + (i / (revenueData.length - 1)) * (CW - 2 * PAD),
		y: CH - PAD - ((d.revenue / maxVal) * (CH - 2 * PAD))
	}));
	const expPoints = revenueData.map((d, i) => ({
		x: PAD + (i / (revenueData.length - 1)) * (CW - 2 * PAD),
		y: CH - PAD - ((d.expenses / maxVal) * (CH - 2 * PAD))
	}));
	const profitPoints = revenueData.map((d, i) => ({
		x: PAD + (i / (revenueData.length - 1)) * (CW - 2 * PAD),
		y: CH - PAD - ((d.profit / maxVal) * (CH - 2 * PAD))
	}));

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

	const revLinePath = smoothPath(revPoints);
	const expLinePath = smoothPath(expPoints);
	const profitLinePath = smoothPath(profitPoints);
	const revAreaPath = revLinePath + ` L${revPoints[revPoints.length - 1].x},${CH - PAD} L${revPoints[0].x},${CH - PAD} Z`;

	// Donut
	const DONUT_R = 38;
	const DONUT_C = 2 * Math.PI * DONUT_R;
	let donutOffset = 0;
	const donutSegments = expenseBreakdown.map(cat => {
		const length = (cat.percent / 100) * DONUT_C;
		const seg = { ...cat, length, offset: -donutOffset };
		donutOffset += length;
		return seg;
	});

	// Revenue segment donut
	const SEG_R = 32;
	const SEG_C = 2 * Math.PI * SEG_R;
	let segOffset = 0;
	const segDonutSegments = revenueBySegment.map(s => {
		const length = (s.value / 100) * SEG_C;
		const seg = { ...s, length, offset: -segOffset };
		segOffset += length;
		return seg;
	});

	// Waterfall chart
	const WF_W = 420, WF_H = 140, WF_PAD = 25;
	const allCfValues = cashFlowData.map(d => d.value);
	const maxCf = Math.max(...allCfValues.map(Math.abs)) * 1.2;

	function getWaterfallBars() {
		let running = 0;
		return cashFlowData.map((d, i) => {
			const barWidth = (WF_W - 2 * WF_PAD) / cashFlowData.length - 6;
			const x = WF_PAD + i * ((WF_W - 2 * WF_PAD) / cashFlowData.length) + 3;

			if (d.type === 'neutral') {
				const h = (Math.abs(d.value) / maxCf) * (WF_H - 2 * WF_PAD);
				running = d.value;
				return { x, width: barWidth, y: WF_H - WF_PAD - h, height: h, color: '#2F8BFF', value: d.value, label: d.label };
			}
			const prevRunning = running;
			running += d.value;
			const h = (Math.abs(d.value) / maxCf) * (WF_H - 2 * WF_PAD);
			const baseY = WF_H - WF_PAD - (Math.abs(prevRunning) / maxCf) * (WF_H - 2 * WF_PAD);

			if (d.value >= 0) {
				return { x, width: barWidth, y: baseY - h, height: h, color: '#00ff88', value: d.value, label: d.label };
			} else {
				return { x, width: barWidth, y: baseY, height: h, color: '#ff6b6b', value: d.value, label: d.label };
			}
		});
	}

	const waterfallBars = getWaterfallBars();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="report-backdrop" onclick={onClose}>
	<div class="report-panel" onclick={(e) => e.stopPropagation()}>

		<!-- Report Header -->
		<header class="report-header">
			<div class="header-left">
				<div class="report-icon">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<rect x="1" y="3" width="22" height="18" rx="3" stroke="#59B0FF" stroke-opacity="0.6"/>
						<rect x="5" y="11" width="3" height="6" rx="1" fill="#2F8BFF" fill-opacity="0.7"/>
						<rect x="10" y="8" width="3" height="9" rx="1" fill="#59B0FF" fill-opacity="0.7"/>
						<rect x="15" y="6" width="3" height="11" rx="1" fill="#00ff88" fill-opacity="0.7"/>
					</svg>
				</div>
				<div class="header-text">
					<h1 class="report-title">Financial Report</h1>
					<span class="report-subtitle">{card.brand} {card.type} — {card.holderName}</span>
				</div>
			</div>
			<div class="header-right">
				<span class="report-period">FY 2025-26 • Q1</span>
				<button class="close-btn" onclick={onClose}>✕</button>
			</div>
		</header>

		<div class="report-body">

			<!-- KPI Row -->
			<section class="kpi-row">
				{#each kpis as kpi, i}
					<div class="kpi-card" style="animation-delay: {i * 60}ms">
						<span class="kpi-icon">{kpi.icon}</span>
						<div class="kpi-info">
							<span class="kpi-label">{kpi.label}</span>
							<span class="kpi-value">{kpi.value}</span>
							<span class="kpi-change" class:positive={kpi.positive}>{kpi.change}</span>
						</div>
					</div>
				{/each}
			</section>

			<div class="report-grid">
				<!-- LEFT COLUMN -->
				<div class="col-left">

					<!-- Revenue vs Expenses Bar Chart -->
					<div class="glass-card" style="animation-delay: 0.1s">
						<div class="card-header">
							<h3 class="card-title">Revenue vs Expenses</h3>
							<span class="card-badge positive">+15.7% YoY</span>
						</div>
						<div class="bar-chart-container">
							{#each revenueData as d, i}
								<div class="bar-group" style="animation-delay: {i * 50 + 200}ms">
									<div class="bar-pair">
										<div class="bar revenue-bar" style="height: {(d.revenue / maxVal) * 100}%">
											<span class="bar-tooltip">${(d.revenue / 1000).toFixed(1)}K</span>
										</div>
										<div class="bar expense-bar" style="height: {(d.expenses / maxVal) * 100}%">
											<span class="bar-tooltip">${(d.expenses / 1000).toFixed(1)}K</span>
										</div>
									</div>
									<span class="bar-month">{d.month}</span>
								</div>
							{/each}
						</div>
						<div class="chart-legend">
							<span class="legend-item"><span class="legend-dot rev"></span> Revenue</span>
							<span class="legend-item"><span class="legend-dot exp"></span> Expenses</span>
						</div>
					</div>

					<!-- Multi-line Trend Chart -->
					<div class="glass-card" style="animation-delay: 0.15s">
						<div class="card-header">
							<h3 class="card-title">Performance Trends</h3>
							<span class="card-badge neutral">9 Months</span>
						</div>
						<div class="trend-chart-wrap">
							<svg viewBox="0 0 {CW} {CH}" class="trend-svg">
								<defs>
									<linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stop-color="#2F8BFF" stop-opacity="0.2"/>
										<stop offset="100%" stop-color="#2F8BFF" stop-opacity="0.02"/>
									</linearGradient>
								</defs>
								<!-- Grid lines -->
								{#each [0.2, 0.4, 0.6, 0.8] as frac}
									<line x1={PAD} y1={PAD + frac * (CH - 2 * PAD)} x2={CW - PAD} y2={PAD + frac * (CH - 2 * PAD)} stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
								{/each}
								<!-- Y-axis labels -->
								{#each [0, 0.25, 0.5, 0.75, 1] as frac}
									<text x={PAD - 4} y={CH - PAD - frac * (CH - 2 * PAD) + 3} text-anchor="end" fill="#7F8A96" font-size="7" font-family="Inter, sans-serif">${(frac * maxVal / 1000).toFixed(0)}K</text>
								{/each}
								<!-- Revenue area -->
								<path d={revAreaPath} fill="url(#revArea)" class="area-animate"/>
								<!-- Lines -->
								<path d={revLinePath} fill="none" stroke="#2F8BFF" stroke-width="2" stroke-linecap="round" class="line-animate"/>
								<path d={expLinePath} fill="none" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" stroke-dasharray="6 3" class="line-animate" style="animation-delay: 0.15s"/>
								<path d={profitLinePath} fill="none" stroke="#00ff88" stroke-width="2" stroke-linecap="round" class="line-animate" style="animation-delay: 0.3s"/>
								<!-- Dots -->
								{#each revPoints as pt, i}
									<circle cx={pt.x} cy={pt.y} r="3" fill="#2F8BFF" class="dot-animate" style="animation-delay: {i * 60 + 400}ms"/>
								{/each}
								{#each profitPoints as pt, i}
									<circle cx={pt.x} cy={pt.y} r="2.5" fill="#00ff88" class="dot-animate" style="animation-delay: {i * 60 + 600}ms"/>
								{/each}
							</svg>
							<div class="trend-months">
								{#each revenueData as d}
									<span class="trend-month">{d.month}</span>
								{/each}
							</div>
						</div>
						<div class="chart-legend">
							<span class="legend-item"><span class="legend-dot" style="background: #2F8BFF"></span> Revenue</span>
							<span class="legend-item"><span class="legend-dot" style="background: #ff6b6b"></span> Expenses</span>
							<span class="legend-item"><span class="legend-dot" style="background: #00ff88"></span> Profit</span>
						</div>
					</div>

					<!-- Cash Flow Waterfall -->
					<div class="glass-card" style="animation-delay: 0.2s">
						<div class="card-header">
							<h3 class="card-title">Cash Flow Waterfall</h3>
							<span class="card-badge positive">+$22.6K Net</span>
						</div>
						<div class="waterfall-wrap">
							<svg viewBox="0 0 {WF_W} {WF_H}" class="waterfall-svg">
								{#each [0.25, 0.5, 0.75] as frac}
									<line x1={WF_PAD} y1={WF_PAD + frac * (WF_H - 2 * WF_PAD)} x2={WF_W - WF_PAD} y2={WF_PAD + frac * (WF_H - 2 * WF_PAD)} stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
								{/each}
								{#each waterfallBars as bar, i}
									<rect
										x={bar.x} y={bar.y}
										width={bar.width} height={bar.height}
										rx="2" fill={bar.color}
										opacity="0.8"
										class="wf-bar"
										style="animation-delay: {i * 70 + 200}ms"
									/>
									<text x={bar.x + bar.width / 2} y={bar.y - 5} text-anchor="middle" fill="#9AA6B2" font-size="6" font-family="Inter, sans-serif">
										{bar.value >= 0 ? '+' : ''}{(bar.value / 1000).toFixed(0)}K
									</text>
								{/each}
							</svg>
							<div class="wf-labels">
								{#each cashFlowData as d}
									<span class="wf-label">{d.label}</span>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<!-- RIGHT COLUMN -->
				<div class="col-right">

					<!-- Expense Breakdown Donut -->
					<div class="glass-card" style="animation-delay: 0.08s">
						<div class="card-header">
							<h3 class="card-title">Expense Breakdown</h3>
							<span class="card-badge negative">$62.1K Total</span>
						</div>
						<div class="donut-layout">
							<svg viewBox="0 0 100 100" class="donut-svg">
								{#each donutSegments as seg, i}
									<circle cx="50" cy="50" r={DONUT_R} fill="none" stroke={seg.color} stroke-width="8" stroke-dasharray="{seg.length} {DONUT_C - seg.length}" stroke-dashoffset={seg.offset} transform="rotate(-90, 50, 50)" class="donut-animate" style="animation-delay: {i * 100 + 200}ms"/>
								{/each}
								<text x="50" y="47" text-anchor="middle" fill="#E6EDF3" font-size="10" font-weight="700" font-family="Inter, sans-serif">$62.1K</text>
								<text x="50" y="57" text-anchor="middle" fill="#7F8A96" font-size="5" font-family="Inter, sans-serif">This Month</text>
							</svg>
							<div class="donut-legend">
								{#each expenseBreakdown as cat}
									<div class="legend-row">
										<span class="legend-color" style="background: {cat.color}"></span>
										<span class="legend-name">{cat.name}</span>
										<span class="legend-pct">{cat.percent}%</span>
										<span class="legend-amt">{cat.amount}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Revenue by Segment -->
					<div class="glass-card" style="animation-delay: 0.12s">
						<div class="card-header">
							<h3 class="card-title">Revenue by Segment</h3>
						</div>
						<div class="segment-layout">
							<svg viewBox="0 0 80 80" class="segment-svg">
								{#each segDonutSegments as seg, i}
									<circle cx="40" cy="40" r={SEG_R} fill="none" stroke={seg.color} stroke-width="10" stroke-dasharray="{seg.length} {SEG_C - seg.length}" stroke-dashoffset={seg.offset} transform="rotate(-90, 40, 40)" class="donut-animate" style="animation-delay: {i * 80 + 300}ms"/>
								{/each}
							</svg>
							<div class="segment-bars">
								{#each revenueBySegment as seg, i}
									<div class="seg-row" style="animation-delay: {i * 70 + 200}ms">
										<div class="seg-info">
											<span class="seg-name">{seg.segment}</span>
											<span class="seg-pct">{seg.value}%</span>
										</div>
										<div class="seg-bar-track">
											<div class="seg-bar-fill" style="width: {seg.value}%; background: {seg.color}"></div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Quarterly P&L Table -->
					<div class="glass-card" style="animation-delay: 0.18s">
						<div class="card-header">
							<h3 class="card-title">Quarterly P&L Summary</h3>
						</div>
						<div class="pl-table-wrap">
							<table class="pl-table">
								<thead>
									<tr>
										<th></th>
										{#each quarterlyPL as q}
											<th>{q.quarter}</th>
										{/each}
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="row-label">Revenue</td>
										{#each quarterlyPL as q}<td>{q.revenue}</td>{/each}
									</tr>
									<tr>
										<td class="row-label">COGS</td>
										{#each quarterlyPL as q}<td class="negative">{q.cogs}</td>{/each}
									</tr>
									<tr class="highlight-row">
										<td class="row-label bold">Gross Profit</td>
										{#each quarterlyPL as q}<td class="bold">{q.gross}</td>{/each}
									</tr>
									<tr>
										<td class="row-label">OpEx</td>
										{#each quarterlyPL as q}<td class="negative">{q.opex}</td>{/each}
									</tr>
									<tr class="highlight-row net-row">
										<td class="row-label bold">Net Income</td>
										{#each quarterlyPL as q}<td class="positive bold">{q.net}</td>{/each}
									</tr>
									<tr>
										<td class="row-label">Net Margin</td>
										{#each quarterlyPL as q}<td class="positive">{q.margin}</td>{/each}
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- Monthly Profit Sparkline Bars -->
					<div class="glass-card" style="animation-delay: 0.22s">
						<div class="card-header">
							<h3 class="card-title">Monthly Net Profit</h3>
							<span class="card-badge positive">+{((revenueData[revenueData.length - 1].profit - revenueData[0].profit) / revenueData[0].profit * 100).toFixed(0)}% Growth</span>
						</div>
						<div class="profit-bars">
							{#each revenueData as d, i}
								<div class="profit-col" style="animation-delay: {i * 50 + 150}ms">
									<div class="profit-bar-wrap">
										<div class="profit-bar" style="height: {(d.profit / Math.max(...revenueData.map(r => r.profit))) * 100}%"></div>
									</div>
									<span class="profit-month">{d.month}</span>
									<span class="profit-val">${(d.profit / 1000).toFixed(0)}K</span>
								</div>
							{/each}
						</div>
					</div>

				</div>
			</div>

		</div>
	</div>
</div>

<style>
	/* ===== Backdrop ===== */
	.report-backdrop {
		position: fixed;
		inset: 0;
		z-index: 60;
		background: rgba(3, 4, 6, 0.5);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		animation: fadeIn 0.35s ease-out;
		font-family: 'Inter', system-ui, sans-serif;
		color: #E6EDF3;
		overflow-y: auto;
		padding: 24px 16px;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.report-panel {
		width: 100%;
		max-width: 1200px;
		animation: slideUp 0.4s ease-out;
	}

	@keyframes slideUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	/* ===== Header ===== */
	.report-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 0 20px;
		border-bottom: 1px solid rgba(47, 139, 255, 0.1);
		margin-bottom: 20px;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.report-icon {
		width: 44px;
		height: 44px;
		background: rgba(47, 139, 255, 0.08);
		border: 1px solid rgba(47, 139, 255, 0.15);
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.header-text { display: flex; flex-direction: column; gap: 3px; }

	.report-title {
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 0.5px;
		margin: 0;
		background: linear-gradient(135deg, #E6EDF3, #59B0FF);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.report-subtitle {
		font-size: 11px;
		color: #7F8A96;
		letter-spacing: 0.5px;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.report-period {
		font-size: 10px;
		letter-spacing: 1px;
		color: #9AA6B2;
		background: rgba(255,255,255,0.04);
		padding: 6px 12px;
		border-radius: 6px;
		border: 1px solid rgba(255,255,255,0.06);
	}

	.close-btn {
		width: 34px;
		height: 34px;
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 8px;
		background: rgba(255,255,255,0.03);
		color: #9AA6B2;
		font-size: 15px;
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

	/* ===== KPI Row ===== */
	.kpi-row {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 10px;
		margin-bottom: 16px;
	}

	.kpi-card {
		background: rgba(11, 15, 23, 0.72);
		border: 1px solid rgba(47, 139, 255, 0.08);
		border-radius: 10px;
		padding: 14px 12px;
		display: flex;
		align-items: flex-start;
		gap: 10px;
		animation: cardUp 0.4s ease-out backwards;
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.kpi-card:hover {
		border-color: rgba(47, 139, 255, 0.2);
		box-shadow: 0 0 20px rgba(47, 139, 255, 0.06);
	}

	@keyframes cardUp {
		from { opacity: 0; transform: translateY(12px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.kpi-icon { font-size: 18px; flex-shrink: 0; margin-top: 2px; }

	.kpi-info { display: flex; flex-direction: column; gap: 3px; }

	.kpi-label {
		font-size: 9px;
		font-weight: 500;
		letter-spacing: 1px;
		color: #7F8A96;
		text-transform: uppercase;
	}

	.kpi-value {
		font-size: 16px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.kpi-change {
		font-size: 10px;
		font-weight: 600;
		color: #9AA6B2;
	}

	.kpi-change.positive { color: #00ff88; }

	/* ===== Grid Layout ===== */
	.report-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.col-left, .col-right {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	/* ===== Glass Cards ===== */
	.glass-card {
		background: rgba(11, 15, 23, 0.72);
		border: 1px solid rgba(47, 139, 255, 0.08);
		border-radius: 12px;
		padding: 18px;
		animation: cardUp 0.4s ease-out backwards;
		transition: border-color 0.25s, box-shadow 0.25s;
	}

	.glass-card:hover {
		border-color: rgba(47, 139, 255, 0.18);
		box-shadow: 0 0 24px rgba(47, 139, 255, 0.05);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 14px;
	}

	.card-title {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 1.5px;
		color: #9AA6B2;
		text-transform: uppercase;
		margin: 0;
	}

	.card-badge {
		font-size: 9px;
		font-weight: 600;
		padding: 4px 8px;
		border-radius: 4px;
		letter-spacing: 0.5px;
	}

	.card-badge.positive { background: rgba(0, 255, 136, 0.08); color: #00ff88; border: 1px solid rgba(0,255,136,0.15); }
	.card-badge.negative { background: rgba(255, 107, 107, 0.08); color: #ff6b6b; border: 1px solid rgba(255,107,107,0.15); }
	.card-badge.neutral { background: rgba(255,255,255,0.04); color: #9AA6B2; border: 1px solid rgba(255,255,255,0.08); }

	/* ===== Bar Chart ===== */
	.bar-chart-container {
		display: flex;
		gap: 4px;
		align-items: flex-end;
		height: 140px;
		padding: 0 4px;
	}

	.bar-group {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		animation: cardUp 0.4s ease-out backwards;
	}

	.bar-pair {
		display: flex;
		gap: 2px;
		align-items: flex-end;
		height: 120px;
		width: 100%;
	}

	.bar {
		flex: 1;
		border-radius: 3px 3px 0 0;
		min-height: 4px;
		position: relative;
		animation: barGrow 0.6s ease-out both;
		cursor: default;
	}

	.bar:hover .bar-tooltip { opacity: 1; transform: translateX(-50%) translateY(-2px); }

	.bar-tooltip {
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 7px;
		color: #E6EDF3;
		background: rgba(11, 15, 23, 0.9);
		padding: 2px 5px;
		border-radius: 3px;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition: all 0.15s;
		border: 1px solid rgba(255,255,255,0.1);
	}

	@keyframes barGrow {
		from { height: 0 !important; opacity: 0; }
	}

	.revenue-bar { background: linear-gradient(to top, rgba(47, 139, 255, 0.4), rgba(47, 139, 255, 0.85)); }
	.expense-bar { background: linear-gradient(to top, rgba(255, 107, 107, 0.3), rgba(255, 107, 107, 0.7)); }

	.bar-month {
		font-size: 8px;
		color: #7F8A96;
		font-weight: 500;
	}

	.chart-legend {
		display: flex;
		gap: 16px;
		justify-content: center;
		margin-top: 10px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 9px;
		color: #9AA6B2;
	}

	.legend-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	.legend-dot.rev { background: #2F8BFF; }
	.legend-dot.exp { background: #ff6b6b; }

	/* ===== Trend Chart ===== */
	.trend-chart-wrap { position: relative; }
	.trend-svg { width: 100%; height: auto; display: block; }

	.area-animate {
		animation: chartFade 0.8s ease-out backwards;
		animation-delay: 0.2s;
	}

	.line-animate {
		stroke-dasharray: 800;
		stroke-dashoffset: 800;
		animation: lineReveal 1.4s ease-out forwards;
		animation-delay: 0.2s;
	}

	@keyframes lineReveal { to { stroke-dashoffset: 0; } }
	@keyframes chartFade { from { opacity: 0; } to { opacity: 1; } }

	.dot-animate {
		animation: dotPop 0.3s ease-out backwards;
	}

	@keyframes dotPop { from { r: 0; opacity: 0; } }

	.trend-months {
		display: flex;
		justify-content: space-between;
		padding: 4px 30px 0;
	}

	.trend-month { font-size: 8px; color: #7F8A96; }

	/* ===== Waterfall ===== */
	.waterfall-wrap { position: relative; }
	.waterfall-svg { width: 100%; height: auto; display: block; }

	.wf-bar {
		animation: barGrow 0.5s ease-out backwards;
	}

	.wf-labels {
		display: flex;
		justify-content: space-around;
		padding: 6px 25px 0;
	}

	.wf-label { font-size: 8px; color: #7F8A96; text-align: center; }

	/* ===== Donut ===== */
	.donut-layout {
		display: flex;
		gap: 20px;
		align-items: center;
	}

	.donut-svg {
		width: 110px;
		height: 110px;
		flex-shrink: 0;
	}

	.donut-animate {
		animation: donutDraw 0.7s ease-out backwards;
	}

	@keyframes donutDraw {
		from { stroke-dasharray: 0 300; }
	}

	.donut-legend {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.legend-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.legend-color {
		width: 8px;
		height: 8px;
		border-radius: 2px;
		flex-shrink: 0;
	}

	.legend-name { font-size: 11px; color: #9AA6B2; flex: 1; }
	.legend-pct { font-size: 11px; font-weight: 600; color: #E6EDF3; width: 28px; text-align: right; }
	.legend-amt { font-size: 10px; color: #7F8A96; width: 56px; text-align: right; font-variant-numeric: tabular-nums; }

	/* ===== Revenue Segments ===== */
	.segment-layout {
		display: flex;
		gap: 16px;
		align-items: center;
	}

	.segment-svg {
		width: 80px;
		height: 80px;
		flex-shrink: 0;
	}

	.segment-bars {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.seg-row {
		animation: cardUp 0.35s ease-out backwards;
	}

	.seg-info {
		display: flex;
		justify-content: space-between;
		margin-bottom: 4px;
	}

	.seg-name { font-size: 10px; color: #9AA6B2; }
	.seg-pct { font-size: 10px; font-weight: 600; color: #E6EDF3; }

	.seg-bar-track {
		width: 100%;
		height: 4px;
		background: rgba(255,255,255,0.06);
		border-radius: 2px;
		overflow: hidden;
	}

	.seg-bar-fill {
		height: 100%;
		border-radius: 2px;
		transition: width 0.8s ease-out;
		animation: barGrow 0.6s ease-out both;
	}

	/* ===== P&L Table ===== */
	.pl-table-wrap {
		overflow-x: auto;
		scrollbar-width: thin;
		scrollbar-color: rgba(47, 139, 255, 0.15) transparent;
	}

	.pl-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 10px;
	}

	.pl-table th {
		text-align: right;
		padding: 8px 10px;
		font-size: 9px;
		font-weight: 600;
		letter-spacing: 0.5px;
		color: #7F8A96;
		border-bottom: 1px solid rgba(255,255,255,0.06);
	}

	.pl-table th:first-child { text-align: left; }

	.pl-table td {
		text-align: right;
		padding: 7px 10px;
		font-variant-numeric: tabular-nums;
		color: #E6EDF3;
		border-bottom: 1px solid rgba(255,255,255,0.03);
	}

	.pl-table td:first-child { text-align: left; }

	.row-label { color: #9AA6B2 !important; }
	td.bold, .row-label.bold { font-weight: 600; }
	td.positive { color: #00ff88 !important; }
	td.negative { color: #ff6b6b !important; }

	.highlight-row td { background: rgba(47, 139, 255, 0.03); }
	.net-row td { border-bottom: 2px solid rgba(47, 139, 255, 0.15); }

	/* ===== Profit Bars ===== */
	.profit-bars {
		display: flex;
		gap: 4px;
		align-items: flex-end;
		height: 100px;
	}

	.profit-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		animation: cardUp 0.35s ease-out backwards;
	}

	.profit-bar-wrap {
		width: 100%;
		height: 70px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.profit-bar {
		width: 65%;
		background: linear-gradient(to top, rgba(0, 255, 136, 0.3), rgba(0, 255, 136, 0.75));
		border-radius: 3px 3px 0 0;
		min-height: 4px;
		animation: barGrow 0.5s ease-out both;
	}

	.profit-month { font-size: 8px; color: #7F8A96; }
	.profit-val { font-size: 7px; color: #00ff88; font-variant-numeric: tabular-nums; font-weight: 600; }

	/* ===== Responsive ===== */
	@media (max-width: 900px) {
		.kpi-row { grid-template-columns: repeat(3, 1fr); }
		.report-grid { grid-template-columns: 1fr; }
	}

	@media (max-width: 600px) {
		.kpi-row { grid-template-columns: repeat(2, 1fr); }
		.report-header { flex-direction: column; gap: 10px; align-items: flex-start; }
		.header-right { width: 100%; justify-content: space-between; }
	}
</style>
