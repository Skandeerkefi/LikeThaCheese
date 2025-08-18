import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import {
	useLeaderboardStore,
	LeaderboardPlayer,
	LeaderboardPeriod,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const COLORS = {
	primary: "#d7590b",
	accent: "#fcc63f",
	dark: "#6f3504",
	light: "#fbde96",
};

function LeaderboardPage() {
	const { leaderboard, period, setPeriod, fetchLeaderboard, isLoading, error } =
		useLeaderboardStore();

	// ⏳ time left countdown
	const [timeLeft, setTimeLeft] = useState<string>("");

	useEffect(() => {
		fetchLeaderboard();
	}, [period, fetchLeaderboard]);

	// compute current date range depending on period
	const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
		start: "",
		end: "",
	});

	useEffect(() => {
		const fetchRange = () => {
			const now = new Date();

			if (period === "monthly") {
				// 📅 Always reset monthly leaderboard from 1st → last day of current month
				const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
				startDate.setHours(0, 0, 0, 0);

				const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
				endDate.setHours(23, 59, 59, 999);

				setDateRange({
					start: startDate.toISOString().split("T")[0],
					end: endDate.toISOString().split("T")[0],
				});
			} else if (period === "weekly") {
				const baseStart = new Date("2025-08-17T00:00:00Z");
				const baseEnd = new Date("2025-08-24T23:59:59Z");

				while (now > baseEnd) {
					baseStart.setDate(baseStart.getDate() + 7);
					baseEnd.setDate(baseEnd.getDate() + 7);
				}

				setDateRange({
					start: baseStart.toISOString().split("T")[0],
					end: baseEnd.toISOString().split("T")[0],
				});
			}
		};

		fetchRange();
	}, [period]);


	// countdown ticker
	useEffect(() => {
		if (!dateRange.end) return;

		const interval = setInterval(() => {
			const endDate = new Date(dateRange.end + "T23:59:59");
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
	}, [dateRange]);

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
							Rainbet Leaderboard
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
								using the LIKETHACHEESE affiliate code on Rainbet. Higher wagers
								result in a better ranking.
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				{/* Tabs for Monthly / Weekly */}
				<Tabs
					value={period}
					onValueChange={(val) => setPeriod(val as LeaderboardPeriod)}
					className='mb-8'
				>
					<TabsList className='grid w-full grid-cols-2 bg-[#693806] p-1 rounded-2xl shadow-md'>
						<TabsTrigger
							value='monthly'
							className='text-white data-[state=active]:bg-[#AF2D03] data-[state=active]:text-white rounded-xl transition-colors'
						>
							Monthly
						</TabsTrigger>
						<TabsTrigger
							value='weekly'
							className='text-white data-[state=active]:bg-[#EA6D0C] data-[state=active]:text-white rounded-xl transition-colors'
						>
							Weekly
						</TabsTrigger>
					</TabsList>
				</Tabs>

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
						{leaderboard.length > 0 ? (
							<>
								<RewardCard
									position='2nd Place'
									reward={period === "monthly" ? "$75" : "$100"}
									player={leaderboard[1]}
									icon={<Award className='text-yellow-400 w-9 h-9' />}
									lightBg
								/>
								<RewardCard
									position='1st Place'
									reward={period === "monthly" ? "$150" : "$150"}
									player={leaderboard[0]}
									icon={<Trophy className='w-10 h-10 text-orange-300' />}
									lightBg
								/>
								<RewardCard
									position='3rd Place'
									reward={period === "monthly" ? "$25" : "$50"}
									player={leaderboard[2]}
									icon={<Medal className='w-8 h-8 text-yellow-500' />}
									lightBg
								/>
							</>
						) : (
							<p className='col-span-3 italic text-center'>
								No leaderboard data available
							</p>
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
							{period === "monthly" ? "Monthly" : "Weekly"} Leaderboard
						</h2>
						<p
							className='mt-2 text-sm select-none'
							style={{ color: "#EA6D0C" }}
						>
							Period: {dateRange.start} → {dateRange.end}
						</p>
						<p
							className='mt-1 text-sm select-none'
							style={{ color: "#EA6D0C" }}
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
						<LeaderboardTable period={period} data={leaderboard} />
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
	player?: LeaderboardPlayer;
	icon?: React.ReactNode;
	lightBg?: boolean;
}

function RewardCard({
	position,
	reward,
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
				color: COLORS.light,
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
						<p className='text-lg font-semibold text-black'>
							{player.username}
						</p>
						<p className='text-lg font-medium text-black'>
							$ {player.wager.toLocaleString()}
						</p>
						<a
							href='https://discord.gg/s7hgvGGaV4'
							target='_blank'
							rel='noreferrer'
							className='w-full mt-6'
						>
							<Button className='w-full bg-[#d7590b] hover:bg-[#6f3504] text-black font-semibold'>
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
