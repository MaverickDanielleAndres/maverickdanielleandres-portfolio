"use client";

import dynamic from "next/dynamic";

// Off-canvas menu, project-inquiry modal, and the AI chat trigger are not
// part of the first paint. Dynamically importing them from a Client
// Component keeps `ssr:false` (Next 16 forbids it from a Server
// Component) while still pushing their JS past the critical path.
const Offcanvas = dynamic(
  () => import("@/components/Offcanvas").then((m) => ({ default: m.Offcanvas })),
  { ssr: false, loading: () => null }
);
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
