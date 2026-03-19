<script lang="ts">
	import { Button } from 'bits-ui';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	const navLinks = [
		{ label: 'Product', href: '#product' },
		{ label: 'Solutions', href: '#solutions' },
		{ label: 'Pricing', href: '#pricing' },
		{ label: 'Resources', href: '#resources' }
	];

	$effect(() => {
		function onScroll() {
			scrolled = window.scrollY > 24;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<header
	class="fixed inset-x-0 top-0 z-50 transition-all duration-500"
	style={scrolled
		? 'background: rgba(11, 15, 26, 0.82); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06);'
		: 'background: transparent;'}
>
	<div class="mx-auto flex h-17 max-w-300 items-center justify-between px-6">
		<!-- ── Logo ─────────────────────────────────────── -->
		<a href="/" class="group flex items-center gap-2.5 no-underline">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg"
				style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); box-shadow: 0 4px 14px rgba(59,130,246,0.35);"
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M3 8C3 5.24 5.24 3 8 3s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z"
						fill="white"
						opacity="0.25"
					/>
					<path
						d="M6 8a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"
						fill="white"
					/>
					<path
						d="M8 3v2M8 11v2M3 8h2M11 8h2"
						stroke="white"
						stroke-width="1.2"
						stroke-linecap="round"
						opacity="0.6"
					/>
				</svg>
			</div>
			<span
				class="text-[17px] font-bold tracking-tight text-white transition-opacity duration-200 group-hover:opacity-80"
			>
				Clarity
			</span>
		</a>

		<!-- ── Nav Links (desktop) ───────────────────── -->
		<nav class="hidden items-center gap-0.5 md:flex" aria-label="Primary">
			{#each navLinks as link}
				<a
					href={link.href}
					class="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white/90"
				>
					{link.label}
				</a>
			{/each}
		</nav>

		<!-- ── Actions ───────────────────────────────── -->
		<div class="flex items-center gap-2">
			<Button.Root
				class="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white sm:inline-flex"
			>
				Sign In
			</Button.Root>

			<Button.Root
				class="group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_6px_24px_rgba(59,130,246,0.4)] active:scale-[0.98]"
				style="background: linear-gradient(90deg, #3B82F6, #22C55E); box-shadow: 0 4px 16px rgba(59,130,246,0.28);"
			>
				Get Started
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					class="transition-transform duration-200 group-hover:translate-x-0.5"
				>
					<path
						d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</Button.Root>

			<!-- Mobile menu toggle -->
			<button
				class="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white md:hidden"
				aria-label="Toggle menu"
				aria-expanded={mobileOpen}
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				{#if mobileOpen}
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
						<path
							d="M4 4l10 10M14 4L4 14"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				{:else}
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
						<path
							d="M3 5h12M3 9h12M3 13h12"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- ── Mobile Menu ───────────────────────────────── -->
	{#if mobileOpen}
		<div
			class="glass border-t border-white/6 px-4 pb-4 md:hidden"
			style="animation: fade-in 0.2s ease forwards;"
		>
			<nav class="flex flex-col gap-1 pt-3">
				{#each navLinks as link}
					<a
						href={link.href}
						class="rounded-lg px-4 py-3 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
						onclick={() => (mobileOpen = false)}
					>
						{link.label}
					</a>
				{/each}
				<div class="mt-3 flex flex-col gap-2 border-t border-white/6 pt-3">
					<button
						class="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white"
					>
						Sign In
					</button>
					<button
						class="w-full rounded-xl py-2.5 text-sm font-semibold text-white"
						style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);"
					>
						Get Started
					</button>
				</div>
			</nav>
		</div>
	{/if}
</header>
