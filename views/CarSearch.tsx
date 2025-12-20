
import React, { useState, useMemo } from 'react';
import { db } from '../lib/mockDatabase';
import { CarStatus } from '../types';
import { useApp } from '../App';

const CarSearch: React.FC = () => {
  const { setView, setSelectedCarId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'All',
    transmission: 'All',
    maxPrice: 5000,
  });

  const cars = useMemo(() => {
    return db.getCars().filter(car => {
      const matchesSearch = `${car.make} ${car.model} ${car.location}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filters.type === 'All' || car.type === filters.type;
      const matchesTransmission = filters.transmission === 'All' || car.transmission === filters.transmission;
      const matchesPrice = car.basePrice <= filters.maxPrice;
      const isApproved = car.status === CarStatus.APPROVED;
      
      return matchesSearch && matchesType && matchesTransmission && matchesPrice && isApproved;
    });
  }, [searchTerm, filters]);

  const carTypes = ['All', 'Sedan', 'SUV', 'Luxury', 'Sports', 'Electric'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 space-y-8 shrink-0">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Price Range</h3>
            <div className="space-y-4">
              <input 
                type="range" 
                min="200" 
                max="10000" 
                step="200"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-sm font-medium text-slate-600">
                <span>R200</span>
                <span>Up to R{filters.maxPrice}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Car Type</h3>
            <div className="space-y-2">
              {carTypes.map(type => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="type"
                    checked={filters.type === type}
                    onChange={() => setFilters(prev => ({ ...prev, type }))}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span className={`text-sm transition-colors ${filters.type === type ? 'text-indigo-600 font-semibold' : 'text-slate-600 group-hover:text-slate-900'}`}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Transmission</h3>
            <div className="flex flex-col gap-2">
              {['All', 'Automatic', 'Manual'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilters(prev => ({ ...prev, transmission: t }))}
                  className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${filters.transmission === t ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-grow">
          <div className="mb-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by make, model, or location..."
                className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-indigo-500 text-lg transition-shadow shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-500 font-medium">{cars.length} cars available</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Sort by:</span>
              <select className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest first</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cars.map(car => (
              <div 
                key={car.id}
                onClick={() => {
                  setSelectedCarId(car.id);
                  setView('DETAILS');
                }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-200 hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img src={car.images[0]} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                    {car.type}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">{car.make} {car.model} {car.year}</h3>
                      <p className="text-slate-500 text-sm font-medium">{car.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-900">R{car.basePrice}</div>
                      <div className="text-xs text-slate-500 font-medium">per day</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      {car.transmission}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      {car.seats} Seats
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cars.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-3xl">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No cars found</h3>
              <p className="text-slate-500">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarSearch;
