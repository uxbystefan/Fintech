<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { OrbitControls, Float, Grid, interactivity } from '@threlte/extras';
	import { FogExp2, Color } from 'three';

	interactivity();

	import PortfolioSphere from './PortfolioSphere.svelte';
	import FloatingBankCards from './FloatingBankCards.svelte';
	import HolographicChartPanel from './HolographicChartPanel.svelte';
	import DataParticles from './DataParticles.svelte';

	let {
		onSelectCard = (_i: number) => {},
		selectedIndex = null as number | null
	}: {
		onSelectCard?: (index: number) => void;
		selectedIndex?: number | null;
	} = $props();

	const { scene } = useThrelte();
	scene.fog = new FogExp2(new Color('#05070A').getHex(), 0.06);
	scene.background = new Color('#05070A');
</script>

<!-- Camera -->
<T.PerspectiveCamera
	makeDefault
	position={[0, 2, 8]}
	fov={50}
	near={0.1}
	far={100}
>
	<OrbitControls
		enableDamping
		dampingFactor={0.05}
		enablePan={false}
		minDistance={4}
		maxDistance={16}
		minPolarAngle={0.3}
		maxPolarAngle={Math.PI / 1.8}
		autoRotate={selectedIndex === null}
		autoRotateSpeed={0.3}
		target={[0, 0.8, 0]}
	/>
</T.PerspectiveCamera>

<!-- ===== Lighting ===== -->

<!-- Low ambient -->
<T.AmbientLight color="#0a1628" intensity={0.3} />

<!-- Main blue directional light -->
<T.DirectionalLight
	color="#2F8BFF"
	intensity={0.6}
	position={[5, 8, 3]}
	castShadow={false}
/>

<!-- Fill light from below -->
<T.DirectionalLight
	color="#1a3a6a"
	intensity={0.15}
	position={[-3, -5, 2]}
/>

<!-- Rim light -->
<T.DirectionalLight
	color="#59B0FF"
	intensity={0.25}
	position={[-5, 3, -5]}
/>

<!-- ===== Ground grid ===== -->
<Grid
	position.y={-2}
	cellColor="#2F8BFF"
	sectionColor="#1a3a6a"
	cellSize={0.5}
	sectionSize={2}
	gridSize={[30, 30]}
	followCamera={false}
	fadeDistance={25}
	fadeStrength={1}
	cellThickness={0.5}
	sectionThickness={1}
	type="lines"
/>

<!-- ===== Scene objects ===== -->

<!-- Central portfolio sphere -->
<Float floatIntensity={0.3} speed={1.5}>
	<PortfolioSphere />
</Float>

<!-- Floating bank cards around the room -->
<FloatingBankCards {onSelectCard} {selectedIndex} />

<!-- Holographic chart panel behind sphere -->
<HolographicChartPanel />

<!-- Data particles drifting through the room -->
<DataParticles />

<!-- ===== Accent point lights ===== -->
<T.PointLight color="#2F8BFF" intensity={1.5} distance={8} decay={2} position={[-4, 3, -3]} />
<T.PointLight color="#59B0FF" intensity={1.0} distance={6} decay={2} position={[4, -1, 2]} />
<T.PointLight color="#1a5cff" intensity={0.8} distance={10} decay={2} position={[0, -2, -5]} />
