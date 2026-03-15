<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import {
		MeshPhysicalMaterial,
		BoxGeometry,
		Color,
		MeshStandardMaterial,
		PlaneGeometry
	} from 'three';

	import { cards, type CardData } from '$lib/cardData';

	let {
		onSelectCard = (_i: number) => {},
		selectedIndex = null as number | null
	}: {
		onSelectCard?: (index: number) => void;
		selectedIndex?: number | null;
	} = $props();

	let time = $state(0);
	let hoveredIndex = $state(-1);
	let cardFocus = $state(cards.map(() => 0));

	const FOCUS_POS: [number, number, number] = [0, 1.2, 4.2];
	const LERP_SPEED = 5;

	function lerp(a: number, b: number, t: number) {
		return a + (b - a) * t;
	}

	useTask((delta) => {
		time += delta;
		const t = Math.min(delta * LERP_SPEED, 1);
		for (let i = 0; i < cards.length; i++) {
			const target = i === selectedIndex ? 1 : 0;
			const next = cardFocus[i] + (target - cardFocus[i]) * t;
			cardFocus[i] = Math.abs(next - target) < 0.002 ? target : next;
		}
	});

	function anyFocus(): number {
		return Math.max(...cardFocus);
	}

	function getPos(i: number): [number, number, number] {
		const c = cards[i];
		const f = cardFocus[i];
		const af = anyFocus();
		const dampedHover = Math.sin(time * 0.8 + c.hoverOffset) * 0.15 * (1 - af);
		const hoverBoost = (hoveredIndex === i && selectedIndex === null) ? 0.2 : 0;

		if (f > 0.01) {
			return [
				lerp(c.position[0], FOCUS_POS[0], f),
				lerp(c.position[1], FOCUS_POS[1], f),
				lerp(c.position[2], FOCUS_POS[2], f)
			];
		}
		return [
			c.position[0] * (1 + af * 0.6),
			c.position[1] + dampedHover + hoverBoost - af * 3,
			c.position[2] - af * 8
		];
	}

	function getRot(i: number): [number, number, number] {
		const c = cards[i];
		const f = cardFocus[i];
		const rx = c.rotation[0] + Math.sin(time * 0.5 + c.hoverOffset) * 0.03;
		const ry = c.rotation[1] + Math.sin(time * 0.3 + c.hoverOffset) * 0.05;
		const rz = c.rotation[2];
		if (f > 0.01) {
			return [rx * (1 - f), ry * (1 - f), rz * (1 - f)];
		}
		return [rx, ry, rz];
	}

	function getScale(i: number): number {
		const f = cardFocus[i];
		const af = anyFocus();
		if (f > 0.01) return lerp(1.0, 1.8, f);
		const hv = (hoveredIndex === i && selectedIndex === null) ? 1.15 : 1.0;
		return hv * lerp(1.0, 0.15, af);
	}

	function getOpacity(i: number): number {
		const f = cardFocus[i];
		const af = anyFocus();
		if (f > 0.01) return lerp(0.8, 1.0, f);
		return 0.8 * (1 - af);
	}

	const cardGeo = new BoxGeometry(1.6, 1.0, 0.02);

	function createCardMat(color: string, opacity: number, hovered: boolean) {
		return new MeshPhysicalMaterial({
			color: new Color(color),
			emissive: new Color(color),
			emissiveIntensity: hovered ? 0.45 : 0.15,
			metalness: 0.95,
			roughness: 0.15,
			clearcoat: 1.0,
			clearcoatRoughness: 0.05,
			transparent: true,
			opacity,
			reflectivity: 1.0
		});
	}

	const chipGeo = new PlaneGeometry(0.22, 0.17);
	const chipMaterial = new MeshStandardMaterial({
		color: new Color('#c4a24a'),
		emissive: new Color('#c4a24a'),
		emissiveIntensity: 0.3,
		metalness: 1.0,
		roughness: 0.3
	});

	const contactlessGeo = new PlaneGeometry(0.08, 0.08);
	const contactlessMat = new MeshStandardMaterial({
		color: new Color('#e0e0e0'),
		emissive: new Color('#ffffff'),
		emissiveIntensity: 0.2,
		transparent: true,
		opacity: 0.6
	});

	const stripGeo = new PlaneGeometry(1.5, 0.12);
	const stripMaterial = new MeshStandardMaterial({
		color: new Color('#111'),
		metalness: 0.8,
		roughness: 0.5
	});
</script>

