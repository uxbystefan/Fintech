<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import {
		BufferGeometry,
		Float32BufferAttribute,
		PointsMaterial,
		Color,
		AdditiveBlending
	} from 'three';

	const PARTICLE_COUNT = 600;
	const SPREAD = 12;

	// Create particle positions and velocities
	const positions = new Float32Array(PARTICLE_COUNT * 3);
	const sizes = new Float32Array(PARTICLE_COUNT);
	const velocities: { x: number; y: number; z: number }[] = [];

	for (let i = 0; i < PARTICLE_COUNT; i++) {
		positions[i * 3] = (Math.random() - 0.5) * SPREAD;
		positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
		positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;

		sizes[i] = Math.random() * 3 + 1;

		velocities.push({
			x: (Math.random() - 0.5) * 0.003,
			y: (Math.random() - 0.5) * 0.002 + 0.001, // slight upward drift
			z: (Math.random() - 0.5) * 0.003
		});
	}

	const geometry = new BufferGeometry();
	geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
	geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));

	const material = new PointsMaterial({
		color: new Color('#2F8BFF'),
		size: 0.04,
		transparent: true,
		opacity: 0.6,
		blending: AdditiveBlending,
		depthWrite: false,
		sizeAttenuation: true
	});

	// Secondary particle layer (dimmer, larger)
	const positions2 = new Float32Array(200 * 3);
	const velocities2: { x: number; y: number; z: number }[] = [];
	for (let i = 0; i < 200; i++) {
		positions2[i * 3] = (Math.random() - 0.5) * SPREAD * 1.5;
		positions2[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 1.5;
		positions2[i * 3 + 2] = (Math.random() - 0.5) * SPREAD * 1.5;
		velocities2.push({
			x: (Math.random() - 0.5) * 0.001,
			y: (Math.random() - 0.5) * 0.001,
			z: (Math.random() - 0.5) * 0.001
		});
	}

	const geometry2 = new BufferGeometry();
	geometry2.setAttribute('position', new Float32BufferAttribute(positions2, 3));

	const material2 = new PointsMaterial({
		color: new Color('#59B0FF'),
		size: 0.06,
		transparent: true,
		opacity: 0.25,
		blending: AdditiveBlending,
		depthWrite: false,
		sizeAttenuation: true
	});

	useTask(() => {
		// Animate primary particles
		const posAttr = geometry.getAttribute('position');
		const posArray = posAttr.array as Float32Array;
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			posArray[i * 3] += velocities[i].x;
			posArray[i * 3 + 1] += velocities[i].y;
			posArray[i * 3 + 2] += velocities[i].z;

			// Wrap around bounds
			const half = SPREAD / 2;
			if (posArray[i * 3] > half) posArray[i * 3] = -half;
			if (posArray[i * 3] < -half) posArray[i * 3] = half;
			if (posArray[i * 3 + 1] > half) posArray[i * 3 + 1] = -half;
			if (posArray[i * 3 + 1] < -half) posArray[i * 3 + 1] = half;
			if (posArray[i * 3 + 2] > half) posArray[i * 3 + 2] = -half;
			if (posArray[i * 3 + 2] < -half) posArray[i * 3 + 2] = half;
		}
		posAttr.needsUpdate = true;

		// Animate secondary particles
		const posAttr2 = geometry2.getAttribute('position');
		const posArray2 = posAttr2.array as Float32Array;
		for (let i = 0; i < 200; i++) {
			posArray2[i * 3] += velocities2[i].x;
			posArray2[i * 3 + 1] += velocities2[i].y;
			posArray2[i * 3 + 2] += velocities2[i].z;

			const half2 = SPREAD * 0.75;
			if (posArray2[i * 3] > half2) posArray2[i * 3] = -half2;
			if (posArray2[i * 3] < -half2) posArray2[i * 3] = half2;
			if (posArray2[i * 3 + 1] > half2) posArray2[i * 3 + 1] = -half2;
			if (posArray2[i * 3 + 1] < -half2) posArray2[i * 3 + 1] = half2;
			if (posArray2[i * 3 + 2] > half2) posArray2[i * 3 + 2] = -half2;
			if (posArray2[i * 3 + 2] < -half2) posArray2[i * 3 + 2] = half2;
		}
		posAttr2.needsUpdate = true;
	});
</script>

<!-- Primary data particles -->
<T.Points {geometry} {material} />

<!-- Secondary ambient particles -->
<T.Points geometry={geometry2} material={material2} />
