import React, { useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  className = "",
  spotlightColor = "rgba(0, 229, 255, 0.2)",
  icon,
  title,
  description,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative group cursor-pointer rounded-xl bg-neutral-800 border border-neutral-700 p-4 transition-all duration-300 hover:bg-neutral-700 hover:shadow-lg ${className}`}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* Content */}
      <div className="flex items-start gap-3">
        <div className="text-lg">{icon}</div>
        <div>
          <h3 className="font-bold text-white text-sm sm:text-base">{title}</h3>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default SpotlightCard;