import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
    delay: number;
}

export const AntigravityHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

    const [particles, setParticles] = useState<Particle[]>([]);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        // Set initial window size
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });

        const generateParticles = () => {
            const particleCount = 20;
            const colors = [
                'rgba(59, 130, 246, 0.4)',  // Blue-500
                'rgba(139, 92, 246, 0.4)',  // Violet-500
                'rgba(16, 185, 129, 0.4)',  // Emerald-500
                'rgba(6, 182, 212, 0.4)',   // Cyan-500
                'rgba(244, 114, 182, 0.3)'  // Pink-400 (light accent)
            ];

            const newParticles: Particle[] = [];
            for (let i = 0; i < particleCount; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 150 + 50, // 50-200px
                    color: colors[Math.floor(Math.random() * colors.length)],
                    duration: Math.random() * 20 + 10, // 10-30s
                    delay: Math.random() * 5
                });
            }
            setParticles(newParticles);
        };

        generateParticles();

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden pointer-events-none -z-10"
            style={{
                background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)',
            }}
        >
            {/* Background Ambient Glows - Parallax Layer 1 */}
            <motion.div
                style={{ y: y1 }}
                className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-900/20 blur-[120px]"
            />
            <motion.div
                style={{ y: y2 }}
                className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-900/20 blur-[150px]"
            />

            {/* Floating Particles - Parallax Layer 2 */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full mix-blend-screen filter blur-3xl opacity-60"
                    initial={{
                        x: p.x,
                        y: p.y,
                        scale: 0.8,
                        opacity: 0
                    }}
                    animate={{
                        y: [p.y, p.y - 100, p.y + 50, p.y],
                        x: [p.x, p.x + 50, p.x - 30, p.x],
                        scale: [0.8, 1.2, 0.9, 0.8],
                        opacity: [0.3, 0.6, 0.3, 0.3]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: p.delay
                    }}
                    style={{
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size / 2}px ${p.color}`,
                    }}
                />
            ))}

            {/* Overlay Texture for Depth */}
            <div className="absolute inset-0 opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noiseFilter%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noiseFilter)%22%20opacity%3D%221%22%2F%3E%3C%2Fsvg%3E')]" />

            {/* Vignette to focus center */}
            <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,#020617_100%)] opacity-80" />
        </div>
    );
};
