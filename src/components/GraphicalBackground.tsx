import { useEffect, useRef } from "react";

export function GraphicalBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		interface Particle {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			color: string;
			alpha: number;
		}

		const particles: Particle[] = [];
		const particleCount = 50; // increased particle count
		const colors = [
			"rgba(252, 198, 63,", // cheese yellow
			"rgba(215, 89, 11,", // cheddar orange
			"rgba(251, 222, 150,", // light cheese
			"rgba(111, 53, 4,", // crust brown
		];

		for (let i = 0; i < particleCount; i++) {
			const color = colors[Math.floor(Math.random() * colors.length)];
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: Math.random() * 2 + 1,
				speedX: (Math.random() - 0.5) * 0.3,
				speedY: (Math.random() - 0.5) * 0.3,
				color,
				alpha: Math.random() * 0.3 + 0.1,
			});
		}

		interface FloatingItem {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			rotation: number;
			rotationSpeed: number;
			layer: number;
			opacity: number;
			image: HTMLImageElement;
		}

		const cheeseSources = [
			"https://i.ibb.co/TBzNFcMz/Capture-d-cran-2025-08-17-030301-removebg-preview.png",
			"https://i.ibb.co/KjZCtD6t/Capture-d-cran-2025-08-17-030335-removebg-preview.png",
		];
		const cheeseImages: HTMLImageElement[] = cheeseSources.map((src) => {
			const img = new Image();
			img.src = src;
			return img;
		});

		const cheeses: FloatingItem[] = [];
		const cheeseCount = 40; // more cheese

		// Helper to check if a new cheese overlaps existing ones
		const isFarEnough = (x: number, y: number, size: number) => {
			return !cheeses.some(
				(c) => Math.hypot(c.x - x, c.y - y) < (c.size + size) * 0.8 // minimum distance
			);
		};

		for (let i = 0; i < cheeseCount; i++) {
			const layer = Math.floor(Math.random() * 3); // 0 = far, 2 = close
			const baseSize = [40, 70, 110][layer];
			const cheeseImg =
				cheeseImages[Math.floor(Math.random() * cheeseImages.length)];

			let x = Math.random() * canvas.width;
			let y = Math.random() * canvas.height;
			let size = baseSize + Math.random() * 30;

			let tries = 0;
			while (!isFarEnough(x, y, size) && tries < 50) {
				// prevent overlapping
				x = Math.random() * canvas.width;
				y = Math.random() * canvas.height;
				tries++;
			}

			cheeses.push({
				x,
				y,
				size,
				speedX: (Math.random() - 0.5) * (0.1 + layer * 0.05),
				speedY: (Math.random() - 0.5) * (0.1 + layer * 0.05),
				rotation: Math.random() * Math.PI * 2,
				rotationSpeed: (Math.random() - 0.5) * 0.002,
				layer,
				opacity: 0.4 + layer * 0.3,
				image: cheeseImg,
			});
		}

		let time = 0;
		let animationFrameId: number;

		const render = () => {
			time += 0.01;

			ctx.fillStyle = "rgba(251, 222, 150, 0.2)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			particles.forEach((p) => {
				p.x += p.speedX;
				p.y += p.speedY;

				if (p.x > canvas.width) p.x = 0;
				if (p.x < 0) p.x = canvas.width;
				if (p.y > canvas.height) p.y = 0;
				if (p.y < 0) p.y = canvas.height;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = `${p.color}${p.alpha})`;
				ctx.fill();
			});

			cheeses.forEach((cheese, idx) => {
				const layerSpeed = 0.3 + cheese.layer * 0.2;

				cheese.x += cheese.speedX * layerSpeed + Math.sin(time + idx) * 0.5;
				cheese.y += cheese.speedY * layerSpeed + Math.cos(time + idx) * 0.5;
				cheese.rotation += cheese.rotationSpeed + Math.sin(time + idx) * 0.005;

				const scale = 0.9 + Math.sin(time + idx) * 0.1;

				if (cheese.x > canvas.width) cheese.x = -cheese.size;
				if (cheese.x < -cheese.size) cheese.x = canvas.width;
				if (cheese.y > canvas.height) cheese.y = -cheese.size;
				if (cheese.y < -cheese.size) cheese.y = canvas.height;

				ctx.save();
				ctx.globalAlpha = cheese.opacity;
				ctx.shadowColor = "rgba(111,53,4,0.5)";
				ctx.shadowBlur = 15;

				ctx.translate(cheese.x + cheese.size / 2, cheese.y + cheese.size / 2);
				ctx.rotate(cheese.rotation);
				ctx.scale(scale, scale);
				ctx.drawImage(
					cheese.image,
					-cheese.size / 2,
					-cheese.size / 2,
					cheese.size,
					cheese.size
				);
				ctx.restore();
			});

			animationFrameId = requestAnimationFrame(render);
		};

		Promise.all(
			cheeseImages.map(
				(img) =>
					new Promise((resolve) => {
						img.onload = resolve;
					})
			)
		).then(() => render());

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className='fixed top-0 left-0 w-full h-full pointer-events-none -z-10'
		/>
	);
}

export default GraphicalBackground;
