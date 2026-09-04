export interface StyleConfig {
  id: string;
  title: string;
  description: string;
  prompt: string;
  iconName?: string;
}

export interface GeneratedImage {
  id: string;
  styleId: string;
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ApiConfig {
  mode: 'server' | 'custom';
  apiKey: string;
  baseUrl: string;
  model: string;
}
