export interface CardData {
	position: [number, number, number];
	rotation: [number, number, number];
	color: string;
	hoverOffset: number;
	brand: string;
	cardNumber: string;
	holderName: string;
	expiry: string;
	type: string;
	balance: string;
	currency: string;
	spending: { month: string; amount: number }[];
	recentTx: { name: string; amount: string; date: string; icon: string }[];
	limits: { daily: string; used: string; percent: number };
}

export const cards: CardData[] = [
	{
		position: [-3.2, 1.8, -1.5],
		rotation: [0.1, 0.4, 0.05],
		color: '#2F8BFF',
		hoverOffset: 0,
		brand: 'VISA',
		cardNumber: '4821  ••••  ••••  7392',
		holderName: 'ALEXANDER CHEN',
		expiry: '09/28',
		type: 'Platinum',
		balance: '$48,291.00',
		currency: 'USD',
		spending: [
			{ month: 'Oct', amount: 3200 }, { month: 'Nov', amount: 4100 },
			{ month: 'Dec', amount: 5800 }, { month: 'Jan', amount: 3900 },
			{ month: 'Feb', amount: 4600 }, { month: 'Mar', amount: 5200 }
		],
		recentTx: [
			{ name: 'Stripe Inc.', amount: '-$1,240.00', date: 'Mar 14', icon: '💳' },
			{ name: 'AWS Services', amount: '-$892.50', date: 'Mar 13', icon: '☁️' },
			{ name: 'Salary Deposit', amount: '+$12,500.00', date: 'Mar 10', icon: '🏦' },
			{ name: 'Apple Store', amount: '-$299.00', date: 'Mar 8', icon: '🍎' },
			{ name: 'Uber Eats', amount: '-$34.50', date: 'Mar 7', icon: '🚗' }
		],
		limits: { daily: '$10,000', used: '$2,132.50', percent: 21 }
	},
	{
		position: [3.0, 2.2, -2.0],
		rotation: [-0.05, -0.3, -0.03],
		color: '#59B0FF',
		hoverOffset: 1.2,
		brand: 'MASTERCARD',
		cardNumber: '5412  ••••  ••••  8834',
		holderName: 'ALEXANDER CHEN',
		expiry: '03/27',
		type: 'Gold Business',
		balance: '$124,830.50',
		currency: 'USD',
		spending: [
			{ month: 'Oct', amount: 18200 }, { month: 'Nov', amount: 22100 },
			{ month: 'Dec', amount: 19800 }, { month: 'Jan', amount: 25900 },
			{ month: 'Feb', amount: 21600 }, { month: 'Mar', amount: 28200 }
		],
		recentTx: [
			{ name: 'AWS Monthly', amount: '-$8,500.00', date: 'Mar 15', icon: '☁️' },
			{ name: 'Google Workspace', amount: '-$1,440.00', date: 'Mar 12', icon: '📧' },
			{ name: 'Client Payment', amount: '+$45,000.00', date: 'Mar 10', icon: '💰' },
			{ name: 'Figma Team', amount: '-$75.00', date: 'Mar 9', icon: '🎨' },
			{ name: 'Notion', amount: '-$96.00', date: 'Mar 5', icon: '📝' }
		],
		limits: { daily: '$50,000', used: '$9,940.00', percent: 20 }
	},
	{
		position: [-2.5, -0.8, -2.5],
		rotation: [0.08, 0.25, 0.1],
		color: '#1a5cff',
		hoverOffset: 2.4,
		brand: 'VISA',
		cardNumber: '4916  ••••  ••••  2201',
		holderName: 'CHEN CORP LTD',
		expiry: '12/27',
		type: 'Corporate',
		balance: '$892,140.75',
		currency: 'USD',
		spending: [
			{ month: 'Oct', amount: 85200 }, { month: 'Nov', amount: 92100 },
			{ month: 'Dec', amount: 78800 }, { month: 'Jan', amount: 105900 },
			{ month: 'Feb', amount: 96600 }, { month: 'Mar', amount: 112200 }
		],
		recentTx: [
			{ name: 'Payroll March', amount: '-$145,000.00', date: 'Mar 15', icon: '👥' },
			{ name: 'Office Lease', amount: '-$18,500.00', date: 'Mar 1', icon: '🏢' },
			{ name: 'Revenue Q1', amount: '+$580,000.00', date: 'Feb 28', icon: '📈' },
			{ name: 'Insurance', amount: '-$4,200.00', date: 'Feb 25', icon: '🛡️' },
			{ name: 'Legal Services', amount: '-$12,000.00', date: 'Feb 20', icon: '⚖️' }
		],
		limits: { daily: '$200,000', used: '$163,500.00', percent: 82 }
	},
	{
		position: [3.5, -0.5, -1.0],
		rotation: [-0.1, -0.5, 0.02],
		color: '#4a9eff',
		hoverOffset: 3.6,
		brand: 'FINTECH VR',
		cardNumber: '6221  ••••  ••••  0055',
		holderName: 'ALEXANDER CHEN',
		expiry: '06/29',
		type: 'Virtual',
		balance: '€5,420.30',
		currency: 'EUR',
		spending: [
			{ month: 'Oct', amount: 920 }, { month: 'Nov', amount: 1100 },
			{ month: 'Dec', amount: 1580 }, { month: 'Jan', amount: 890 },
			{ month: 'Feb', amount: 1260 }, { month: 'Mar', amount: 740 }
		],
		recentTx: [
			{ name: 'Vercel Pro', amount: '-€320.00', date: 'Mar 14', icon: '▲' },
			{ name: 'Spotify Family', amount: '-€17.99', date: 'Mar 12', icon: '🎵' },
			{ name: 'Transfer In', amount: '+€2,000.00', date: 'Mar 10', icon: '↗️' },
			{ name: 'GitHub Pro', amount: '-€44.00', date: 'Mar 8', icon: '🐙' },
			{ name: 'Netflix', amount: '-€15.99', date: 'Mar 5', icon: '🎬' }
		],
		limits: { daily: '€5,000', used: '€337.99', percent: 7 }
	}
];
