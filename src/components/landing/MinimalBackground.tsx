import { motion } from 'framer-motion';

export const MinimalBackground = () => {
    // Brand colors in soft, pastel variants for the background
    const blobs = [
        { color: 'bg-blue-100', x: '10%', y: '20%', delay: 0, scale: [1, 1.2, 1] },
        { color: 'bg-green-100', x: '80%', y: '10%', delay: 2, scale: [1.1, 0.9, 1.1] },
        { color: 'bg-indigo-100', x: '30%', y: '80%', delay: 4, scale: [0.9, 1.1, 0.9] },
        { color: 'bg-emerald-50', x: '90%', y: '70%', delay: 1, scale: [1.2, 1, 1.2] },
    ];

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-white">
            {blobs.map((blob, index) => (
                <motion.div
                    key={index}
                    className={`absolute rounded-full mix-blend-multiply filter blur-[80px] opacity-70 ${blob.color}`}
                    initial={{
                        left: blob.x,
                        top: blob.y,
                        scale: 1
                    }}
                    animate={{
                        y: [0, -40, 0],
                        x: [0, 20, 0],
                        scale: blob.scale,
                    }}
                    transition={{
                        duration: 10 + index * 2, // Randomize duration slightly
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: "easeInOut",
                        delay: blob.delay,
                    }}
                    style={{
                        width: '40vw',
                        height: '40vw',
                        maxWidth: '600px',
                        maxHeight: '600px',
                    }}
                />
            ))}

            {/* Optional faint noise texture for quality feel */}
            <div
                className="absolute inset-0 opacity-[0.4]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")` }}
            />
        </div>
    );
};
