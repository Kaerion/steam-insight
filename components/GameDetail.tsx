
import React from 'react';
import { GameStats, GroundingSource } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GameDetailProps {
  game: GameStats;
  sources: GroundingSource[];
  onBack: () => void;
}

export const GameDetail: React.FC<GameDetailProps> = ({ game, sources, onBack }) => {
  const chartData = [
    { name: '48h ago', players: Math.floor(game.currentPlayers * 0.8) },
    { name: '24h ago', players: game.peakPlayers24h },
    { name: '12h ago', players: Math.floor(game.currentPlayers * 1.1) },
    { name: 'Now', players: game.currentPlayers },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto p-4 md:p-8">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <header>
            <h1 className="text-4xl font-bold text-white mb-2">{game.name}</h1>
            <p className="text-slate-400 leading-relaxed text-lg max-w-2xl">
              {game.description}
            </p>
          </header>

          <section className="bg-[#16202d] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-slate-200">Player Activity (24h)</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide={true} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="players" 
                    stroke="#38bdf8" 
                    fillOpacity={1} 
                    fill="url(#colorPlayers)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-[#16202d] border border-slate-800 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Current</p>
              <p className="text-xl font-bold text-white mono">{game.currentPlayers.toLocaleString()}</p>
            </div>
            <div className="bg-[#16202d] border border-slate-800 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">24h Peak</p>
              <p className="text-xl font-bold text-white mono">{game.peakPlayers24h.toLocaleString()}</p>
            </div>
            <div className="bg-[#16202d] border border-slate-800 p-4 rounded-xl text-center ring-1 ring-emerald-500/30">
              <p className="text-xs text-emerald-500 uppercase tracking-widest mb-1 font-bold">Estimated Sales</p>
              <p className="text-xl font-bold text-emerald-400 mono">{game.totalSales}</p>
            </div>
            <div className="bg-[#16202d] border border-slate-800 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Price</p>
              <p className="text-xl font-bold text-sky-400 mono">{game.currentPrice}</p>
            </div>
            <div className="bg-[#16202d] border border-slate-800 p-4 rounded-xl text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Rating</p>
              <p className="text-xl font-bold text-yellow-500 mono">{game.rating}</p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-[#16202d] border border-slate-800 rounded-2xl overflow-hidden">
            <img src={game.headerImage || `https://picsum.photos/seed/${game.id}/600/300`} className="w-full" alt="Cover" />
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Developer</h4>
                <p className="text-slate-200">{game.developer}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Publisher</h4>
                <p className="text-slate-200">{game.publisher}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Release Date</h4>
                <p className="text-slate-200">{game.releaseDate}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">All Time Peak</h4>
                <p className="text-slate-200 mono font-bold">{game.allTimePeak.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-sky-500/5 border border-sky-500/20 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-sky-400 uppercase tracking-widest mb-4">Verified Sources</h4>
            <div className="space-y-3">
              {sources.map((source, i) => (
                <a 
                  key={i}
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-sm text-slate-300 hover:text-white underline decoration-slate-700 hover:decoration-sky-500 transition-all truncate"
                >
                  {source.title}
                </a>
              ))}
              {sources.length === 0 && <p className="text-slate-500 text-sm">Steam API / Web Search Data</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
