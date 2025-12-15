"use client";

import React from "react";
import styles from "./ShinyText.module.css";

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
      className={`${styles.shinyText} ${disabled ? styles.disabled : ""} ${className}`}
      style={{ animationDuration: `${speed}s` }}
      data-text={text}
    >
      {text}
    </span>
  );
};

export default ShinyText;
