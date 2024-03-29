'use client';

import { useState } from 'react';

const isDev = false;
// const isDev = true;

type roleT = 'thief' | 'normal' | 'bomb';
const roleMap: Record<roleT, string> = {
	thief: '👑',
	normal: '💭',
	bomb: '💥',
};

type diceT = 1 | 2 | 3 | 4 | 5 | 6;
const dV = (d: number) => (d >= 1 && d <= 6 ? `⏰ ${d}` : '⏰');
type playerT = {
	name: string;
	role: roleT;
	dice: diceT;
	visible: boolean;
};

type storeT = {
	players: playerT[];
	stage: 'setup' | 'game' | 'end';
	remarks: string;
};

const initialStore: storeT = {
	players: [],
	stage: 'setup',
	remarks: '',
};

const preSet: Array<{
	name: string;
	pplNum: number;
	hasBomb: boolean;
}> = [
	{ name: '4P 👑', pplNum: 4, hasBomb: false },
	{ name: '5P 👑 🖐️\n🖐️⏰ = 👑⏰', pplNum: 5, hasBomb: false },
	{ name: '6P 👑 🖐️\n🖐️⏰ = 7⏰', pplNum: 6, hasBomb: false },
	{ name: '6P 👑 🖐️ 💥\n🖐️⏰ = 7⏰', pplNum: 6, hasBomb: true },
	{ name: '7P 👑 🖐️2\n🖐️⏰ = 7⏰\n🖐️❌👑', pplNum: 7, hasBomb: false },
	{ name: '7P 👑 🖐️2 💥\n🖐️⏰ = 7⏰\n🖐️❌👑', pplNum: 7, hasBomb: true },
	{ name: '8P 👑 🖐️2\n🖐️⏰ = 7⏰', pplNum: 8, hasBomb: false },
	{ name: '8P 👑 🖐️2 💥\n🖐️⏰ = 7⏰', pplNum: 8, hasBomb: true },
];

const StageSetup = (props: { setStore: (s: storeT) => void }) => {
	const onClick = (p: (typeof preSet)[number]) => {
		const players: playerT[] = [];

		const thiefIndex = Math.floor(Math.random() * p.pplNum);
		const _bombIndex = p.hasBomb
			? Math.floor(Math.random() * (p.pplNum - 1))
			: -1;
		const bombIndex = _bombIndex >= thiefIndex ? _bombIndex + 1 : _bombIndex;

		for (let i = 0; i < p.pplNum; i++) {
			const dice = (Math.floor(Math.random() * 6) + 1) as diceT;
			const playerName =
				(!isDev && window.prompt(`Player ${i + 1} name:`)) || `Player ${i + 1}`;
			const role: roleT =
				i === thiefIndex ? 'thief' : i === bombIndex ? 'bomb' : 'normal';
			!isDev && window.alert(`${playerName} is ${roleMap[role]} (${dV(dice)})`);
			players.push({
				name: playerName,
				role,
				dice,
				visible: false,
			});
		}

		console.log(players);
		props.setStore({ players, stage: 'game', remarks: p.name });
	};

	return (
		<div className="flex flex-col justify-center h-full">
			<h1 className="text-center font-bold text-3xl animate-bounce">
				Banana Thief
			</h1>
			<div className="grid grid-cols-2 gap-4 mt-8">
				{preSet.map((p) => (
					<button
						key={p.name}
						onClick={() => onClick(p)}
						className="border border-blue-400 rounded-lg py-6 whitespace-pre-wrap leading-8"
					>
						{p.name}
					</button>
				))}
			</div>
		</div>
	);
};

const StageGame = (props: { store: storeT; setStore: (s: storeT) => void }) => {
	const { store, setStore } = props;
	const [isEnd, setIsEnd] = useState(false);

	return (
		<>
			<h2 className="whitespace-pre-wrap text-xl text-center leading-10">
				{store.remarks}
			</h2>
			<div className="flex flex-col justify-center flex-1">
				<div className="grid grid-cols-2 gap-8">
					{store.players.map((player, i) => {
						let txt = player.name;
						if (isEnd)
							txt = `${txt}\n${roleMap[player.role]}\n${dV(player.dice)}`;
						else if (player.visible) txt = `${txt}\n${dV(player.dice)}`;

						return (
							<button
								key={i}
								className="border border-blue-400 rounded-lg py-10 px-2 whitespace-pre-wrap"
								onClick={() => {
									setStore({
										...store,
										players: store.players.map((p, j) =>
											i === j ? { ...p, visible: !p.visible } : p
										),
									});
								}}
							>
								{txt}
							</button>
						);
					})}
				</div>
			</div>
			<div className="flex gap-4 justify-end">
				<button
					className="text-2xl mx-2"
					onClick={() => setStore(initialStore)}
				>
					🆕
				</button>
				<button className="text-2xl mx-2" onClick={() => setIsEnd(!isEnd)}>
					👁️
				</button>
			</div>
		</>
	);
};

export default function Home() {
	const [store, setStore] = useState<storeT>(initialStore);

	return (
		<main className="flex flex-col p-4 inset-0 absolute">
			{store.stage === 'setup' && <StageSetup setStore={setStore} />}
			{store.stage === 'game' && (
				<StageGame store={store} setStore={setStore} />
			)}
		</main>
	);
}