{#each cards as card, i}
	{@const pos = getPos(i)}
	{@const rot = getRot(i)}
	{@const scl = getScale(i)}
	{@const opac = getOpacity(i)}
	{@const isHovered = hoveredIndex === i && selectedIndex === null}
	{@const isFocused = cardFocus[i] > 0.5}
	{#if opac > 0.01}
		<T.Group
			position={pos}
			rotation={rot}
			scale={[scl, scl, scl]}
		>
			<T.Mesh
				geometry={cardGeo}
				material={createCardMat(card.color, opac, isHovered)}
				onpointerenter={() => { if (selectedIndex === null) hoveredIndex = i; }}
				onpointerleave={() => { hoveredIndex = -1; }}
				onclick={() => { onSelectCard(i); }}
			/>

			<T.Mesh geometry={chipGeo} material={chipMaterial} position={[-0.45, 0.1, 0.015]} />
			<T.Mesh geometry={contactlessGeo} material={contactlessMat} position={[-0.18, 0.1, 0.015]} />
			<T.Mesh geometry={stripGeo} material={stripMaterial} position={[0, 0.2, -0.015]} />

			<HTML transform position={[0, 0, 0.018]} scale={0.045} pointerEvents="none">
				<div class="card-face" style="--card-color: {card.color}">
					<div class="card-top-row">
						<span class="card-brand">{card.brand}</span>
						<span class="card-type-badge">{card.type}</span>
					</div>
					<div class="card-number-row">{card.cardNumber}</div>
					<div class="card-bottom-row">
						<div class="card-info-col">
							<span class="card-micro-label">CARD HOLDER</span>
							<span class="card-holder-name">{card.holderName}</span>
						</div>
						<div class="card-info-col right">
							<span class="card-micro-label">VALID THRU</span>
							<span class="card-expiry-val">{card.expiry}</span>
						</div>
					</div>
				</div>
			</HTML>

			{#if isHovered}
				<HTML transform position={[0, 0.72, 0.1]} scale={0.035} pointerEvents="none">
					<div class="card-tooltip" style="--card-color: {card.color}">
						<span class="tooltip-label">Balance</span>
						<span class="tooltip-value">{card.balance}</span>
						<span class="tooltip-hint">Click to view details →</span>
					</div>
				</HTML>
			{/if}

			<T.PointLight
				color={card.color}
				intensity={isFocused ? 6 : isHovered ? 4 : 0.8}
				distance={isFocused ? 8 : 3}
				decay={2}
			/>
		</T.Group>
	{/if}
{/each}

<style>
	.card-face {
		width: 340px;
		height: 210px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 16px 20px;
		font-family: 'Inter', system-ui, sans-serif;
		color: rgba(255, 255, 255, 0.92);
		pointer-events: none;
		user-select: none;
	}
	.card-top-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	.card-brand {
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 2.5px;
		text-shadow: 0 0 8px var(--card-color);
	}
	.card-type-badge {
		font-size: 8px;
		font-weight: 500;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		opacity: 0.7;
		background: rgba(255,255,255,0.08);
		padding: 3px 8px;
		border-radius: 3px;
	}
	.card-number-row {
		font-size: 16px;
		font-weight: 500;
		letter-spacing: 3px;
		font-variant-numeric: tabular-nums;
		text-shadow: 0 1px 4px rgba(0,0,0,0.4);
		padding-left: 2px;
	}
	.card-bottom-row {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}
	.card-info-col {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.card-info-col.right { text-align: right; }
	.card-micro-label {
		font-size: 6px;
		font-weight: 500;
		letter-spacing: 1.2px;
		opacity: 0.5;
		text-transform: uppercase;
	}
	.card-holder-name {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 1.5px;
	}
	.card-expiry-val {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 1px;
		font-variant-numeric: tabular-nums;
	}

	/* Hover tooltip */
	.card-tooltip {
		background: rgba(5, 7, 10, 0.85);
		border: 1px solid var(--card-color);
		border-radius: 8px;
		padding: 10px 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		backdrop-filter: blur(12px);
		box-shadow: 0 0 20px color-mix(in srgb, var(--card-color) 30%, transparent);
		white-space: nowrap;
		font-family: 'Inter', system-ui, sans-serif;
	}
	.tooltip-label {
		font-size: 8px;
		font-weight: 500;
		letter-spacing: 1.5px;
		color: rgba(255,255,255,0.5);
		text-transform: uppercase;
	}
	.tooltip-value {
		font-size: 18px;
		font-weight: 700;
		color: #fff;
		font-variant-numeric: tabular-nums;
		text-shadow: 0 0 10px var(--card-color);
	}
	.tooltip-hint {
		font-size: 7px;
		color: var(--card-color);
		letter-spacing: 0.5px;
		opacity: 0.8;
		margin-top: 2px;
	}
</style>
