export type PricingTier = 'Free' | 'Freemium' | 'Paid' | 'Enterprise';

export interface AITool {
  name: string;
  description: string;
  pricing_tier: PricingTier;
  category: string;
  skill_level: 'Beginner' | 'Developer' | 'All';
  website_url: string;
}

export interface MatchedTool {
  name: string;
  description: string;
  pricing_tier: PricingTier;
  reason: string;
  category?: string;
  website_url?: string;
}

export interface MatchRequest {
  prompt: string;
  budget?: 'any' | 'free_only';
  skill?: 'beginner' | 'developer';
}

export interface MatchResponse {
  tools: MatchedTool[];
  query: string;
  total_database_tools: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  toolCount: number;
  tools: MatchedTool[];
}
