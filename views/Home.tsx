
import React from 'react';
import SearchSection from '../components/SearchSection';
import { db } from '../lib/mockDatabase';
import { useApp } from '../App';
import { CarStatus } from '../types';

const Home: React.FC = () => {
  const { setView, setSelectedCarId } = useApp();
  const featuredCars = db.getCars().filter(c => c.status === CarStatus.APPROVED).slice(0, 3);

  return (
    <div className="pb-20">
      <SearchSection />

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Experiences</h2>
            <p className="text-slate-500">Selected premium cars available right now in SA.</p>
          </div>
          <button 
            onClick={() => setView('SEARCH')}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Browse all cars →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCars.map(car => (
            <div 
              key={car.id} 
              className="group cursor-pointer"
              onClick={() => {
                setSelectedCarId(car.id);
                setView('DETAILS');
              }}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-all">
                <img 
                  src={car.images[0]} 
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900">
                  R{car.basePrice}/day
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{car.make} {car.model} {car.year}</h3>
              <p className="text-slate-500 text-sm flex items-center gap-2">
                <span>{car.transmission}</span>
                <span>•</span>
                <span>{car.location}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-white mb-6">List your car and start earning.</h2>
            <p className="text-slate-400 text-lg mb-8">
              Join thousands of hosts on DriveEasy. Turn your vehicle into a powerful engine for income. 
              We provide insurance coverage and the tools you need to succeed in the South African market.
            </p>
            <button 
              onClick={() => setView('OWNER_DASH')}
              className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors"
            >
              Learn More
            </button>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-2">R12,000+</div>
              <div className="text-slate-400 text-sm">Average monthly earnings for active hosts</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-slate-400 text-sm">Safe and verified community members</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-400 text-sm">Support for both renters and hosts</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-slate-400 text-sm">Happy trips across South Africa</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
