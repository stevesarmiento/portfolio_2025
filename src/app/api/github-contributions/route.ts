import { NextResponse } from 'next/server';

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: {
            contributionDays: {
              contributionCount: number;
              date: string;
              contributionLevel: string;
            }[];
          }[];
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  // Check if GitHub token exists
  if (!process.env.GITHUB_TOKEN) {
    console.error('GitHub API Error: GITHUB_TOKEN environment variable is not set');
    return NextResponse.json(
      { error: 'GitHub API configuration error' },
      { status: 500 }
    );
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    console.log(`Fetching GitHub contributions for username: ${username}`);
    
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Portfolio-App/1.0',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    console.log(`GitHub API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GitHub API Error: ${response.status} - ${errorText}`);
      
      // Return mock data instead of failing
      return NextResponse.json(generateMockContributions());
    }

    const data = (await response.json()) as GitHubResponse;
    
    // Check for GraphQL errors
    if (data.errors && data.errors.length > 0) {
      console.error('GitHub GraphQL Errors:', data.errors);
      return NextResponse.json(generateMockContributions());
    }

    // Check if user data exists
    if (!data.data?.user?.contributionsCollection?.contributionCalendar) {
      console.error('GitHub API Error: Invalid response structure or user not found');
      return NextResponse.json(generateMockContributions());
    }
    
    const contributions: ContributionDay[] = data.data.user.contributionsCollection.contributionCalendar.weeks
      .flatMap(week => week.contributionDays)
      .map(day => ({
        date: day.date,
        count: day.contributionCount,
        level: getLevelFromContributionLevel(day.contributionLevel),
      }));

    console.log(`Successfully fetched ${contributions.length} contribution days`);
    return NextResponse.json(contributions);
    
  } catch (error) {
    console.error('GitHub API Error:', error);
    
    // Return mock data as fallback
    return NextResponse.json(generateMockContributions());
  }
}

function getLevelFromContributionLevel(level: string): 0 | 1 | 2 | 3 | 4 {
  const levels: Record<string, 0 | 1 | 2 | 3 | 4> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };
  return levels[level] ?? 0;
}

// Generate mock contribution data as fallback
function generateMockContributions(): ContributionDay[] {
  const contributions: ContributionDay[] = [];
  const today = new Date();
  
  // Generate last 365 days of mock data
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Create some realistic patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Lower activity on weekends, some random variation
    let count = 0;
    const random = Math.random();
    
    if (!isWeekend) {
      if (random > 0.7) count = Math.floor(Math.random() * 8) + 1;
      else if (random > 0.4) count = Math.floor(Math.random() * 4) + 1;
    } else {
      if (random > 0.8) count = Math.floor(Math.random() * 3) + 1;
    }
    
    contributions.push({
      date: date.toISOString().split('T')[0],
      count,
      level: count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4,
    });
  }
  
  return contributions;
}