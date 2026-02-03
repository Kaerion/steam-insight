
import React from 'react';
import { GameStats } from '../types';

interface GameCardProps {
  game: GameStats;
  isSelectedForCompare: boolean;
  onCompareToggle: (game: GameStats, e: React.MouseEvent) => void;
  onClick: (game: GameStats) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, isSelectedForCompare, onCompareToggle, onClick }) => {
  return (
    <div 
      onClick={() => onClick(game)}
      className={`group relative bg-[#16202d] border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10 ${
        isSelectedForCompare ? 'border-sky-500 ring-1 ring-sky-500' : 'border-slate-800 hover:border-sky-500/50'
      }`}
    >
      <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
        <img 
          src={game.headerImage || `https://picsum.photos/seed/${game.id}/600/300`} 
          alt={game.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          <span className="mono text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10">
            {game.currentPlayers.toLocaleString()} 👤
          </span>
          <span className="mono text-[10px] font-bold text-emerald-400 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-emerald-500/20">
            {game.totalSales} Sold
          </span>
        </div>
        
        {/* Compare Toggle Button */}
        <button 
          onClick={(e) => onCompareToggle(game, e)}
          className={`absolute bottom-2 left-2 p-1.5 rounded-lg backdrop-blur-md border transition-all ${
            isSelectedForCompare 
              ? 'bg-sky-500 text-white border-sky-400 scale-110' 
              : 'bg-black/40 text-slate-300 border-white/10 hover:bg-black/60 hover:text-white'
          }`}
          title="Add to comparison"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-white truncate pr-2 group-hover:text-sky-400 transition-colors">
            {game.name}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-sm font-medium ${game.discountPercentage ? 'text-green-400' : 'text-slate-300'}`}>
            {game.currentPrice}
          </span>
          {game.discountPercentage && (
            <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">
              -{game.discountPercentage}%
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {game.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-800 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
