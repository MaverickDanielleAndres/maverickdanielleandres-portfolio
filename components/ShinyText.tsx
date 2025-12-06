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
    <>
      <style jsx>{`
        .responsive-shiny-text {
          display: inline-block;
          font-size: inherit; /* Inherit from parent by default */
        }

        /* Small mobile screens (up to 480px) */
        @media (max-width: 480px) {
          .responsive-shiny-text {
            font-size: 1.25rem; /* 20px */
          }
        }

        /* Mobile screens (481px to 640px) */
        @media (min-width: 481px) and (max-width: 640px) {
          .responsive-shiny-text {
            font-size: 1.75rem; /* 24px */
          }
        }

        /* Small tablet screens (641px to 768px) */
        @media (min-width: 641px) and (max-width: 768px) {
          .responsive-shiny-text {
            font-size: 2.875rem; /* 30px */
          }
        }

        /* Large tablet screens (769px to 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
          .responsive-shiny-text {
            font-size: 4.75rem; /* 36px */
          }
        }

        /* Desktop screens (1025px and up) */
        @media (min-width: 1025px) {
          .responsive-shiny-text {
            font-size: 4.75rem; /* 40px */
          }
        }

        /* Large desktop screens (1440px and up) */
        @media (min-width: 1440px) {
          .responsive-shiny-text {
            font-size: 4.75rem; /* 48px */
          }
        }
      `}</style>
      
      <span
        className={`${styles.shinyText} ${disabled ? styles.disabled : ""} ${poppins.className} ${className} responsive-shiny-text`}
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
    </>
  );
};

export default ShinyText;