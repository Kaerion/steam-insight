
import React, { useState, useEffect, useCallback } from 'react';
import { GameStats, SteamInsightState, GroundingSource } from './types';
import { fetchTrendingGames, fetchSteamData } from './services/steamAiService';
import { GameCard } from './components/GameCard';
import { GameDetail } from './components/GameDetail';
import { ComparisonView } from './components/ComparisonView';
import { Skeleton } from './components/ui/Skeleton';

const App: React.FC = () => {
  const [state, setState] = useState<SteamInsightState>({
    trendingGames: [],
    searchResults: [],
    selectedGame: null,
    comparisonGames: [],
    isComparing: false,
    loading: true,
    error: null,
    sources: []
  });

  const [searchQuery, setSearchQuery] = useState('');

  const loadTrending = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { data, sources } = await fetchTrendingGames();
      setState(prev => ({
        ...prev,
        trendingGames: data,
        loading: false,
        sources
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load trending data. Check your API key or connection.', loading: false }));
    }
  }, []);

  useEffect(() => {
    loadTrending();
  }, [loadTrending]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setState(prev => ({ ...prev, loading: true, error: null, isComparing: false, selectedGame: null }));
    try {
      const { data, sources } = await fetchSteamData(`Detailed stats for ${searchQuery} and other related games`);
      setState(prev => ({
        ...prev,
        searchResults: data,
        loading: false,
        sources
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Search failed. Please try again.', loading: false }));
    }
  };

  const handleGameSelect = (game: GameStats) => {
    setState(prev => ({ ...prev, selectedGame: game, isComparing: false }));
  };

  const handleCompareToggle = (game: GameStats, e: React.MouseEvent) => {
    e.stopPropagation();
    setState(prev => {
      const isAlreadyIn = prev.comparisonGames.find(g => g.id === game.id);
      if (isAlreadyIn) {
        return { ...prev, comparisonGames: prev.comparisonGames.filter(g => g.id !== game.id) };
      }
      if (prev.comparisonGames.length >= 3) return prev;
      return { ...prev, comparisonGames: [...prev.comparisonGames, game] };
    });
  };

  const clearSelection = () => {
    setState(prev => ({ ...prev, selectedGame: null, isComparing: false }));
  };

  const startComparison = () => {
    setState(prev => ({ ...prev, isComparing: true, selectedGame: null }));
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header / Nav */}
      <nav className="sticky top-0 z-50 bg-[#0b0f14]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              clearSelection();
              setState(prev => ({ ...prev, searchResults: [] }));
              setSearchQuery('');
            }}
          >
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.875 16.5c-1.381 0-2.5-1.119-2.5-2.5s1.119-2.5 2.5-2.5 2.5 1.119 2.5 2.5-1.119 2.5-2.5 2.5zm6.875-5.625h-4.375V6.5h4.375v4.375z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:inline">STEAM<span className="text-sky-400">INSIGHT</span></span>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games, appid, or developers..."
                className="w-full bg-[#16202d] border border-slate-700 rounded-full py-2 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          <div className="flex gap-4">
            <button 
              onClick={loadTrending}
              className="p-2 text-slate-400 hover:text-sky-400 transition-colors"
              title="Refresh Trending"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        {state.error && (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-500 mb-8 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {state.error}
          </div>
        )}

        {state.isComparing ? (
          <ComparisonView 
            games={state.comparisonGames} 
            onClose={() => setState(prev => ({ ...prev, isComparing: false }))} 
          />
        ) : state.selectedGame ? (
          <GameDetail 
            game={state.selectedGame} 
            sources={state.sources}
            onBack={clearSelection} 
          />
        ) : (
          <div className="space-y-12">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {state.searchResults.length > 0 ? (
                    <>
                      <span className="text-sky-400">Search Results</span>
                      <span className="text-sm font-normal text-slate-500">({state.searchResults.length})</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sky-400">Trending Now</span>
                      <span className="text-sm font-normal text-slate-500">Live Steam Activity</span>
                    </>
                  )}
                </h2>
                {state.loading && <div className="animate-spin h-5 w-5 border-2 border-sky-500 border-t-transparent rounded-full" />}
              </div>

              {state.loading && state.trendingGames.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-video w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                      </div>
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(state.searchResults.length > 0 ? state.searchResults : state.trendingGames).map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game} 
                      isSelectedForCompare={!!state.comparisonGames.find(g => g.id === game.id)}
                      onCompareToggle={handleCompareToggle}
                      onClick={handleGameSelect} 
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#16202d] border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Market Status</h3>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">Active</span>
                  <span className="text-green-500 text-sm mb-1 font-medium">● Online</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">Steam services are operating normally.</p>
              </div>
              <div className="bg-[#16202d] border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Global Users</h3>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white mono">34.2M</span>
                  <span className="text-sky-500 text-sm mb-1 font-medium">Peak 24h</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">Approaching all-time record levels.</p>
              </div>
              <div className="bg-[#16202d] border border-slate-800 p-6 rounded-2xl">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Insight Mode</h3>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">AI Grounded</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">Using Gemini Google Search for accuracy.</p>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Floating Comparison Bar */}
      {state.comparisonGames.length > 0 && !state.isComparing && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-sky-950/40 backdrop-blur-xl border border-sky-500/30 p-4 rounded-3xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {state.comparisonGames.map(game => (
                  <img 
                    key={game.id} 
                    src={game.headerImage} 
                    className="w-10 h-10 rounded-full border-2 border-[#0b0f14] object-cover" 
                    alt={game.name}
                  />
                ))}
              </div>
              <div>
                <p className="text-white text-sm font-bold">{state.comparisonGames.length} Games Selected</p>
                <p className="text-sky-400 text-xs">Side-by-side comparison ready</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setState(prev => ({ ...prev, comparisonGames: [] }))}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={startComparison}
                disabled={state.comparisonGames.length < 2}
                className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-sky-500/20 transition-all active:scale-95"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            Data sourced via Gemini Google Search grounding from SteamDB, SteamCharts, and Official Steam API.
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Minimalist Steam Monitor © 2024. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
