
import React from 'react';
import { useApp } from '../App';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { user, setUser, setView, view } = useApp();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setView('HOME')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">DriveShare</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button 
            onClick={() => setView('SEARCH')}
            className={`hover:text-indigo-600 transition-colors ${view === 'SEARCH' ? 'text-indigo-600' : ''}`}
          >
            Find a Car
          </button>
          
          {user?.role === UserRole.RENTER && (
            <button className="hover:text-indigo-600 transition-colors">My Trips</button>
          )}

          {user?.role === UserRole.OWNER && (
            <button 
              onClick={() => setView('OWNER_DASH')}
              className={`hover:text-indigo-600 transition-colors ${view === 'OWNER_DASH' ? 'text-indigo-600' : ''}`}
            >
              Owner Portal
            </button>
          )}

          {user?.role === UserRole.ADMIN && (
            <button 
              onClick={() => setView('ADMIN_DASH')}
              className={`hover:text-indigo-600 transition-colors ${view === 'ADMIN_DASH' ? 'text-indigo-600' : ''}`}
            >
              Admin Center
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button 
                onClick={() => setView('LOGIN')}
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Log in
              </button>
              <button 
                onClick={() => setView('LOGIN')}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Sign up
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
              </div>
              <button 
                onClick={() => setUser(null)}
                className="w-10 h-10 rounded-full border-2 border-indigo-100 p-0.5 overflow-hidden group"
              >
                <img 
                  src={user.avatar || 'https://picsum.photos/100/100'} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover group-hover:opacity-75"
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
