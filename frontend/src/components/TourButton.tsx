'use client';

import { useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { useTour } from '@/hooks/useTour';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { usePathname } from 'next/navigation';

interface TourButtonProps {
  collapsed?: boolean;
  /** If true, automatically starts the overview tour on first visit */
  autoStart?: boolean;
}

// Page labels for tooltip context
const PAGE_LABELS: Record<string, string> = {
  '/dashboard': 'Command Center Tour',
  '/dashboard/incidents': 'Incidents Tour',
  '/dashboard/predictions': 'Predictions Tour',
  '/dashboard/simulation': 'Simulation Tour',
  '/dashboard/recommendations': 'Recommendations Tour',
  '/dashboard/cctv': 'CCTV Tour',
  '/dashboard/analytics': 'Analytics Tour',
};

function getPageLabel(pathname: string): string {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  const match = Object.keys(PAGE_LABELS).find(
    (k) => k !== '/dashboard' && pathname.startsWith(k)
  );
  return match ? PAGE_LABELS[match] : 'Getting Started Tour';
}

export function TourButton({ collapsed = false, autoStart = false }: TourButtonProps) {
  const { startTour, startOverviewTour, checkAndAutoStart } = useTour();
  const pathname = usePathname();

  const isDashboardHome = pathname === '/dashboard';
  const label = getPageLabel(pathname);

  // On dashboard home → overview tour; on sub-pages → page-specific tour
  const handleClick = () => {
    if (isDashboardHome) {
      startOverviewTour();
    } else {
      startTour(pathname);
    }
  };

  useEffect(() => {
    if (autoStart) {
      checkAndAutoStart();
    }
  }, [autoStart, checkAndAutoStart]);

  const buttonContent = (
    <>
      <BookOpen className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-6 text-blue-400" />
      <span
        className={`text-sm whitespace-nowrap transition-all duration-200 text-blue-400 ${
          collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'
        }`}
      >
        {label}
      </span>
    </>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          id="tour-start-btn"
          onClick={handleClick}
          className="flex items-center justify-center px-3 min-h-[44px] rounded-xl w-full transition-all duration-200 group cursor-pointer
            text-muted-foreground hover:bg-accent hover:text-accent-foreground
            border border-dashed border-border/40 hover:border-border"
          aria-label={label}
        >
          <BookOpen className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-6 text-blue-400" />
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      id="tour-start-btn"
      onClick={handleClick}
      className="flex items-center gap-3 px-3 min-h-[44px] rounded-xl w-full transition-all duration-200 group cursor-pointer
        text-muted-foreground hover:bg-accent hover:text-accent-foreground font-medium
        border border-dashed border-border/40 hover:border-border"
      aria-label={label}
    >
      {buttonContent}
    </button>
  );
}
