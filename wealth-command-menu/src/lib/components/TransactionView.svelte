<script lang="ts">
	import { onMount } from 'svelte';
	import { Check, Loader2, ArrowRight } from 'lucide-svelte';

	type TxState = 'preview' | 'processing' | 'sent';

	let { onback }: { onback: () => void } = $props();

	let state = $state<TxState>('preview');
	let progressWidth = $state(0);

	function send() {
		state = 'processing';
		progressWidth = 0;

		// Animate progress bar
		const start = performance.now();
		const duration = 2200;

		function tick(now: number) {
			const elapsed = now - start;
			progressWidth = Math.min((elapsed / duration) * 100, 100);
			if (elapsed < duration) {
				requestAnimationFrame(tick);
			} else {
				state = 'sent';
			}
		}

		requestAnimationFrame(tick);
	}

	function reset() {
		state = 'preview';
		progressWidth = 0;
		onback();
	}
</script>

<div class="transaction-view">
	{#if state === 'preview'}
		<div class="tx-content" style="animation: txFadeIn 0.4s var(--transition-decel) both">
			<button class="back-btn" onclick={onback}>
				<span class="back-arrow">←</span>
				<span>Back</span>
			</button>

			<div class="tx-header">
				<span class="tx-label">Send Money</span>
			</div>

			<div class="tx-amount-row">
				<span class="tx-amount">$2,450</span>
				<span class="tx-arrow-wrap">
					<ArrowRight size={18} strokeWidth={1.5} />
				</span>
				<span class="tx-recipient">Alex Morgan</span>
			</div>

			<div class="tx-details">
				<div class="tx-detail-row">
					<span class="tx-detail-label">From</span>
					<span class="tx-detail-value">Main Account ••4821</span>
				</div>
				<div class="tx-detail-row">
					<span class="tx-detail-label">Fee</span>
					<span class="tx-detail-value">$0.00</span>
				</div>
				<div class="tx-detail-row">
					<span class="tx-detail-label">Arrives</span>
					<span class="tx-detail-value">Instantly</span>
				</div>
			</div>

			<button class="send-btn" onclick={send}>
				<span class="send-btn-shimmer"></span>
				<span class="send-btn-text">Confirm & Send</span>
			</button>
		</div>

	{:else if state === 'processing'}
		<div class="tx-processing" style="animation: txFadeIn 0.35s var(--transition-decel) both">
			<div class="processing-spinner">
				<Loader2 size={28} strokeWidth={1.5} class="spinner-icon" />
			</div>
			<span class="processing-label">Processing Transfer</span>
			<span class="processing-amount">$2,450 → Alex Morgan</span>

			<div class="progress-track">
				<div class="progress-fill" style="width: {progressWidth}%"></div>
			</div>
		</div>

	{:else if state === 'sent'}
		<div class="tx-sent" style="animation: txFadeIn 0.35s var(--transition-decel) both">
			<div class="success-ring">
				<div class="success-check">
					<Check size={28} strokeWidth={2.5} />
				</div>
				<div class="success-pulse"></div>
			</div>
			<span class="sent-label">Sent Successfully</span>
			<span class="sent-amount">$2,450 → Alex Morgan</span>
			<button class="done-btn" onclick={reset}>Done</button>
		</div>
	{/if}
</div>

<style>
	.transaction-view {
		padding: 8px 0;
		min-height: 260px;
		display: flex;
		flex-direction: column;
	}

	/* Back button */
	.back-btn {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		border: none;
		background: transparent;
		color: var(--text-secondary);
		font-family: var(--font);
		font-size: 13px;
		cursor: pointer;
		transition: color 0.2s;
	}

	.back-btn:hover {
		color: var(--gold);
	}

	.back-arrow {
		font-size: 16px;
		line-height: 1;
	}

	/* Content */
	.tx-content {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.tx-header {
		padding: 4px 24px 16px;
	}

	.tx-label {
		font-size: 11px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		color: var(--text-muted);
	}

	.tx-amount-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		padding: 16px 24px 24px;
	}

	.tx-amount {
		font-size: 32px;
		font-weight: 700;
		color: var(--text-primary);
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.5px;
	}

	.tx-arrow-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--gold-dim);
		color: var(--gold);
	}

	.tx-recipient {
		font-size: 18px;
		font-weight: 500;
		color: var(--text-primary);
	}

	.tx-details {
		padding: 0 24px;
		margin-bottom: 20px;
	}

	.tx-detail-row {
		display: flex;
		justify-content: space-between;
		padding: 10px 0;
		border-bottom: 1px solid var(--glass-border);
	}

	.tx-detail-row:last-child {
		border-bottom: none;
	}

	.tx-detail-label {
		font-size: 13px;
		color: var(--text-muted);
	}

	.tx-detail-value {
		font-size: 13px;
		color: var(--text-secondary);
		font-variant-numeric: tabular-nums;
	}

	/* Send button */
	.send-btn {
		position: relative;
		margin: auto 24px 16px;
		padding: 14px 24px;
		border: none;
		border-radius: var(--radius-md);
		background: linear-gradient(135deg, var(--gold) 0%, #b8922a 100%);
		cursor: pointer;
		overflow: hidden;
		transition: transform 0.3s var(--transition-smooth), box-shadow 0.3s;
	}

	.send-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 8px 32px rgba(200, 162, 74, 0.25);
	}

	.send-btn:active {
		transform: translateY(0);
	}

	.send-btn-shimmer {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			105deg,
			transparent 30%,
			rgba(255, 255, 255, 0.15) 50%,
			transparent 70%
		);
		background-size: 200% 100%;
		animation: btnShimmer 2.5s ease-in-out infinite;
	}

	.send-btn-text {
		position: relative;
		font-family: var(--font);
		font-size: 14px;
		font-weight: 600;
		color: #0a0a0a;
		letter-spacing: 0.3px;
	}

	/* Processing */
	.tx-processing {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		gap: 12px;
		padding: 32px 24px;
	}

	.processing-spinner {
		color: var(--gold);
		animation: spin 1.2s linear infinite;
	}

	.processing-label {
		font-size: 16px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.processing-amount {
		font-size: 13px;
		color: var(--text-secondary);
	}

	.progress-track {
		width: 100%;
		max-width: 200px;
		height: 3px;
		background: var(--surface);
		border-radius: 2px;
		margin-top: 8px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--gold), var(--gold-light));
		border-radius: 2px;
		transition: width 0.1s linear;
		box-shadow: 0 0 12px var(--gold-glow);
	}

	/* Sent */
	.tx-sent {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		gap: 12px;
		padding: 32px 24px;
	}

	.success-ring {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
	}

	.success-check {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--green), #2ab886);
		color: #050505;
		animation: checkPop 0.4s var(--transition-spring) both;
		z-index: 1;
	}

	.success-pulse {
		position: absolute;
		inset: -4px;
		border-radius: 50%;
		background: var(--green);
		opacity: 0;
		animation: successPulse 1.5s ease-out 0.3s;
	}

	.sent-label {
		font-size: 18px;
		font-weight: 600;
		color: var(--green);
	}

	.sent-amount {
		font-size: 13px;
		color: var(--text-secondary);
	}

	.done-btn {
		margin-top: 8px;
		padding: 10px 32px;
		border: 1px solid var(--gold-border);
		border-radius: var(--radius-pill);
		background: transparent;
		color: var(--gold);
		font-family: var(--font);
		font-size: 13px;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.3s, border-color 0.3s;
	}

	.done-btn:hover {
		background: var(--gold-dim);
		border-color: var(--gold);
	}

	/* Animations */
	@keyframes txFadeIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	@keyframes btnShimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	@keyframes checkPop {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes successPulse {
		0% {
			transform: scale(1);
			opacity: 0.4;
		}
		100% {
			transform: scale(2.2);
			opacity: 0;
		}
	}
</style>
