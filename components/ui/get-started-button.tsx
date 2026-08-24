import { Button, ButtonProps } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function GetStartedButton({ className, ...props }: ButtonProps) {
  return (
    <Button 
      className={cn(
        "group flex items-center justify-center overflow-hidden rounded-md bg-[#1A1A1A] hover:bg-[#2A2A2A] !text-[#FFFFFF] border border-[#FFFFFF]/20 transition-all duration-300", 
        className
      )} 
      size="lg" 
      {...props}
    >
      <span className="font-medium tracking-wide pr-2">
        Get Started
      </span>
      <ChevronRight size={16} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
    </Button>
  );
}
