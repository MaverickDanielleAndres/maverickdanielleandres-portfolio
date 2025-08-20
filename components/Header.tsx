"use client";
import GooeyNav from "@/components/GooeyNav";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Certificates", href: "/certificates" },
    { label: "Contact", href: "/contact" },
  ];

  // Fix: Only use the found index if it's valid, otherwise default to 0
  const foundIndex = items.findIndex(i => i.href === pathname);
  const initialActiveIndex = foundIndex !== -1 ? foundIndex : 0;

  return (
    <>
      <style jsx global>{`
        :root {
          --color-1: #ffffff;
          --color-2: #ff00ff;
          --color-3: #8a2be2;
          --color-4: #00bfff;
        }
      `}</style>

      <div className="bg-black w-full pt-7 pb-4 flex justify-center">
        <GooeyNav
          items={items}
          initialActiveIndex={initialActiveIndex}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
      </div>
    </>
  );
}