"use client";

import dynamic from "next/dynamic";
import { Offcanvas } from "@/components/Offcanvas";

const GlobalInquiry = dynamic(
  () => import("@/components/GlobalInquiry"),
  { ssr: false, loading: () => null }
);
const PortfolioChat = dynamic(
  () => import("@/components/portfolio-chat/portfolio-chat"),
  { ssr: false, loading: () => null }
);

export default function FloatingUI() {
  return (
    <>
      <Offcanvas />
      <GlobalInquiry />
      <PortfolioChat />
    </>
  );
}
