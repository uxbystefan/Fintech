<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import {
		MeshPhysicalMaterial,
		MeshStandardMaterial,
		BoxGeometry,
		PlaneGeometry,
		TubeGeometry,
		CatmullRomCurve3,
		Vector3,
		Color,
		type Group,
		BufferGeometry,
		Float32BufferAttribute,
		LineBasicMaterial
	} from 'three';

	let time = $state(0);
	let panelRef: Group | undefined = $state();

	useTask((delta) => {
		time += delta;
	});

	// Panel glass material
	const glassMaterial = new MeshPhysicalMaterial({
		color: new Color('#0a1628'),
		emissive: new Color('#0d1f3c'),
		emissiveIntensity: 0.1,
		metalness: 0.1,
		roughness: 0.05,
		transparent: true,
		opacity: 0.35,
		transmission: 0.6,
		thickness: 0.05,
		clearcoat: 1.0,
		clearcoatRoughness: 0.1,
		ior: 1.5,
		side: 2
	});

	// Panel border material
	const borderMaterial = new MeshStandardMaterial({
		color: new Color('#2F8BFF'),
		emissive: new Color('#2F8BFF'),
		emissiveIntensity: 0.6,
		metalness: 0.9,
		roughness: 0.1,
		transparent: true,
		opacity: 0.7
	});

	// Chart line material
	const chartLineMaterial = new LineBasicMaterial({
		color: new Color('#2F8BFF'),
		transparent: true,
		opacity: 0.9
	});

	// Panel geometry
	const panelGeo = new BoxGeometry(3.5, 2.2, 0.02);

	// Border geometries (thin boxes forming panel frame)
	const borderH = new BoxGeometry(3.5, 0.015, 0.025);
	const borderV = new BoxGeometry(0.015, 2.2, 0.025);

	// Generate chart data points - a financial line chart
	function generateChartPoints(phase: number): Vector3[] {
		const points: Vector3[] = [];
		const numPoints = 40;
		for (let i = 0; i < numPoints; i++) {
			const x = (i / (numPoints - 1)) * 2.8 - 1.4;
			const baseY = Math.sin(i * 0.3 + phase) * 0.25
				+ Math.sin(i * 0.15 + phase * 0.7) * 0.15
				+ Math.cos(i * 0.08 + phase * 1.3) * 0.1
				+ (i / numPoints) * 0.3 - 0.15; // slight uptrend
			points.push(new Vector3(x, baseY, 0.02));
		}
		return points;
	}

	// Create tube from chart points
	function createChartCurve(phase: number): CatmullRomCurve3 {
		return new CatmullRomCurve3(generateChartPoints(phase), false, 'catmullrom', 0.5);
	}

	// Grid line positions
	const hGridLines = [-0.6, -0.2, 0.2, 0.6];
	const vGridLines = [-1.0, -0.5, 0.0, 0.5, 1.0];

	const gridMaterial = new MeshStandardMaterial({
		color: new Color('#2F8BFF'),
		emissive: new Color('#2F8BFF'),
		emissiveIntensity: 0.2,
		transparent: true,
		opacity: 0.12
	});

	const hGridGeo = new BoxGeometry(2.8, 0.003, 0.001);
	const vGridGeo = new BoxGeometry(0.003, 1.6, 0.001);

	// Second chart (accent line)
	const accentLineMaterial = new LineBasicMaterial({
		color: new Color('#59B0FF'),
		transparent: true,
		opacity: 0.5
	});

	// Bar chart data for small bars at bottom
	const barCount = 12;
	const barGeo = new BoxGeometry(0.12, 1, 0.005);
	const barMaterial = new MeshStandardMaterial({
		color: new Color('#2F8BFF'),
		emissive: new Color('#2F8BFF'),
		emissiveIntensity: 0.4,
		transparent: true,
		opacity: 0.3
	});
</script>

<!-- HolographicChartPanel: floating glass chart display -->
<T.Group
	bind:ref={panelRef}
	position={[0, 1.2, -4]}
	rotation.y={0}
	position.y={1.2 + Math.sin(time * 0.5) * 0.08}
>
	<!-- Glass panel -->
	<T.Mesh geometry={panelGeo} material={glassMaterial} />

	<!-- Panel borders -->
	<T.Mesh geometry={borderH} material={borderMaterial} position.y={1.1} />
	<T.Mesh geometry={borderH} material={borderMaterial} position.y={-1.1} />
	<T.Mesh geometry={borderV} material={borderMaterial} position.x={1.75} />
	<T.Mesh geometry={borderV} material={borderMaterial} position.x={-1.75} />

	<!-- Grid lines horizontal -->
	{#each hGridLines as gy}
		<T.Mesh geometry={hGridGeo} material={gridMaterial} position={[0, gy, 0.012]} />
	{/each}

	<!-- Grid lines vertical -->
	{#each vGridLines as gx}
		<T.Mesh geometry={vGridGeo} material={gridMaterial} position={[gx, 0, 0.012]} />
	{/each}

	<!-- Primary chart line (tube) -->
	{@const curve = createChartCurve(time * 0.15)}
	{@const tubeGeo = new TubeGeometry(curve, 80, 0.012, 8, false)}
	<T.Mesh geometry={tubeGeo}>
		<T.MeshStandardMaterial
			color="#2F8BFF"
			emissive="#2F8BFF"
			emissiveIntensity={0.9}
			transparent
			opacity={0.9}
		/>
	</T.Mesh>

	<!-- Secondary chart line -->
	{@const curve2 = createChartCurve(time * 0.15 + 2.5)}
	{@const tubeGeo2 = new TubeGeometry(curve2, 80, 0.008, 8, false)}
	<T.Mesh geometry={tubeGeo2} position.y={-0.2}>
		<T.MeshStandardMaterial
			color="#59B0FF"
			emissive="#59B0FF"
			emissiveIntensity={0.6}
			transparent
			opacity={0.5}
		/>
	</T.Mesh>

	<!-- Volume bars at bottom -->
	{#each { length: barCount } as _, i}
		{@const barHeight = 0.15 + Math.sin(time * 0.8 + i * 0.5) * 0.1 + Math.sin(i * 1.7) * 0.01}
		{@const barX = (i / (barCount - 1)) * 2.8 - 1.4}
		<T.Mesh
			geometry={barGeo}
			material={barMaterial}
			position={[barX, -0.85 + barHeight * 0.5, 0.012]}
			scale={[1, barHeight, 1]}
		/>
	{/each}

	<!-- Panel glow -->
	<T.PointLight
		color="#2F8BFF"
		intensity={2}
		distance={5}
		decay={2}
		position.z={0.5}
	/>

	<!-- Corner accent lights -->
	<T.PointLight color="#59B0FF" intensity={0.5} distance={2} decay={2} position={[1.75, 1.1, 0.3]} />
	<T.PointLight color="#59B0FF" intensity={0.5} distance={2} decay={2} position={[-1.75, -1.1, 0.3]} />
</T.Group>
