
import React, { useState } from 'react';
import { useApp } from '../App';

const SearchSection: React.FC = () => {
  const { setView, setSearchQuery } = useApp();
  const [location, setLocation] = useState('');

  return (
    <div className="relative h-[600px] flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6">
        <div className="text-center mb-10 text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            Find your drive.
          </h1>
          <p className="text-xl md:text-2xl font-medium text-slate-200">
            Explore the world's largest car sharing marketplace
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Where</label>
            <input
              type="text"
              placeholder="City, airport, or address"
              className="w-full border-none focus:ring-0 text-slate-900 font-medium text-lg placeholder:text-slate-300"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="w-full md:w-px bg-slate-200 h-px md:h-12 self-center"></div>
          <div className="flex-grow">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">From</label>
            <input type="date" className="w-full border-none focus:ring-0 text-slate-900 font-medium" />
          </div>
          <div className="w-full md:w-px bg-slate-200 h-px md:h-12 self-center"></div>
          <div className="flex-grow">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Until</label>
            <input type="date" className="w-full border-none focus:ring-0 text-slate-900 font-medium" />
          </div>
          <button
            onClick={() => {
              setSearchQuery(location);
              setView('SEARCH');
            }}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-200"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
