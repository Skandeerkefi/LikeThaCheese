import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Link } from "react-router-dom";
import { Dices, Crown, Gift, Users, ArrowRight } from "lucide-react";
import { useLeaderboardStore } from "@/store/useLeaderboardStore";
import { useSlotCallStore } from "@/store/useSlotCallStore";
import { useGiveawayStore } from "@/store/useGiveawayStore";
import GraphicalBackground from "@/components/GraphicalBackground";

// Cheese Theme Colors
const COLORS = {
	primary: "#d7590b", // cheddar orange
	accent: "#fcc63f", // cheese yellow
	dark: "#6f3504", // crust brown
	light: "#fbde96", // light cheese
};

function HomePage() {
	const { slotCalls } = useSlotCallStore();
	const { giveaways } = useGiveawayStore();
	const { monthlyLeaderboard, fetchLeaderboard } = useLeaderboardStore();

	const topLeaderboard = Array.isArray(monthlyLeaderboard)
		? monthlyLeaderboard.slice(0, 5)
		: [];

	const now = new Date();
	const monthEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
	monthEndDate.setHours(23, 59, 59, 999);
	const monthEndISO = monthEndDate.toISOString();

	useEffect(() => {
		if (monthlyLeaderboard.length === 0) {
			fetchLeaderboard();
		}
	}, []);

	const [timeLeft, setTimeLeft] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			const end = new Date(monthEndISO);
			const diff = end.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeLeft("00d : 00h : 00m : 00s");
				clearInterval(interval);
				return;
			}

			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
			const minutes = Math.floor((diff / (1000 * 60)) % 60);
			const seconds = Math.floor((diff / 1000) % 60);

			setTimeLeft(
				`${days.toString().padStart(2, "0")}d : ${hours
					.toString()
					.padStart(2, "0")}h : ${minutes
					.toString()
					.padStart(2, "0")}m : ${seconds.toString().padStart(2, "0")}s`
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [monthEndISO]);

	return (
		<div className='relative flex flex-col min-h-screen text-dark'>
			{/* Animated Cheese Background */}
			<GraphicalBackground />

			<Navbar />

			<main className='relative z-10 flex-grow'>
				{/* Hero Section */}
				<section className='flex flex-col-reverse items-center justify-center max-w-6xl gap-16 px-6 mx-auto py-28 sm:flex-row sm:items-center'>
					<div className='max-w-xl text-center sm:text-left'>
						<h1
							className='text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md'
							style={{
								background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent}, ${COLORS.primary})`,
								WebkitBackgroundClip: "text",
								color: "transparent",
							}}
						>
							LikeThaCheese&apos;s <br /> Official Stream
						</h1>

						<div
							className='w-24 h-1 mt-6 rounded-full animate-pulse'
							style={{ backgroundColor: COLORS.primary }}
						/>

						<p
							className='mt-6 text-lg font-medium tracking-wide'
							style={{ color: COLORS.dark }}
						>
							Watch LikeThaCheese live on Kick — thrilling gambling streams,
							giveaways, and more.
						</p>
					</div>

					<div
						className='w-full max-w-xl overflow-hidden border-4 shadow-lg aspect-video rounded-3xl'
						style={{ borderColor: COLORS.primary }}
					>
						<iframe
							src='https://player.kick.com/LikeThaCheese'
							frameBorder='0'
							allowFullScreen
							title='LikeThaCheese Live Stream'
							className='w-full h-full'
						></iframe>
					</div>
				</section>

				{/* Countdown Section */}
				<section
					className='max-w-4xl px-6 py-10 mx-auto shadow-lg rounded-3xl'
					style={{
						backgroundColor: COLORS.light,
						border: `4px solid ${COLORS.primary}`,
					}}
				>
					<h2
						className='mb-8 text-3xl font-semibold tracking-wide text-center'
						style={{ color: COLORS.primary }}
					>
						⏳ Monthly Leaderboard Ends In
					</h2>

					<div className='flex flex-col justify-center gap-6 text-center select-none sm:flex-row'>
						{["Days", "Hours", "Minutes", "Seconds"].map((label, idx) => {
							const timeParts = timeLeft.split(" : ");
							const value =
								timeParts.length === 4 ? timeParts[idx].slice(0, -1) : "--";

							return (
								<div
									key={label}
									className='flex flex-col items-center justify-center rounded-xl py-6 px-8 min-w-[80px] sm:min-w-[100px] shadow-sm'
									style={{ backgroundColor: `${COLORS.accent}33` }}
								>
									<span className='text-5xl font-extrabold'>{value}</span>
									<span
										className='mt-2 text-sm font-medium'
										style={{ color: COLORS.primary }}
									>
										{label}
									</span>
								</div>
							);
						})}
					</div>
				</section>

				{/* Leaderboard */}
				<section className='container py-16'>
					<div className='flex items-center justify-between mb-8'>
						<div className='flex items-center gap-2'>
							<Crown className='w-6 h-6' style={{ color: COLORS.primary }} />
							<h2 className='text-2xl font-bold'>Monthly Leaderboard</h2>
						</div>
						<Button
							variant='outline'
							size='sm'
							className='hover:bg-[#d7590b] hover:text-white'
							style={{
								borderColor: COLORS.primary,
								color: COLORS.primary,
								backgroundColor: COLORS.light,
							}}
							asChild
						>
							<Link to='/leaderboard' className='flex items-center gap-1'>
								View Full Leaderboard <ArrowRight className='w-4 h-4' />
							</Link>
						</Button>
					</div>
					<LeaderboardTable period='monthly' data={topLeaderboard} />
				</section>

				{/* Features */}
				<section className='max-w-6xl px-6 py-16 mx-auto'>
					<h2
						className='mb-12 text-4xl font-bold text-center'
						style={{ color: COLORS.dark }}
					>
						What We Offer
					</h2>
					<div className='grid grid-cols-1 gap-10 sm:grid-cols-3'>
						{[
							{
								icon: (
									<Dices
										className='w-12 h-12 animate-pulse'
										style={{ color: COLORS.primary }}
									/>
								),
								title: "Exciting Gambling Streams",
								description:
									"Watch thrilling slot sessions, casino games, and big win moments with LikeThaCheese on Rainbet.",
							},
							{
								icon: (
									<Users
										className='w-12 h-12 animate-pulse'
										style={{ color: COLORS.primary }}
									/>
								),
								title: "Slot Call System",
								description:
									"Suggest slots for LikeThaCheese to play during streams and see your suggestions come to life.",
							},
							{
								icon: (
									<Gift
										className='w-12 h-12 animate-pulse'
										style={{ color: COLORS.primary }}
									/>
								),
								title: "Regular Giveaways",
								description:
									"Participate in frequent giveaways for a chance to win cash, gaming gear, and more.",
							},
						].map(({ icon, title, description }) => (
							<div
								key={title}
								className='flex flex-col items-center rounded-3xl p-8 shadow-lg hover:scale-[1.05] transition-transform'
								style={{
									backgroundColor: COLORS.light,
									border: `2px solid ${COLORS.primary}`,
								}}
							>
								<div
									className='flex items-center justify-center w-20 h-20 mb-6 rounded-full'
									style={{
										backgroundColor: `${COLORS.accent}50`,
										border: `2px solid ${COLORS.primary}`,
									}}
								>
									{icon}
								</div>
								<h3
									className='mb-3 text-xl font-semibold'
									style={{ color: COLORS.primary }}
								>
									{title}
								</h3>
								<p className='text-center' style={{ color: COLORS.dark }}>
									{description}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Schedule */}
				<section className='max-w-5xl px-6 py-16 mx-auto'>
					<h2
						className='mb-8 text-4xl font-bold text-center'
						style={{ color: COLORS.dark }}
					>
						📅 Stream Schedule
					</h2>
					<p
						className='max-w-xl mx-auto mb-10 text-center'
						style={{ color: COLORS.dark }}
					>
						LikeThaCheese goes live <strong>every day</strong> — join the fun
						anytime!
					</p>

					<div className='flex flex-col gap-4 sm:hidden'>
						{[
							"Monday",
							"Tuesday",
							"Wednesday",
							"Thursday",
							"Friday",
							"Saturday",
							"Sunday",
						].map((day) => (
							<div
								key={day}
								className='flex items-center justify-between p-4 shadow-md rounded-xl'
								style={{
									backgroundColor: COLORS.light,
									border: `2px solid ${COLORS.primary}`,
								}}
							>
								<span
									className='font-semibold'
									style={{ color: COLORS.primary }}
								>
									{day}
								</span>
								<span style={{ color: COLORS.dark }}>7:30pm EST</span>
							</div>
						))}
					</div>

					<div className='flex justify-center mt-12'>
						<Button
							size='lg'
							className='transition transform shadow-lg hover:scale-105'
							style={{ backgroundColor: COLORS.primary, color: COLORS.light }}
							asChild
						>
							<a
								href='https://kick.com/LikeThaCheese'
								target='_blank'
								rel='noreferrer'
							>
								Watch Live on Kick
							</a>
						</Button>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}

export default HomePage;
