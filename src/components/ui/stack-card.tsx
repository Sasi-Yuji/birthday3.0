import * as motion from "motion/react-client"
import type { Variants } from "motion/react"
import React from 'react'
import { PixelImage } from './pixel-image';

import img2 from '../../assets/img2.jpg';
import img3 from '../../assets/img3.jpg';
import img10 from '../../assets/img10.jpg';
import img11 from '../../assets/img11.jpg';
import img12 from '../../assets/img12.jpg';

export function ScrollTriggered() {
    const [width, setWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

    React.useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = width < 768;

    return (
        <div className="w-full flex justify-center overflow-hidden" style={{ paddingBottom: isMobile ? 50 : 100, paddingTop: isMobile ? 40 : 100 }}>
            <div style={{ ...container, width: "100%", maxWidth: 500, position: 'relative' }}>
                {food.map(([emoji, hueA, hueB], i) => (
                    <React.Fragment key={i}>
                        <Card i={i} emoji={emoji as string} hueA={hueA as number} hueB={hueB as number} isMobile={isMobile} screenWidth={width} />
                        {i === 0 && (
                            <div className="flex flex-col items-center justify-center -mt-8 sm:-mt-12 mb-8 sm:mb-12">
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mb-3"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 20L12 4M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </motion.div>
                                <motion.div
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] whitespace-nowrap"
                                >
                                    Continue the Journey
                                </motion.div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

interface CardProps {
    emoji: string
    hueA: number
    hueB: number
    i: number
    isMobile: boolean
    screenWidth: number
}

function Card({ emoji, hueA, hueB, i, isMobile, screenWidth }: CardProps) {
    const background = `linear-gradient(306deg, ${hue(hueA)}, ${hue(hueB)})`
    
    // Scale splash if screen is smaller than 520px
    const splashScale = isMobile ? Math.min(1, screenWidth / 520) : 1;
    
    // Dynamic sizes for mobile (occupy ~85% of screen)
    const cardWidth = isMobile ? '85vw' : 300;
    // For 85vw width, keep standard polaroid ratio (approx 1:1.3)
    const cardHeight = isMobile ? '110vw' : 430;
    
    // Proper gap between stacked cards to prevent overlapping faces/bodies
    const cardGap = isMobile ? 80 : 120;

    return (
        <motion.div
            className={`card-container-${i}`}
            style={{ ...cardContainer, marginBottom: cardGap }}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ amount: 0.4 }} // Trigger sooner on mobile
        >
            <div style={{ 
                ...splash, 
                background, 
                transform: `scale(${splashScale})`, 
                transformOrigin: 'center center' 
            }} />
            <motion.div 
                style={{ ...card, width: cardWidth, height: cardHeight }} 
                variants={getCardVariants(isMobile)} 
                className="card overflow-hidden z-10"
            >
                <PixelImage src={emoji} grid={isMobile ? "4x6" : "8x8"} />
            </motion.div>
        </motion.div>
    )
}

const getCardVariants = (isMobile: boolean): Variants => ({
    offscreen: {
        y: isMobile ? 150 : 300,
    },
    onscreen: {
        y: isMobile ? 20 : 50,
        // Reduce rotation slightly on mobile to prevent image overlap and fit screen nicely
        rotate: isMobile ? -4 : -10,
        transition: {
            type: "spring",
            bounce: 0.4,
            duration: 0.8,
        },
    },
});

const hue = (h: number) => `hsl(${h}, 100%, 50%)`

const container: React.CSSProperties = {
    // margins handled in parent div now to avoid scaling issues
    position: 'relative',
}

const cardContainer: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingTop: 20,
}

const splash: React.CSSProperties = {
    position: "absolute",
    // Center the 500px wide splash
    left: '50%',
    marginLeft: -250, 
    top: -50,
    width: 500,
    height: 550,
    clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
}

const card: React.CSSProperties = {
    fontSize: 164,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    background: "#f5f5f5",
    boxShadow:
        "0 0 1px hsl(0deg 0% 0% / 0.075), 0 0 2px hsl(0deg 0% 0% / 0.075), 0 0 4px hsl(0deg 0% 0% / 0.075), 0 0 8px hsl(0deg 0% 0% / 0.075), 0 0 20px hsl(0deg 0% 0% / 0.2)",
    transformOrigin: "10% 60%",
}

const food: (string | number)[][] = [
    [img2, 340, 10],
    [img3, 20, 40],
    [img10, 60, 90],
    [img12, 80, 120],
    [img11, 100, 140]
]
