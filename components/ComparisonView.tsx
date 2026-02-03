
import React from 'react';
import { GameStats } from '../types';

interface ComparisonViewProps {
  games: GameStats[];
  onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ games, onClose }) => {
  // Fix: Explicitly type the stats array to prevent TypeScript from inferring the format parameter as 'never' due to union function distribution
  const stats: { label: string; key: keyof GameStats; format: (v: any) => string }[] = [
    { label: 'Current Players', key: 'currentPlayers', format: (v: number) => v.toLocaleString() },
    { label: '24h Peak', key: 'peakPlayers24h', format: (v: number) => v.toLocaleString() },
    { label: 'All Time Peak', key: 'allTimePeak', format: (v: number) => v.toLocaleString() },
    { label: 'Total Sales (Est)', key: 'totalSales', format: (v: string) => v },
    { label: 'Price', key: 'currentPrice', format: (v: string) => v },
    { label: 'Rating', key: 'rating', format: (v: string) => v },
    { label: 'Release Date', key: 'releaseDate', format: (v: string) => v },
    { label: 'Developer', key: 'developer', format: (v: string) => v },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Game Comparison</h1>
          <p className="text-slate-400">Comparing {games.length} selected titles side-by-side.</p>
        </div>
        <button 
          onClick={onClose}
          className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full transition-colors"
        >
          Close Comparison
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Labels Column (Visible only on desktop) */}
        <div className="hidden md:flex flex-col pt-[180px]">
          {stats.map(stat => (
            <div key={stat.label} className="h-16 flex items-center text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-800/50">
              {stat.label}
            </div>
          ))}
        </div>

        {/* Game Columns */}
        {games.map((game, idx) => (
          <div key={game.id} className="bg-[#16202d] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="aspect-[16/9] w-full relative">
              <img src={game.headerImage} alt={game.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16202d] to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-bold text-white truncate text-xl">{game.name}</h3>
              </div>
            </div>
            
            <div className="p-4 space-y-0">
              {stats.map(stat => (
                <div key={stat.label} className="h-16 flex flex-col justify-center border-b border-slate-800/50 last:border-0">
                  <span className="md:hidden text-[10px] text-slate-500 font-bold uppercase mb-1">{stat.label}</span>
                  <span className={`text-sm font-medium ${
                    stat.key === 'totalSales' ? 'text-emerald-400' : 
                    stat.key === 'currentPrice' ? 'text-sky-400' : 'text-slate-200'
                  } mono`}>
                    {stat.format((game as any)[stat.key])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Empty Slots */}
        {[...Array(3 - games.length)].map((_, i) => (
          <div key={i} className="hidden md:flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl h-full min-h-[500px] text-slate-700">
            <div className="text-center p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-sm">Select another game to compare</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
