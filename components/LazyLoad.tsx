"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface LazyLoadProps {
  children: ReactNode;
  height?: string | number;
}

export default function LazyLoad({ children, height = "100vh" }: LazyLoadProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" } // Load well before it comes into view
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  if (hasMounted) {
    return <>{children}</>;
  }

  return <div ref={ref} style={{ height, width: "100%" }} aria-hidden="true" />;
}
