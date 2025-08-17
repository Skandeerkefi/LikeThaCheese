import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import {
	useLeaderboardStore,
	LeaderboardPlayer,
} from "@/store/useLeaderboardStore";
import { Crown, Info, Loader2, Trophy, Award, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GraphicalBackground from "@/components/GraphicalBackground";

const COLORS = {
	primary: "#d7590b",
	accent: "#fcc63f",
	dark: "#6f3504",
	light: "#fbde96",
};

function LeaderboardPage() {
	const { monthlyLeaderboard, fetchLeaderboard, isLoading, error } =
		useLeaderboardStore();

	useEffect(() => {
		fetchLeaderboard();
	}, [fetchLeaderboard]);

	const now = new Date();
	const start_at = new Date(now.getFullYear(), now.getMonth(), 1)
		.toISOString()
		.split("T")[0];
	const end_at = new Date(now.getFullYear(), now.getMonth() + 1, 0)
		.toISOString()
		.split("T")[0];

	const [timeLeft, setTimeLeft] = useState<string>("");

	useEffect(() => {
		const interval = setInterval(() => {
			const endDate = new Date(end_at + "T23:59:59");
			const now = new Date();
			const diff = endDate.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeLeft("Leaderboard period has ended.");
				clearInterval(interval);
				return;
			}

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			const seconds = Math.floor((diff / 1000) % 60);

			setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
		}, 1000);

		return () => clearInterval(interval);
	}, [end_at]);

	return (
		<div className='relative flex flex-col min-h-screen text-white'>
			{/* Background Canvas */}
			<GraphicalBackground />

			<Navbar />

			<main className='container relative z-10 flex-grow max-w-6xl px-6 py-12 mx-auto'>
				{/* Header */}
				<div className='flex flex-col items-center justify-between gap-4 mb-10 sm:flex-row'>
					<div
						className='flex items-center gap-3'
						style={{ color: COLORS.primary }}
					>
						<Crown className='w-7 h-7' />
						<h1 className='text-3xl font-extrabold tracking-tight'>
							Rainbet Monthly Leaderboard
						</h1>
					</div>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									className='flex items-center gap-1 text-sm font-semibold transition-colors'
									style={{ color: COLORS.accent }}
									aria-label='How the leaderboard works'
								>
									<Info className='w-5 h-5' />
									How It Works
								</button>
							</TooltipTrigger>
							<TooltipContent
								className='max-w-xs p-3 text-sm border rounded-md shadow-lg'
								style={{
									backgroundColor: COLORS.dark,
									borderColor: COLORS.accent,
									color: COLORS.light,
								}}
							>
								The leaderboard ranks players based on their total wager amount
								using the MisterTee affiliate code on Rainbet. Higher wagers
								result in a better ranking.
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* Affiliate Info */}
				<div
					className='p-6 mb-10 rounded-lg shadow-md'
					style={{
						backgroundColor: `${COLORS.light}33`,
						border: `2px solid ${COLORS.primary}`,
						color: COLORS.dark,
					}}
				>
					<p className='mb-4 leading-relaxed'>
						Use affiliate code{" "}
						<span className='font-semibold' style={{ color: COLORS.primary }}>
							MisterTee
						</span>{" "}
						on{" "}
						<a
							href='https://rainbet.com'
							target='_blank'
							rel='noreferrer'
							style={{ color: COLORS.primary, textDecoration: "underline" }}
						>
							Rainbet
						</a>{" "}
						to appear on this leaderboard and compete for rewards!
					</p>

					<div
						className='inline-flex items-center gap-3 px-4 py-2 rounded-md select-text w-max'
						style={{ backgroundColor: `${COLORS.primary}33` }}
					>
						<span className='font-semibold' style={{ color: COLORS.primary }}>
							Affiliate Code:
						</span>
						<span className='font-bold text-white'>MisterTee</span>
					</div>
				</div>

				{/* Error Alert */}
				{error && (
					<Alert
						variant='destructive'
						className='mb-8 shadow-md'
						style={{
							backgroundColor: `${COLORS.primary}40`,
							borderColor: COLORS.primary,
							color: COLORS.light,
						}}
					>
						<AlertDescription>
							Failed to load leaderboard: {error}
						</AlertDescription>
					</Alert>
				)}

				{/* Reward Cards */}
				<section className='mb-12'>
					<h2
						className='mb-8 text-3xl font-bold tracking-wide text-center'
						style={{ color: COLORS.primary }}
					>
						Top Players
					</h2>
					<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
						{monthlyLeaderboard.length > 0 ? (
							<>
								<RewardCard
									position='2nd Place'
									reward='$250 Cash + Special Role'
									backgroundColor={`from-${COLORS.dark} to-${COLORS.primary}`}
									player={monthlyLeaderboard[1]}
									icon={<Award className='text-yellow-400 w-9 h-9' />}
									lightBg
								/>
								<RewardCard
									position='1st Place'
									reward='$500 Cash + Special Role'
									backgroundColor={`from-${COLORS.primary} to-${COLORS.dark}`}
									player={monthlyLeaderboard[0]}
									icon={<Trophy className='w-10 h-10 text-yellow-300' />}
									lightBg
								/>
								<RewardCard
									position='3rd Place'
									reward='$100 Cash + Special Role'
									backgroundColor={`from-${COLORS.dark} to-${COLORS.dark}`}
									player={monthlyLeaderboard[2]}
									icon={<Medal className='w-8 h-8 text-yellow-500' />}
									lightBg
								/>
							</>
						) : (
							<>
								<RewardCard
									position='1st Place'
									reward='$500 Cash + Special Role'
									backgroundColor={`from-${COLORS.primary} to-${COLORS.dark}`}
									icon={<Trophy className='w-10 h-10 text-yellow-300' />}
									lightBg
								/>
								<RewardCard
									position='2nd Place'
									reward='$250 Cash + Special Role'
									backgroundColor={`from-${COLORS.dark} to-${COLORS.primary}`}
									icon={<Award className='text-yellow-400 w-9 h-9' />}
									lightBg
								/>
								<RewardCard
									position='3rd Place'
									reward='$100 Cash + Special Role'
									backgroundColor={`from-${COLORS.dark} to-${COLORS.dark}`}
									icon={<Medal className='w-8 h-8 text-yellow-500' />}
									lightBg
								/>
							</>
						)}
					</div>
				</section>

				{/* Leaderboard Table */}
				<section>
					<div className='flex flex-col items-center justify-center mb-6'>
						<h2
							className='inline-block px-8 py-2 text-2xl font-semibold text-center border-2 rounded-md'
							style={{ borderColor: COLORS.primary, color: COLORS.primary }}
						>
							Monthly Leaderboard
						</h2>
						<p
							className='mt-2 text-sm select-none'
							style={{ color: COLORS.light }}
						>
							Period: {start_at} → {end_at}
						</p>
						<p
							className='mt-1 text-sm select-none'
							style={{ color: COLORS.light }}
						>
							{timeLeft}
						</p>
					</div>

					{isLoading ? (
						<div className='flex items-center justify-center h-52'>
							<Loader2
								className='w-10 h-10 animate-spin'
								style={{ color: COLORS.primary }}
							/>
						</div>
					) : (
						<LeaderboardTable period='monthly' data={monthlyLeaderboard} />
					)}
				</section>
			</main>

			<Footer />
		</div>
	);
}

