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
      // Was 600px — too eager. Mounting sections 600px ahead of the viewport
      // means a heavy component (e.g. the GitHub calendar with hundreds of
      // SVG nodes) starts layout/paint work while the user is still mid-scroll
      // through the previous section. 100px is enough for the new section
      // to be ready by the time it scrolls into view, without piling work
      // onto an already-busy scroll.
      { rootMargin: "100px" }
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
