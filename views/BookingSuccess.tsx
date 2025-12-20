
import React from 'react';
import { useApp } from '../App';

const BookingSuccess: React.FC = () => {
  const { setView } = useApp();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-50 animate-bounce">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">You're all set!</h1>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed">
          Your booking is confirmed. We've sent the trip details and pickup instructions to your email.
        </p>
        <div className="space-y-4">
          <button 
            onClick={() => setView('SEARCH')}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            Find another drive
          </button>
          <button 
            onClick={() => setView('HOME')}
            className="w-full text-slate-500 font-bold hover:text-slate-900 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