interface RewardCardProps {
	position: string;
	reward: string;
	backgroundColor: string;
	player?: LeaderboardPlayer;
	icon?: React.ReactNode;
	lightBg?: boolean;
}

function RewardCard({
	position,
	reward,
	backgroundColor,
	player,
	icon,
	lightBg = false,
}: RewardCardProps) {
	return (
		<div
			className={`flex flex-col h-full overflow-hidden rounded-xl shadow-lg border`}
			style={{
				borderColor: COLORS.primary,
				background: lightBg ? `${COLORS.light}33` : undefined,
				color: lightBg ? COLORS.light : COLORS.light,
			}}
		>
			<div
				className={`h-2 bg-gradient-to-r`}
				style={{
					background: `linear-gradient(to right, ${COLORS.dark}, ${COLORS.primary})`,
				}}
			/>
			<div className='flex flex-col items-center flex-grow p-6 text-center'>
				<div className='mb-5'>{icon}</div>
				<h3
					className='mb-3 text-xl font-bold tracking-wide'
					style={{ color: COLORS.primary }}
				>
					{position}
				</h3>

				{player ? (
					<>
						<p className='text-lg font-semibold'>{player.username}</p>
						<p className='text-lg font-medium'>
							$ {player.wager.toLocaleString()}
						</p>
						<a
							href='https://discord.gg/YmvDexVt'
							target='_blank'
							rel='noreferrer'
							className='w-full mt-6'
						>
							<Button
								className={`w-full bg-[#d7590b] hover:bg-[#6f3504] text-black font-semibold`}
							>
								Claim Prize
							</Button>
						</a>
					</>
				) : (
					<p className='text-lg font-medium'>{reward}</p>
				)}
			</div>
		</div>
	);
}

export default LeaderboardPage;
