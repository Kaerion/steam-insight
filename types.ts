
export interface GameStats {
  id: string;
  name: string;
  currentPlayers: number;
  peakPlayers24h: number;
  allTimePeak: number;
  totalSales: string;
  currentPrice: string;
  discountPercentage?: number;
  releaseDate: string;
  developer: string;
  publisher: string;
  tags: string[];
  description: string;
  rating: string;
  headerImage: string;
  lastUpdated: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SteamInsightState {
  trendingGames: GameStats[];
  searchResults: GameStats[];
  selectedGame: GameStats | null;
  comparisonGames: GameStats[]; // New field for comparison feature
  isComparing: boolean;         // Flag to toggle comparison view
  loading: boolean;
  error: string | null;
  sources: GroundingSource[];
}
