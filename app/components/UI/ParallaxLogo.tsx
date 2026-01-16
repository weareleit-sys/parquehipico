'use client';

import { useEffect, useState } from 'react';

const ParallaxLogo = () => {
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
        opacity = Math.min((scrollY - startFade) / (endFade - startFade), 1);
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
            {/* Imagen que cubre toda la pantalla, especialmente en móvil */}
            <img
                src="/logo-bg.png"
                alt=""
                className="w-full h-full object-cover md:object-contain md:w-[100vw] md:h-auto"
            />
        </div>
    );
};

export default ParallaxLogo;
