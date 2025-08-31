import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

type LeaderboardPeriod = "monthly" | "weekly";

interface LeaderboardPlayer {
	rank: number;
	username: string;
	wager: number;
	isFeatured?: boolean;
}

interface LeaderboardTableProps {
	period: LeaderboardPeriod;
	data: LeaderboardPlayer[] | undefined;
}

// Updated prizes: weekly only has 1st place with "W. W. W."
const PRIZES: Record<LeaderboardPeriod, Record<number, string | number>> = {
	monthly: { 1: 300, 2: 120, 3: 60,4:25,5:10,6:5,7:5,8:5,9:5,10:5 },
	weekly: { 1: "W. W. W." },
};

const COLORS = {
	primary: "#d7590b",
	accent: "#fcc63f",
	dark: "#6f3504",
	light: "#fbde96",
};

export function LeaderboardTable({ period, data }: LeaderboardTableProps) {
	if (!data || data.length === 0) {
		return (
			<div className='py-10 italic text-center' style={{ color: COLORS.light }}>
				No leaderboard data available for {period}.
			</div>
		);
	}

	return (
		<div
			className='overflow-x-auto border-4 shadow-lg rounded-2xl'
			style={{
				borderColor: COLORS.primary,
				boxShadow: `0 0 12px ${COLORS.primary}`,
				backgroundColor: COLORS.dark,
			}}
		>
			<div className='bg-black/50 backdrop-blur-sm'>
				<Table className='min-w-full'>
					<TableHeader>
						<TableRow
							className='border-b'
							style={{ borderColor: `${COLORS.accent}33` }}
						>
							<TableHead
								className='w-16 py-3 pl-6 font-semibold tracking-wide text-left'
								style={{ color: COLORS.accent }}
							>
								Rank
							</TableHead>
							<TableHead
								className='py-3 pl-6 font-semibold tracking-wide text-left'
								style={{ color: COLORS.light }}
							>
								Player
							</TableHead>
							<TableHead
								className='py-3 pr-6 font-semibold tracking-wide text-right'
								style={{ color: COLORS.accent }}
							>
								Wager
							</TableHead>
							<TableHead
								className='py-3 pr-6 font-semibold tracking-wide text-right'
								style={{ color: COLORS.accent }}
							>
								Prize
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((player) => {
							const prize = PRIZES[period]?.[player.rank] ?? null;
							const isTop3 = player.rank <= 3;

							return (
								<TableRow
									key={player.username}
									className={`border-b cursor-default`}
									style={{
										borderColor: `${COLORS.accent}33`,
										backgroundColor: player.isFeatured
											? `${COLORS.primary}22`
											: undefined,
									}}
								>
									<TableCell
										className='py-3 pl-6 font-semibold text-center'
										style={{ color: COLORS.accent }}
									>
										{isTop3 ? (
											<Crown
												className={`inline-block h-5 w-5 ${
													player.rank === 1
														? "text-[#fcc63f]"
														: player.rank === 2
														? "text-[#d7590b]"
														: "text-[#6f3504]"
												}`}
												aria-label={`Rank ${player.rank}`}
											/>
										) : (
											<span>{player.rank}</span>
										)}
									</TableCell>

									<TableCell
										className='py-3 pl-6 font-medium whitespace-nowrap'
										style={{ color: COLORS.light }}
									>
										{player.username}
										{player.isFeatured && (
											<Badge
												variant='outline'
												className='ml-2 select-none'
												style={{
													color: COLORS.primary,
													borderColor: COLORS.primary,
												}}
											>
												Streamer
											</Badge>
										)}
									</TableCell>

									<TableCell
										className='py-3 pr-6 font-mono font-semibold text-right whitespace-nowrap'
										style={{ color: COLORS.accent }}
									>
										${player.wager.toFixed(2)}
									</TableCell>

									<TableCell
										className='py-3 pr-6 font-semibold text-right whitespace-nowrap'
										style={{
											color: prize ? COLORS.accent : `${COLORS.light}99`,
											fontStyle: prize ? "normal" : "italic",
										}}
									>
										{prize ?? "-"}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
