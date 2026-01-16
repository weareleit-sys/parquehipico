'use client';

import { useEffect, useState } from 'react';

interface ParallaxLogoProps {
    maxOpacity?: number;
}

const ParallaxLogo = ({ maxOpacity = 0.85 }: ParallaxLogoProps) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Opacidad progresiva basada en scroll
    const startFade = 200;
    const endFade = 600;

    let opacity = 0;
    if (scrollY > startFade) {
        opacity = Math.min((scrollY - startFade) / (endFade - startFade), 1) * maxOpacity;
    }

    if (opacity <= 0) return null;

    return (
        <div
            className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
            style={{
                opacity,
                zIndex: 5,
            }}
        >
            {/* Logo casi completo visible, tamaño optimizado para móvil */}
            <img
                src="/logo-bg.png"
                alt=""
                className="w-[95vw] h-auto object-contain md:w-[85vw] max-w-[1100px]"
            />
        </div>
    );
};

export default ParallaxLogo;
