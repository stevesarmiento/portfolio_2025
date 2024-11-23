import React from 'react';
import { motion } from 'framer-motion';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip";
  
interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GithubContributionsProps {
  username: string;
  showFullYear?: boolean;
}

export function GithubContributions({ 
    username, 
    showFullYear = true
  }: GithubContributionsProps) {
  const [contributions, setContributions] = React.useState<ContributionDay[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const weeksToShow = showFullYear ? 52 : 32;

  React.useEffect(() => {
    async function fetchContributions() {
      try {
        const response = await fetch(`/api/github-contributions?username=${username}`);
        if (!response.ok) throw new Error('Failed to fetch contributions');
        const data = await response.json();
        setContributions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contributions');
      } finally {
        setIsLoading(false);
      }
    }

    fetchContributions();
  }, [username]);

  const getContributionColor = (level: number) => {
    const colors = {
      0: 'bg-[#2E4D61]/10',
      1: 'bg-[#2E4D61]/50',
      2: 'bg-[#2E4D61]/70',
      3: 'bg-[#2E4D61]/90',
      4: 'bg-[#2E4D61]'
    };
    return colors[level as keyof typeof colors];
  };

  const weeks = React.useMemo(() => {
    if (!contributions.length) return [];
    
    const allDays = [...contributions];
    const days = showFullYear 
      ? allDays 
      : allDays.slice(-32 * 7);
      
    const result = [];
    const totalWeeks = showFullYear ? 52 : 32;
    
    for (let i = 0; i < totalWeeks; i++) {
      result.push(days.slice(i * 7, (i + 1) * 7));
    }
    
    return result;
  }, [contributions, showFullYear]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex gap-[3px]">
          {Array.from({ length: weeksToShow }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-2 h-2 bg-slate-200/20 rounded-[2px]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <TooltipProvider>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=""
    >
      <div className="flex gap-[3px]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[5px]">
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const day = week[dayIndex] || { date: '', count: 0, level: 0 };
              return (
                <Tooltip delayDuration={0} key={`${weekIndex}-${dayIndex}`}>
                  <TooltipTrigger asChild>
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                    className={`w-3.5 h-3.5 ${getContributionColor(day.level)} rounded-sm`}
                    title={day.date ? `${day.count} contributions on ${day.date}` : 'No contributions'}
                    />
                  </TooltipTrigger>
                  <TooltipContent 
                      className="text-white/80 font-bold text-md font-nuvo bg-slate-700 border-t border-slate-500 border-b-0 border-r-0 border-l-0 rounded-xl ring-1 ring-black shadow-lg shadow-black/70"
                      side="top"
                    >
                      {day.count === 0 ? (
                        'No contributions'
                      ) : (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium text-md text-white">
                            {day.count} contribution{day.count === 1 ? '' : 's'}
                          </span>
                          <span className="text-white/50">
                            {new Date(day.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
    </TooltipProvider>
  );
}