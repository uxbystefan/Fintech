/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				background: '#05070A',
				surface: '#0B0F17',
				'primary-blue': '#2F8BFF',
				'accent-blue': '#59B0FF',
				glass: 'rgba(20,30,45,0.55)',
				'text-primary': '#E6EDF3',
				'text-secondary': '#9AA6B2',
				'text-muted': '#7F8A96'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif']
			},
			boxShadow: {
				'glow': '0 0 20px rgba(47, 139, 255, 0.2)',
				'glow-lg': '0 0 40px rgba(47, 139, 255, 0.3)',
				'glow-xl': '0 0 60px rgba(47, 139, 255, 0.15)'
			}
		}
	},
	plugins: []
};
