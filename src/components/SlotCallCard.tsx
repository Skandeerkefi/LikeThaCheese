// SlotCallCard.tsx
import { useState } from "react";
import { Clock, Check, X, Gift } from "lucide-react";

export type SlotCallStatus = "pending" | "accepted" | "rejected" | "played";

interface SlotCallProps {
	id: string;
	slotName: string;
	requester: string;
	timestamp: string;
	status: SlotCallStatus;
	x250Hit?: boolean;
	bonusCall?: { name: string; createdAt: string };
	onAccept?: (id: string, x250Hit: boolean) => void;
	onReject?: (id: string) => void;
	onDelete?: (id: string) => void;
	onBonusSubmit?: (id: string, bonusSlot: string) => void;
	onMarkPlayed?: (id: string) => void;
	onToggleX250?: (id: string, newValue: boolean) => void;
	isAdminView?: boolean;
	isUserView?: boolean;
}

const COLORS = {
	primary: "#d7590b",
	accent: "#fcc63f",
	dark: "#6f3504",
	light: "#fbde96",
	bg: "#010001",
};

export function SlotCallCard({
	id,
	slotName,
	requester,
	timestamp,
	status,
	x250Hit,
	bonusCall,
	onAccept,
	onReject,
	onDelete,
	onBonusSubmit,
	onMarkPlayed,
	onToggleX250,
	isAdminView = false,
	isUserView = false,
}: SlotCallProps) {
	const [bonusInput, setBonusInput] = useState("");
	const showBonusInput = isUserView && x250Hit && !bonusCall;

	return (
		<div
			className='flex flex-col p-4 border rounded-lg shadow-md'
			style={{
				backgroundColor: COLORS.bg,
				borderColor: COLORS.primary,
				color: COLORS.light,
			}}
		>
			{/* Header */}
			<div className='flex items-start justify-between'>
				<h3 className='text-lg font-bold'>{slotName}</h3>
				<StatusBadge status={status} />
			</div>

			{/* Requester */}
			<div className='mt-2 text-sm' style={{ color: COLORS.primary }}>
				Requested by: <span style={{ color: COLORS.light }}>{requester}</span>
			</div>

			{/* Time */}
			<div
				className='flex items-center gap-1 mt-4 text-xs'
				style={{ color: COLORS.light }}
			>
				<Clock className='w-3 h-3' />
				{timestamp}
			</div>

			{/* Admin Controls */}
			{isAdminView && (
				<div className='mt-4 space-y-2'>
					<label
						className='flex items-center gap-2 text-sm'
						style={{ color: COLORS.primary }}
					>
						<input
							type='checkbox'
							checked={x250Hit || false}
							onChange={() => onToggleX250?.(id, !x250Hit)}
							disabled={status !== "played"}
						/>
						Mark as 250x Hit
					</label>

					{status === "pending" && (
						<div className='flex gap-2'>
							<button
								onClick={() => onAccept?.(id, x250Hit || false)}
								className='flex items-center justify-center flex-1 gap-1 px-3 py-1 text-sm rounded'
								style={{ backgroundColor: COLORS.accent, color: COLORS.dark }}
							>
								<Check className='w-4 h-4' /> Accept
							</button>

							<button
								onClick={() => onReject?.(id)}
								className='flex items-center justify-center flex-1 gap-1 px-3 py-1 text-sm rounded'
								style={{ backgroundColor: COLORS.dark, color: COLORS.light }}
							>
								<X className='w-4 h-4' /> Reject
							</button>
						</div>
					)}

					{(status === "accepted" || status === "pending") && (
						<button
							onClick={() => onMarkPlayed?.(id)}
							className='w-full py-1 mt-2 rounded'
							style={{ backgroundColor: COLORS.primary, color: COLORS.light }}
						>
							Mark as Played
						</button>
					)}

					{/* Delete Button */}
					<button
						onClick={() => {
							if (
								confirm(
									"Are you sure you want to delete this slot call? This action cannot be undone."
								)
							) {
								onDelete?.(id);
							}
						}}
						className='w-full py-1 mt-2 rounded'
						style={{ backgroundColor: COLORS.dark, color: COLORS.light }}
					>
						Delete
					</button>
				</div>
			)}

			{/* Bonus Call Submitted */}
			{bonusCall && (
				<div className='mt-4 text-sm' style={{ color: COLORS.primary }}>
					<Gift className='inline w-4 h-4 mr-1' />
					Bonus Call:{" "}
					<span style={{ color: COLORS.light, fontWeight: "bold" }}>
						{bonusCall.name}
					</span>
				</div>
			)}

			{/* Bonus Call Submission */}
			{showBonusInput && (
				<div className='mt-4 space-y-2'>
					<label
						htmlFor={`bonus-${id}`}
						className='text-sm'
						style={{ color: COLORS.primary }}
					>
						🎁 20$ Bonus Call Slot Name
					</label>
					<input
						id={`bonus-${id}`}
						type='text'
						placeholder='e.g. Sugar Rush'
						value={bonusInput}
						onChange={(e) => setBonusInput(e.target.value)}
						className='w-full px-3 py-1 rounded'
						style={{
							backgroundColor: COLORS.bg,
							borderColor: COLORS.primary,
							color: COLORS.light,
						}}
					/>
					<button
						onClick={() =>
							bonusInput.trim() && onBonusSubmit?.(id, bonusInput.trim())
						}
						className='w-full py-1 mt-1 rounded'
						style={{ backgroundColor: COLORS.primary, color: COLORS.light }}
					>
						Submit Bonus Call
					</button>
				</div>
			)}
		</div>
	);
}

function StatusBadge({ status }: { status: SlotCallStatus }) {
	const baseClass =
		"text-xs px-2 py-0.5 rounded-full border font-medium inline-block";

	const COLORS = {
		pending: "#d7590b",
		accepted: "#fcc63f",
		played: "#fbde96",
		rejected: "#6f3504",
	};

	const BG = {
		pending: "#d7590b22",
		accepted: "#fcc63f22",
		played: "#fbde9622",
		rejected: "#6f350422",
	};

	switch (status) {
		case "pending":
			return (
				<span
					className={`${baseClass}`}
					style={{
						color: COLORS.pending,
						borderColor: COLORS.pending,
						backgroundColor: BG.pending,
					}}
				>
					Pending
				</span>
			);
		case "accepted":
			return (
				<span
					className={`${baseClass}`}
					style={{
						color: COLORS.accepted,
						borderColor: COLORS.accepted,
						backgroundColor: BG.accepted,
					}}
				>
					Accepted
				</span>
			);
		case "played":
			return (
				<span
					className={`${baseClass}`}
					style={{
						color: COLORS.played,
						borderColor: COLORS.played,
						backgroundColor: BG.played,
					}}
				>
					Played
				</span>
			);
		case "rejected":
		default:
			return (
				<span
					className={`${baseClass}`}
					style={{
						color: COLORS.rejected,
						borderColor: COLORS.rejected,
						backgroundColor: BG.rejected,
					}}
				>
					Rejected
				</span>
			);
	}
}
