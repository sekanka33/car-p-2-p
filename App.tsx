
import React, { useState, useEffect, createContext, useContext } from 'react';
// Fix: Import User and UserRole from the types module where they are defined and exported
import { User, UserRole } from './types';
import { db } from './lib/mockDatabase';
import Navbar from './components/Navbar';
import Home from './views/Home';
import CarSearch from './views/CarSearch';
import CarDetails from './views/CarDetails';
import OwnerDashboard from './views/OwnerDashboard';
import AdminDashboard from './views/AdminDashboard';
import Login from './views/Login';
import BookingSuccess from './views/BookingSuccess';

// Basic router implementation for this environment
type View = 'HOME' | 'SEARCH' | 'DETAILS' | 'OWNER_DASH' | 'ADMIN_DASH' | 'LOGIN' | 'SUCCESS';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  view: View;
  setView: (view: View) => void;
  selectedCarId: string | null;
  setSelectedCarId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('driveshare_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState<View>('HOME');
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('driveshare_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('driveshare_session');
    }
  }, [user]);

  const renderView = () => {
    switch (view) {
      case 'HOME': return <Home />;
      case 'SEARCH': return <CarSearch />;
      case 'DETAILS': return <CarDetails id={selectedCarId!} />;
      case 'OWNER_DASH': return <OwnerDashboard />;
      case 'ADMIN_DASH': return <AdminDashboard />;
      case 'LOGIN': return <Login />;
      case 'SUCCESS': return <BookingSuccess />;
      default: return <Home />;
    }
  };

  return (
    <AppContext.Provider value={{ user, setUser, view, setView, selectedCarId, setSelectedCarId }}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {renderView()}
        </main>
        <footer className="bg-slate-900 text-white py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DriveEasy</h3>
              <p className="text-slate-400 text-sm">Experience South Africa's most convenient peer-to-peer car rental marketplace.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Marketplace</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>Find a car</li>
                <li>Become a host</li>
                <li>How it works</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>About us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} DriveEasy Inc. All rights reserved.
          </div>
        </footer>
      </div>
    </AppContext.Provider>
  );
};

export default App;