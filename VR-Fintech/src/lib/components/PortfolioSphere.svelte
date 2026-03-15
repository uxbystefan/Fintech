<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import {
		MeshStandardMaterial,
		MeshPhysicalMaterial,
		TorusGeometry,
		SphereGeometry,
		Color,
		type Mesh,
		type Group
	} from 'three';

	let groupRef: Group | undefined = $state();
	let sphereRef: Mesh | undefined = $state();
	let pulseIntensity = $state(0);
	let time = $state(0);

	// Slow idle rotation + pulse
	useTask((delta) => {
		time += delta;
		if (groupRef) {
			groupRef.rotation.y += delta * 0.15;
		}
		// Pulsing emissive intensity
		pulseIntensity = 0.3 + Math.sin(time * 1.5) * 0.15;
	});

	const sphereMaterial = new MeshPhysicalMaterial({
		color: new Color('#1a3a6a'),
		emissive: new Color('#2F8BFF'),
		emissiveIntensity: 0.4,
		metalness: 0.7,
		roughness: 0.2,
		clearcoat: 1.0,
		clearcoatRoughness: 0.1,
		transparent: true,
		opacity: 0.85,
		envMapIntensity: 1.5
	});

	// Ring materials
	const ringMaterial1 = new MeshStandardMaterial({
		color: new Color('#2F8BFF'),
		emissive: new Color('#2F8BFF'),
		emissiveIntensity: 0.8,
		metalness: 0.9,
		roughness: 0.1,
		transparent: true,
		opacity: 0.6,
		wireframe: true
	});

	const ringMaterial2 = new MeshStandardMaterial({
		color: new Color('#59B0FF'),
		emissive: new Color('#59B0FF'),
		emissiveIntensity: 0.6,
		metalness: 0.9,
		roughness: 0.1,
		transparent: true,
		opacity: 0.4,
		wireframe: true
	});

	const ringMaterial3 = new MeshStandardMaterial({
		color: new Color('#1a5cff'),
		emissive: new Color('#1a5cff'),
		emissiveIntensity: 0.5,
		metalness: 0.9,
		roughness: 0.1,
		transparent: true,
		opacity: 0.35,
		wireframe: true
	});

	// Ring geometries (different sizes for asset classes)
	const ring1Geo = new TorusGeometry(1.3, 0.02, 16, 100);
	const ring2Geo = new TorusGeometry(1.6, 0.015, 16, 80);
	const ring3Geo = new TorusGeometry(1.9, 0.012, 16, 60);
	const sphereGeo = new SphereGeometry(0.8, 64, 64);
</script>

