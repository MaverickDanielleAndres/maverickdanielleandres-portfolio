import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface TrueFocusProps {
    sentence?: string;
    manualMode?: boolean;
    blurAmount?: number;
    borderColor?: string;
    glowColor?: string;
    animationDuration?: number;
    pauseBetweenAnimations?: number;
}

interface FocusRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

const TrueFocus: React.FC<TrueFocusProps> = ({
    sentence = "True Focus",
    manualMode = false,
    blurAmount = 5,
    borderColor = "green",
    glowColor = "rgba(0, 255, 0, 0.6)",
    animationDuration = 0.5,
    pauseBetweenAnimations = 1,
}) => {
    const words = sentence.split(" ");
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [focusRect, setFocusRect] = useState<FocusRect>({ x: 0, y: 0, width: 0, height: 0 });

    useEffect(() => {
        if (!manualMode) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % words.length);
            }, (animationDuration + pauseBetweenAnimations) * 1000);

            return () => clearInterval(interval);
        }
    }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

    useEffect(() => {
        if (currentIndex === null || currentIndex === -1) return;
        if (!wordRefs.current[currentIndex] || !containerRef.current) return;

        const parentRect = containerRef.current.getBoundingClientRect();
        const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

        setFocusRect({
            x: activeRect.left - parentRect.left,
            y: activeRect.top - parentRect.top,
            width: activeRect.width,
            height: activeRect.height,
        });
    }, [currentIndex, words.length]);

    const handleMouseEnter = (index: number) => {
        if (manualMode) {
            setLastActiveIndex(index);
            setCurrentIndex(index);
        }
    };

    const handleMouseLeave = () => {
        if (manualMode) {
            setCurrentIndex(lastActiveIndex!);
        }
    };

    return (
        <>
            <style jsx>{`
                .truefocus-word {
                    font-size: clamp(0.875rem, 2vw, 1.25rem);
                    font-weight: 900;
                }
                
                .truefocus-corner {
                    width: 8px;
                    height: 8px;
                    border: 2px solid var(--border-color);
                    position: absolute;
                }
                
                .truefocus-corner-tl {
                    top: -6px;
                    left: -6px;
                    border-right: none;
                    border-bottom: none;
                }
                
                .truefocus-corner-tr {
                    top: -6px;
                    right: -6px;
                    border-left: none;
                    border-bottom: none;
                }
                
                .truefocus-corner-bl {
                    bottom: -6px;
                    left: -6px;
                    border-right: none;
                    border-top: none;
                }
                
                .truefocus-corner-br {
                    bottom: -6px;
                    right: -6px;
                    border-left: none;
                    border-top: none;
                }
            `}</style>
            
            <div
                className="relative flex gap-2 sm:gap-3 md:gap-4 justify-center items-center flex-wrap"
                ref={containerRef}
            >
                {words.map((word, index) => {
                    const isActive = index === currentIndex;
                    return (
                        <span
                            key={index}
                            ref={(el) => { wordRefs.current[index] = el; }}
                            className="relative truefocus-word cursor-pointer"
                            style={{
                                filter: manualMode
                                    ? isActive
                                        ? `blur(0px)`
                                        : `blur(${blurAmount}px)`
                                    : isActive
                                        ? `blur(0px)`
                                        : `blur(${blurAmount}px)`,
                                transition: `filter ${animationDuration}s ease`,
                            } as React.CSSProperties}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {word}
                        </span>
                    );
                })}

                <motion.div
                    className="absolute top-0 left-0 pointer-events-none box-border border-0"
                    animate={{
                        x: focusRect.x,
                        y: focusRect.y,
                        width: focusRect.width,
                        height: focusRect.height,
                        opacity: currentIndex >= 0 ? 1 : 0,
                    }}
                    transition={{
                        duration: animationDuration,
                    }}
                    style={{
                        "--border-color": borderColor,
                        "--glow-color": glowColor,
                    } as React.CSSProperties}
                >
                    <div
                        className="truefocus-corner truefocus-corner-tl"
                        style={{
                            filter: "drop-shadow(0 0 4px var(--border-color))",
                        }}
                    ></div>
                    <div
                        className="truefocus-corner truefocus-corner-tr"
                        style={{
                            filter: "drop-shadow(0 0 4px var(--border-color))",
                        }}
                    ></div>
                    <div
                        className="truefocus-corner truefocus-corner-bl"
                        style={{
                            filter: "drop-shadow(0 0 4px var(--border-color))",
                        }}
                    ></div>
                    <div
                        className="truefocus-corner truefocus-corner-br"
                        style={{
                            filter: "drop-shadow(0 0 4px var(--border-color))",
                        }}
                    ></div>
                </motion.div>
            </div>
        </>
    );
};

export default TrueFocus;