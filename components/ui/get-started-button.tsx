import { Button, ButtonProps } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function GetStartedButton({ className, ...props }: ButtonProps) {
  return (
    <Button
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