<!-- PortfolioSphere: glowing centerpiece -->
<T.Group bind:ref={groupRef} position.y={0.5}>
	<!-- Core sphere -->
	<T.Mesh
		bind:ref={sphereRef}
		geometry={sphereGeo}
		material={sphereMaterial}
		scale={[1 + Math.sin(time * 1.2) * 0.02, 1 + Math.sin(time * 1.2) * 0.02, 1 + Math.sin(time * 1.2) * 0.02]}
	/>

	<!-- Inner glow point light -->
	<T.PointLight
		color="#2F8BFF"
		intensity={pulseIntensity * 8}
		distance={5}
		decay={2}
	/>

	<!-- Orbiting ring 1 — Equities -->
	<T.Mesh
		geometry={ring1Geo}
		material={ringMaterial1}
		rotation.x={Math.PI / 2 + Math.sin(time * 0.3) * 0.1}
		rotation.z={time * 0.2}
	/>

	<!-- Orbiting ring 2 — Bonds -->
	<T.Mesh
		geometry={ring2Geo}
		material={ringMaterial2}
		rotation.x={Math.PI / 3}
		rotation.y={time * 0.15}
		rotation.z={Math.cos(time * 0.25) * 0.15}
	/>

	<!-- Orbiting ring 3 — Crypto -->
	<T.Mesh
		geometry={ring3Geo}
		material={ringMaterial3}
		rotation.x={Math.PI / 4.5}
		rotation.y={-time * 0.1}
		rotation.z={Math.sin(time * 0.2) * 0.2}
	/>

	<!-- Subtle secondary glow -->
	<T.PointLight
		color="#59B0FF"
		intensity={1.5}
		distance={4}
		decay={2}
		position.y={1.2}
	/>

	<!-- Floating metric labels around the sphere -->
	<!-- Total Portfolio -->
	<HTML transform position={[0, 1.6, 0]} scale={0.04} pointerEvents="none" sprite>
		<div class="metric-badge primary">
			<span class="metric-label">TOTAL PORTFOLIO</span>
			<span class="metric-value">$1,070,682</span>
			<span class="metric-change up">↑ 4.2% this month</span>
		</div>
	</HTML>

	<!-- Ring 1 label: Equities -->
	<HTML transform position={[1.5, 0.3, 0.5]} scale={0.03} pointerEvents="none" sprite>
		<div class="ring-label">
			<span class="ring-dot" style="background: #2F8BFF"></span>
			<div class="ring-info">
				<span class="ring-name">Equities</span>
				<span class="ring-alloc">54% • $578,168</span>
			</div>
		</div>
	</HTML>

	<!-- Ring 2 label: Bonds -->
	<HTML transform position={[-1.6, -0.1, 0.7]} scale={0.03} pointerEvents="none" sprite>
		<div class="ring-label">
			<span class="ring-dot" style="background: #59B0FF"></span>
			<div class="ring-info">
				<span class="ring-name">Fixed Income</span>
				<span class="ring-alloc">28% • $299,791</span>
			</div>
		</div>
	</HTML>

	<!-- Ring 3 label: Crypto -->
	<HTML transform position={[1.0, -0.9, 1.0]} scale={0.03} pointerEvents="none" sprite>
		<div class="ring-label">
			<span class="ring-dot" style="background: #1a5cff"></span>
			<div class="ring-info">
				<span class="ring-name">Digital Assets</span>
				<span class="ring-alloc">18% • $192,723</span>
			</div>
		</div>
	</HTML>

	<!-- Performance indicator -->
	<HTML transform position={[-0.5, -1.4, 0.3]} scale={0.025} pointerEvents="none" sprite>
		<div class="perf-badge">
			<span class="perf-item">YTD <span class="up">+12.4%</span></span>
			<span class="perf-sep">•</span>
			<span class="perf-item">1Y <span class="up">+24.8%</span></span>
			<span class="perf-sep">•</span>
			<span class="perf-item">Sharpe <span class="neutral">1.82</span></span>
		</div>
	</HTML>
</T.Group>

<style>
	.metric-badge {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		background: rgba(5, 7, 10, 0.8);
		border: 1px solid rgba(47, 139, 255, 0.25);
		border-radius: 10px;
		padding: 10px 18px;
		backdrop-filter: blur(8px);
		white-space: nowrap;
		font-family: 'Inter', system-ui, sans-serif;
		box-shadow: 0 0 20px rgba(47, 139, 255, 0.1);
	}
	.metric-label {
		font-size: 8px;
		font-weight: 500;
		letter-spacing: 1.5px;
		color: rgba(255,255,255,0.45);
		text-transform: uppercase;
	}
	.metric-value {
		font-size: 22px;
		font-weight: 700;
		color: #E6EDF3;
		font-variant-numeric: tabular-nums;
		text-shadow: 0 0 15px rgba(47, 139, 255, 0.3);
	}
	.metric-change {
		font-size: 9px;
		font-weight: 500;
		letter-spacing: 0.5px;
	}
	.metric-change.up,.up { color: #00ff88; }

	.ring-label {
		display: flex;
		align-items: center;
		gap: 8px;
		background: rgba(5, 7, 10, 0.7);
		border: 1px solid rgba(255,255,255,0.06);
		border-radius: 8px;
		padding: 7px 12px;
		font-family: 'Inter', system-ui, sans-serif;
		white-space: nowrap;
	}
	.ring-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
		box-shadow: 0 0 6px currentColor;
	}
	.ring-info {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	.ring-name {
		font-size: 10px;
		font-weight: 600;
		color: #E6EDF3;
		letter-spacing: 0.3px;
	}
	.ring-alloc {
		font-size: 9px;
		color: #9AA6B2;
		font-variant-numeric: tabular-nums;
	}

	.perf-badge {
		display: flex;
		align-items: center;
		gap: 8px;
		background: rgba(5, 7, 10, 0.65);
		border: 1px solid rgba(255,255,255,0.04);
		border-radius: 6px;
		padding: 6px 12px;
		font-family: 'Inter', system-ui, sans-serif;
		white-space: nowrap;
	}
	.perf-item {
		font-size: 9px;
		color: #9AA6B2;
		font-variant-numeric: tabular-nums;
	}
	.perf-sep {
		color: rgba(255,255,255,0.15);
		font-size: 8px;
	}
	.neutral { color: #59B0FF; }
</style>
