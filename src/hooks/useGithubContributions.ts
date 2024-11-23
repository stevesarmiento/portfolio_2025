import { useQuery } from '@tanstack/react-query';

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

async function fetchGithubContributions(username: string): Promise<ContributionDay[]> {
  const response = await fetch(`/api/github-contributions?username=${username}`);
  if (!response.ok) {
    throw new Error('Failed to fetch contributions');
  }
  return response.json();
}

export function useGithubContributions(username: string) {
  return useQuery({
    queryKey: ['githubContributions', username],
    queryFn: () => fetchGithubContributions(username),
    enabled: Boolean(username),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}