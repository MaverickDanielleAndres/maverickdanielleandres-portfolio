import { Button, ButtonProps } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lazy import of the modal chunk. Kept in module scope so every button
 * shares a single prefetch handle — first hover/touch on any trigger
 * downloads & parses the modal ahead of the click, removing the ~150-400ms
 * dynamic-chunk wait that previously made the click feel laggy.
 *
 * The promise is intentionally not awaited at module load: the chunk is only
 * fetched once we know the user is interacting with a trigger.
 */
let inquiryChunkPrefetched: Promise<unknown> | null = null;
function prefetchInquiryChunk(): void {
  if (typeof window === "undefined") return;
  if (!inquiryChunkPrefetched) {
    inquiryChunkPrefetched = import(
      "@/components/project-inquiry/project-inquiry-modal"
    ).then((m) => m.default);
  }
}

export function GetStartedButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      // Prefetch on hover/focus/touchstart — the chunk arrives before the click
      // resolves, so opening feels instant.
      onMouseEnter={prefetchInquiryChunk}
      onFocus={prefetchInquiryChunk}
      onTouchStart={prefetchInquiryChunk}
      className={cn(
        "group flex items-center justify-center overflow-hidden rounded-md bg-[#1A1A1A] hover:bg-[#2A2A2A] !text-[#FFFFFF] border border-[#FFFFFF]/20 transition-colors duration-150 h-9 px-4 sm:h-10 sm:px-5 lg:h-11 lg:px-8 text-xs sm:text-sm shrink-0 whitespace-nowrap",
        className
      )}
      {...props}
    >
      <span className="font-medium tracking-wide pr-1.5 sm:pr-2">
        Get Started
      </span>
      <ChevronRight size={14} strokeWidth={2} className="transition-transform duration-150 group-hover:translate-x-1 sm:hidden" />
      <ChevronRight size={16} strokeWidth={2} className="transition-transform duration-150 group-hover:translate-x-1 hidden sm:block lg:hidden" />
      <ChevronRight size={18} strokeWidth={2} className="transition-transform duration-150 group-hover:translate-x-1 hidden lg:block" />
    </Button>
  );
}