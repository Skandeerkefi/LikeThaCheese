import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dices, Crown, Gift, Users, LogIn, User, LogOut } from "lucide-react";
import useMediaQuery from "@/hooks/use-media-query";
import { useAuthStore } from "@/store/useAuthStore";

export function Navbar() {
	const location = useLocation();
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [isOpen, setIsOpen] = useState(false);
	const [isLive, setIsLive] = useState(false);
	const [viewerCount, setViewerCount] = useState<number | null>(null);

	const { user, logout } = useAuthStore();

	useEffect(() => {
		setIsOpen(false);
	}, [location, isMobile]);

	useEffect(() => {
		const fetchLiveStatus = async () => {
			try {
				const res = await fetch("https://kick.com/api/v2/channels/MisterTee");
				const data = await res.json();

				if (data.livestream) {
					setIsLive(true);
					setViewerCount(data.livestream.viewer_count);
				} else {
					setIsLive(false);
					setViewerCount(null);
				}
			} catch (err) {
				console.error("Error fetching live status", err);
			}
		};

		fetchLiveStatus();
		const interval = setInterval(fetchLiveStatus, 60000);
		return () => clearInterval(interval);
	}, []);

	const menuItems = [
		{ path: "/", name: "Home", icon: <Dices className='w-5 h-5' /> },
		{
			path: "/leaderboard",
			name: "Leaderboard",
			icon: <Crown className='w-5 h-5' />,
		},
		{
			path: "/slot-calls",
			name: "Slot Calls",
			icon: <Users className='w-5 h-5' />,
		},
		{
			path: "/giveaways",
			name: "Giveaways",
			icon: <Gift className='w-5 h-5' />,
		},
	];

	return (
		<nav className='sticky top-0 z-50 bg-[#FFF9E6] border-b-4 border-[#FFB800] shadow-lg backdrop-blur-md'>
			<div className='container flex items-center justify-between px-6 py-4 mx-auto'>
				{/* Logo */}
				<Link to='/' className='flex items-center space-x-3 select-none'>
					<img
						src='https://files.kick.com/images/user/43408083/profile_image/conversion/6c613431-134b-4b8e-bac5-46b6d3531e7b-fullsize.webp'
						alt='LikeThaCheese Logo'
						className='w-10 h-10 rounded-full border-2 border-[#FFB800] shadow-sm object-cover bg-[#FFD700]'
					/>
					<span className='text-3xl font-extrabold italic tracking-wide text-[#FFB800] [text-shadow:2px_2px_4px_#FF6F00]'>
						Like<span className='text-[#FF6F00]'>ThaCheese</span>
					</span>
				</Link>

				{/* Desktop Menu */}
				{!isMobile && (
					<div className='flex items-center space-x-8'>
						{/* Menu Items */}
						<ul className='flex space-x-6 font-bold text-[#FF6F00]'>
							{menuItems.map((item) => (
								<li key={item.path}>
									<Link
										to={item.path}
										className={`flex items-center space-x-2 text-lg px-3 py-1 rounded-xl transition-all duration-300
                      ${
												location.pathname === item.path
													? "bg-gradient-to-br from-[#FFD700] to-[#FFB800] shadow-lg text-white"
													: "hover:bg-gradient-to-br hover:from-[#FFD966] hover:to-[#FFCC33] hover:shadow-lg"
											}`}
									>
										{item.icon}
										<span>{item.name}</span>
									</Link>
								</li>
							))}
						</ul>

						{/* User Controls */}
						<div className='flex items-center space-x-4'>
							{user ? (
								<>
									<Link
										to='/profile'
										className='flex items-center space-x-2 text-[#FF6F00] hover:text-[#FFB800] font-semibold'
									>
										<User className='w-5 h-5' />
										<span>{user.username}</span>
									</Link>
									<button
										onClick={logout}
										className='flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFB800] shadow-lg hover:from-[#FFCC33] hover:to-[#FFB800] text-[#6f3504] font-semibold transition'
									>
										<LogOut className='w-5 h-5' />
										Logout
									</button>
								</>
							) : (
								<>
									<Link
										to='/login'
										className='flex items-center space-x-2 px-4 py-1.5 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFB800] shadow-lg hover:from-[#FFCC33] hover:to-[#FFB800] text-[#6f3504] font-semibold transition'
									>
										<LogIn className='w-5 h-5' />
										Login
									</Link>
									<Link
										to='/signup'
										className='text-[#FF6F00] font-semibold hover:text-[#FFB800] transition'
									>
										Sign Up
									</Link>
								</>
							)}
						</div>
					</div>
				)}

				{/* Live Status */}
				<div
					className={`ml-6 px-4 py-1 rounded-full text-sm font-bold select-none
            ${
							isLive
								? "bg-red-500 text-white shadow-lg animate-pulse"
								: "bg-[#FFD966] text-[#6f3504]"
						} `}
					title={isLive ? "Currently Live" : "Offline"}
				>
					{isLive ? (
						<>
							<span role='img' aria-label='Live'>
								🔴
							</span>{" "}
							LIVE {viewerCount !== null ? `(${viewerCount})` : ""}
						</>
					) : (
						"Offline"
					)}
				</div>

				{/* Mobile Hamburger */}
				{isMobile && (
					<button
						onClick={() => setIsOpen(!isOpen)}
						aria-label='Toggle menu'
						aria-expanded={isOpen}
						className='relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none'
					>
						<span
							className={`block w-8 h-1 bg-[#FF6F00] rounded transition-transform duration-300 ${
								isOpen ? "rotate-45 translate-y-2" : ""
							}`}
						/>
						<span
							className={`block w-8 h-1 bg-[#FF6F00] rounded transition-opacity duration-300 ${
								isOpen ? "opacity-0" : "opacity-100"
							}`}
						/>
						<span
							className={`block w-8 h-1 bg-[#FF6F00] rounded transition-transform duration-300 ${
								isOpen ? "-rotate-45 -translate-y-2" : ""
							}`}
						/>
					</button>
				)}
			</div>

			{/* Mobile Dropdown Menu */}
			{isMobile && (
				<div
					className={`fixed inset-0 bg-[#FFB800]/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
						isOpen
							? "opacity-100 pointer-events-auto"
							: "opacity-0 pointer-events-none"
					}`}
					onClick={() => setIsOpen(false)}
				>
					<div
						className={`absolute top-0 right-0 w-64 bg-[#FFF9E6] h-full shadow-lg py-6 px-6 flex flex-col space-y-6 transform transition-transform duration-300 ${
							isOpen ? "translate-x-0" : "translate-x-full"
						}`}
						onClick={(e) => e.stopPropagation()}
					>
						<ul className='flex flex-col space-y-4 font-bold text-[#FF6F00]'>
							{menuItems.map((item) => (
								<li key={item.path}>
									<Link
										to={item.path}
										onClick={() => setIsOpen(false)}
										className={`flex items-center space-x-3 text-lg px-2 py-2 rounded-xl hover:bg-gradient-to-br hover:from-[#FFD966] hover:to-[#FFCC33] hover:shadow-lg transition-colors ${
											location.pathname === item.path
												? "bg-gradient-to-br from-[#FFD700] to-[#FFB800] shadow-lg text-white"
												: ""
										}`}
									>
										{item.icon}
										<span>{item.name}</span>
									</Link>
								</li>
							))}
						</ul>

						<div className='mt-auto space-y-4'>
							{user ? (
								<>
									<Link
										to='/profile'
										onClick={() => setIsOpen(false)}
										className='flex items-center space-x-3 text-[#FF6F00] text-lg font-semibold hover:text-[#FFB800] transition'
									>
										<User className='w-6 h-6' />
										<span>{user.username}</span>
									</Link>
									<button
										onClick={() => {
											logout();
											setIsOpen(false);
										}}
										className='w-full bg-gradient-to-br from-[#FFD700] to-[#FFB800] shadow-lg hover:from-[#FFCC33] hover:to-[#FFB800] text-[#6f3504] py-2 rounded-xl font-semibold transition'
									>
										<LogOut className='inline w-5 h-5 mr-2' />
										Logout
									</button>
								</>
							) : (
								<>
									<Link
										to='/login'
										onClick={() => setIsOpen(false)}
										className='flex items-center space-x-3 bg-gradient-to-br from-[#FFD700] to-[#FFB800] shadow-lg hover:from-[#FFCC33] hover:to-[#FFB800] text-[#6f3504] py-2 px-4 rounded-xl font-semibold transition'
									>
										<LogIn className='w-5 h-5' />
										<span>Login</span>
									</Link>
									<Link
										to='/signup'
										onClick={() => setIsOpen(false)}
										className='block text-center text-[#FF6F00] font-semibold hover:text-[#FFB800] transition'
									>
										Sign Up
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
