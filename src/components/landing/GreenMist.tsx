import { useEffect, useRef } from 'react';

export const GreenMist = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to window size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let animationFrameId: number;
        let width = canvas.width;
        let height = canvas.height;

        class Particle {
            x: number;
            y: number;
            radius: number;
            vx: number;
            vy: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.radius = Math.random() * 200 + 150; // Large 150-350px radius
                this.vx = (Math.random() - 0.5) * 0.5; // Slow horizontal drift
                this.vy = (Math.random() - 0.5) * 0.5; // Slow vertical drift

                // Green/Teal palette
                const colors = [
                    'hsla(158, 80%, 45%, 0.15)', // Bright Green
                    'hsla(165, 70%, 40%, 0.1)',  // Teal-Green
                    'hsla(140, 60%, 35%, 0.08)'  // Darker Green
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around screen edges for continuous flow
                if (this.x < -this.radius) this.x = width + this.radius;
                if (this.x > width + this.radius) this.x = -this.radius;
                if (this.y < -this.radius) this.y = height + this.radius;
                if (this.y > height + this.radius) this.y = -this.radius;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                // Radial gradient for soft edges
                const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
                g.addColorStop(0, this.color);
                g.addColorStop(1, 'rgba(0,0,0,0)');

                ctx.fillStyle = g;
                // Blend mode 'screen' makes overlaps glow nicely
                ctx.globalCompositeOperation = 'screen';
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over'; // Reset blend mode
            }
        }

        // Create particles
        const particles: Particle[] = [];
        for (let i = 0; i < 15; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            // Clear with very slight fade for trailing effect? No, just clear fully for this style.
            // But creating a dark background is key for the 'screen' blend mode to work.
            ctx.fillStyle = '#051108'; // Very dark green/black background
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none -z-10"
            style={{ filter: 'blur(50px)' }} // Heavy blur to mix the particles into a mist
        />
    );
};
