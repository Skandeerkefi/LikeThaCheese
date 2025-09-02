import { create } from "zustand";

export type LeaderboardPeriod = "monthly" | "weekly";

export interface LeaderboardPlayer {
	rank: number;
	username: string;
	wager: number;
	isFeatured?: boolean;
}

interface LeaderboardState {
	leaderboard: LeaderboardPlayer[];
	period: LeaderboardPeriod;
	isLoading: boolean;
	error: string | null;
	setPeriod: (period: LeaderboardPeriod) => void;
	fetchLeaderboard: () => Promise<void>;
}

const API_URL = "likethacheesedata-production.up.railway.app/api/affiliates";

const getDateRange = (
	period: LeaderboardPeriod
): { start_at: string; end_at: string } => {
	const now = new Date();

	if (period === "monthly") {
		// 📅 Current month range (auto resets each month)
		const now = new Date();

		// First day of current month
		const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
		startDate.setHours(0, 0, 0, 0);

		// Last day of current month
		const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		endDate.setHours(23, 59, 59, 999);

		return {
			start_at: startDate.toISOString().split("T")[0],
			end_at: endDate.toISOString().split("T")[0],
		};
	}

	if (period === "weekly") {
		// 📅 Weekly leaderboard (Aug 17 → Aug 24, then rolling weekly)
		const baseStart = new Date("2025-08-17T00:00:00Z"); // first week
		const baseEnd = new Date("2025-08-24T23:59:59Z");

		// Move weeks forward until the correct range is found
		while (now > baseEnd) {
			baseStart.setDate(baseStart.getDate() + 7);
			baseEnd.setDate(baseEnd.getDate() + 7);
		}

		return {
			start_at: baseStart.toISOString().split("T")[0],
			end_at: baseEnd.toISOString().split("T")[0],
		};
	}

	throw new Error("Invalid period");
};

const processApiData = (data: any): LeaderboardPlayer[] => {
	if (!data?.affiliates || !Array.isArray(data.affiliates)) {
		console.error("Invalid API response structure - missing affiliates array");
		return [];
	}

	return data.affiliates
		.filter((item: any) => item && item.username)
		.map((item: any, index: number) => ({
			rank: index + 1,
			username: item.username,
			wager: parseFloat(item.wagered_amount) || 0,
			isFeatured: item.username.toLowerCase().includes("5moking"),
		}))
		.sort((a, b) => b.wager - a.wager)
		.map((player, idx) => ({ ...player, rank: idx + 1 }));
};

export const useLeaderboardStore = create<LeaderboardState>((set, get) => ({
	leaderboard: [],
	period: "monthly",
	isLoading: false,
	error: null,
	setPeriod: (period) => set({ period }),
	fetchLeaderboard: async () => {
		set({ isLoading: true, error: null });
		try {
			const { period } = get();
			const { start_at, end_at } = getDateRange(period);
			const response = await fetch(
				`${API_URL}?start_at=${start_at}&end_at=${end_at}`
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(
					errorData?.message ||
						errorData?.error ||
						`API request failed with status ${response.status}`
				);
			}

			const data = await response.json();
			const processedData = processApiData(data);

			set({ leaderboard: processedData });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "Unknown error",
			});
		} finally {
			set({ isLoading: false });
		}
	},
}));
