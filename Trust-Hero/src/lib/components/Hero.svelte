<script lang="ts">
import { Button } from 'bits-ui';

const stats = [
{ value: '99.8%', label: 'Uptime SLA' },
{ value: '2.4s', label: 'Avg. onboarding' },
{ value: '4.9 / 5', label: 'Trust score' }
];

const floatingLogos = [
{ src: '/logos/visa%20logo.svg',        alt: 'Visa',       top: '14%', left: '12%', anim: 'float-up',    delay: '0s',   dur: '6.4s', opacity: 0.18 },
{ src: '/logos/mastercard%20logo.svg',  alt: 'Mastercard', top: '10%', left: '72%', anim: 'float-down',  delay: '1.2s', dur: '7.2s', opacity: 0.16 },
{ src: '/logos/stripe-dark%20logo.svg', alt: 'Stripe',     top: '42%', left: '82%', anim: 'float-drift', delay: '0.6s', dur: '8s',   opacity: 0.18 },
{ src: '/logos/paypal-dark%20logo.svg', alt: 'PayPal',     top: '44%', left: '9%',  anim: 'float-up',    delay: '1.8s', dur: '7s',   opacity: 0.15 },
{ src: '/logos/Binance%20logo.svg',     alt: 'Binance',    top: '74%', left: '74%', anim: 'float-down',  delay: '0.3s', dur: '7.8s', opacity: 0.16 },
{ src: '/logos/Revolut%20logo.svg',     alt: 'Revolut',    top: '76%', left: '13%', anim: 'float-drift', delay: '2s',   dur: '9s',   opacity: 0.14 },
];

let hoveredLogo = $state(-1);
</script>

<section
class="relative flex min-h-screen flex-col overflow-hidden"
style="
background:
radial-gradient(ellipse 80% 60% at 65% -5%, rgba(59,130,246,0.10) 0%, transparent 60%),
radial-gradient(ellipse 60% 50% at 5% 90%, rgba(34,197,94,0.06) 0%, transparent 55%),
linear-gradient(160deg, #0B0F1A 0%, #121826 55%, #1A2238 100%);
"
>
<!-- Video background -->
<video
class="absolute inset-0 h-full w-full object-cover opacity-[0.55]"
autoplay
loop
muted
playsinline
aria-hidden="true"
>
<source src="/hero-bg.mp4" type="video/mp4" />
</video>

<!-- Radial vignette -->
<div
class="pointer-events-none absolute inset-0"
style="background: radial-gradient(ellipse at center, transparent 35%, rgba(11,15,26,0.65) 100%);"
aria-hidden="true"
></div>

<!-- Floating logos -->
{#each floatingLogos as logo, i}
<div
  class="absolute select-none cursor-default z-20"
  style="
    top: {logo.top};
    left: {logo.left};
    animation: {logo.anim} {logo.dur} ease-in-out {logo.delay} infinite;
    will-change: transform;
  "
>
  <img
    src={logo.src}
    alt={logo.alt}
    class="h-10 w-auto transition-all duration-500"
    style="
      filter: {hoveredLogo === i ? 'none' : 'grayscale(1)'};
      opacity: {hoveredLogo === i ? 1 : logo.opacity};
    "
    onmouseenter={() => (hoveredLogo = i)}
    onmouseleave={() => (hoveredLogo = -1)}
  />
</div>
{/each}

<!-- Main content (centered) -->
<div class="relative z-10 flex flex-1 items-center justify-center px-6 pb-20 pt-28">
<div class="mx-auto flex w-full max-w-170 flex-col items-center text-center">

<!-- Badge -->
<div
class="mb-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5"
style="
background: rgba(59,130,246,0.07);
border-color: rgba(59,130,246,0.18);
color: rgb(147,197,253);
animation: fade-up 0.55s ease forwards;
opacity: 0;
"
>
<span class="h-1.5 w-1.5 animate-pulse rounded-full" style="background: #60A5FA;"></span>
<span class="text-xs font-medium tracking-wide">Fintech Design System  2025</span>
</div>

<!-- Headline -->
<h1
class="mb-6 text-[52px] font-bold leading-[1.07] tracking-[-0.03em] text-white sm:text-[62px] xl:text-[72px]"
style="animation: fade-up 0.65s ease 0.08s forwards; opacity: 0;"
>
Designing Financial<br />
Products Users<br />
Actually
<span class="gradient-text">Trust</span>
</h1>

<!-- Subtext -->
<p
class="mb-10 max-w-135 text-lg leading-relaxed text-slate-400 sm:text-xl"
style="animation: fade-up 0.65s ease 0.18s forwards; opacity: 0;"
>
From onboarding to transactions, every interaction shapes how users perceive risk.
Designing experiences that reduce uncertainty and enable confident decisions.
</p>

<!-- CTA Buttons -->
<div
class="flex flex-wrap items-center justify-center gap-4"
style="animation: fade-up 0.65s ease 0.28s forwards; opacity: 0;"
>
<Button.Root
class="group inline-flex items-center gap-2.5 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_10px_36px_rgba(59,130,246,0.42)] active:scale-[0.97]"
style="background: linear-gradient(90deg, #3B82F6, #22C55E); box-shadow: 0 4px 20px rgba(59,130,246,0.3);"
>
Explore Interface
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="transition-transform duration-200 group-hover:translate-x-0.5">
<path d="M3 8h10M9.5 4.5L13 8l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
</Button.Root>

<Button.Root
class="inline-flex items-center gap-2.5 rounded-xl border px-7 py-3.5 text-sm font-semibold text-slate-300 transition-all duration-200 hover:scale-[1.02] hover:border-white/25 hover:bg-white/5 hover:text-white active:scale-[0.97]"
style="border-color: rgba(255,255,255,0.12);"
>
<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zM8 5v4l2.5 1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
</svg>
View Case Study
</Button.Root>
</div>

<!-- Stats row -->
<div
class="mt-14 flex flex-wrap items-start justify-center gap-8 border-t pt-10 w-full"
style="border-color: rgba(255,255,255,0.07); animation: fade-up 0.65s ease 0.4s forwards; opacity: 0;"
>
{#each stats as stat}
<div class="text-center">
<div class="text-2xl font-bold tracking-tight text-white">{stat.value}</div>
<div class="mt-0.5 text-sm text-slate-500">{stat.label}</div>
</div>
{/each}

<!-- Social proof -->
<div class="flex items-center gap-3">
<div class="flex -space-x-2">
{#each [
{ src: 'https://i.pravatar.cc/64?img=47', alt: 'Designer' },
{ src: 'https://i.pravatar.cc/64?img=32', alt: 'Designer' },
{ src: 'https://i.pravatar.cc/64?img=12', alt: 'Designer' },
{ src: 'https://i.pravatar.cc/64?img=58', alt: 'Designer' },
] as avatar, i}
<img
src={avatar.src}
alt={avatar.alt}
class="h-8 w-8 rounded-full border-2 border-[#0B0F1A] object-cover"
style="z-index: {4 - i};"
/>
{/each}
</div>
<span class="text-sm text-slate-400">
<span class="font-semibold text-white">1,200+</span> designers trust Clarity
</span>
</div>
</div>
</div>
</div>

<!-- Bottom gradient fade -->
<div
class="pointer-events-none absolute bottom-0 inset-x-0 h-32"
style="background: linear-gradient(to top, #0B0F1A, transparent);"
aria-hidden="true"
></div>
</section>
