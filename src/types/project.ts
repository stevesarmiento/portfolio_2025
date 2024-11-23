export interface Project {
    id: number;
    title: string;
    content: string;
    description: string;
    body: {
      intro?: string;
      details?: string[];
    };
    image: string;
    images?: string[];
    backgroundUrl: string;
    link: string;
    tags?: string[];
    year?: string;
    status?: 'completed' | 'in-progress' | 'archived';
  }