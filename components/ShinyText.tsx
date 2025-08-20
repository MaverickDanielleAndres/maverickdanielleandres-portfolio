"use client";

import React from "react";
import styles from "./ShinyText.module.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
});

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number; // seconds
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 5,
  className = "",
}) => {
  return (
    <span
      className={`${styles.shinyText} ${disabled ? styles.disabled : ""} ${poppins.className} ${className}`}
      style={{ animationDuration: `${speed}s` }}
      data-text={text}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={styles.letter}
          style={{ animationDelay: `${i * 0.1}s` }} // stagger letters
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

export default ShinyText;
