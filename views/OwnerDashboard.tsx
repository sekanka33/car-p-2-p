
import React, { useState } from 'react';
import { db } from '../lib/mockDatabase';
import { useApp } from '../App';
import { CarStatus, Car, UserRole } from '../types';

const OwnerDashboard: React.FC = () => {
  const { user, setView } = useApp();
  const ownerCars = db.getCars().filter(c => c.ownerId === user?.id);
  const ownerBookings = db.getBookings().filter(b => ownerCars.some(c => c.id === b.carId));
  const ownerTransactions = db.getTransactions().filter(t => ownerBookings.some(b => b.id === t.bookingId));
  
  const [showForm, setShowForm] = useState(false);
  const [newCar, setNewCar] = useState<Partial<Car>>({
    make: '',
    model: '',
    year: 2024,
    transmission: 'Automatic',
    seats: 5,
    mileage: 0,
    description: '',
    basePrice: 100,
    location: '',
    type: 'Sedan'
  });

  if (!user || user.role !== UserRole.OWNER) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-slate-500 mb-6">You need an owner account to view this portal.</p>
        <button onClick={() => setView('HOME')} className="bg-slate-900 text-white px-6 py-2 rounded-lg">Go Home</button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const car: Car = {
      ...newCar as Car,
      id: 'c' + Math.random().toString(36).substr(2, 9),
      ownerId: user.id,
      status: CarStatus.PENDING,
      images: ['https://picsum.photos/seed/newcar/800/600'],
      documents: []
    };
    db.addCar(car);
    setShowForm(false);
    alert('Listing submitted! Waiting for admin approval.');
  };

  const totalEarnings = ownerTransactions.reduce((acc, t) => acc + (t.amount * 0.8), 0); // 20% platform fee

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Owner Dashboard</h1>
            <p className="text-slate-500 font-medium">Manage your fleet and earnings</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            List a New Car
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase mb-2">Total Earnings</div>
            <div className="text-3xl font-extrabold text-slate-900">${totalEarnings.toFixed(2)}</div>
            <div className="text-green-500 text-xs font-bold mt-1">+12% from last month</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase mb-2">Active Listings</div>
            <div className="text-3xl font-extrabold text-slate-900">{ownerCars.filter(c => c.status === CarStatus.APPROVED).length}</div>
            <div className="text-slate-500 text-xs mt-1">out of {ownerCars.length} total</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase mb-2">Total Bookings</div>
            <div className="text-3xl font-extrabold text-slate-900">{ownerBookings.length}</div>
            <div className="text-slate-500 text-xs mt-1">all time</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-slate-400 text-xs font-bold uppercase mb-2">Rating</div>
            <div className="text-3xl font-extrabold text-slate-900">4.9</div>
            <div className="text-indigo-500 text-xs font-bold mt-1">Top rated host</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Recent Activity</h3>
                <button className="text-indigo-600 text-sm font-semibold hover:underline">View all</button>
              </div>
              <div className="divide-y divide-slate-50">
                {ownerBookings.length > 0 ? ownerBookings.map(booking => (
                  <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">New Booking Received</div>
                        <div className="text-sm text-slate-500">Dates: {booking.startDate} to {booking.endDate}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">${booking.totalPrice}</div>
                      <div className={`text-xs font-bold uppercase tracking-wider ${booking.status === 'PAID' ? 'text-green-500' : 'text-amber-500'}`}>{booking.status}</div>
                    </div>
                  </div>
                )) : (
                  <div className="p-12 text-center text-slate-400 italic">No bookings yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* Your Cars List */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Your Fleet</h3>
              </div>
              <div className="p-4 space-y-4">
                {ownerCars.map(car => (
                  <div key={car.id} className="group p-3 rounded-xl border border-slate-100 hover:border-indigo-100 transition-all flex items-center gap-4">
                    <img src={car.images[0]} className="w-16 h-12 object-cover rounded-lg" alt="" />
                    <div className="flex-grow">
                      <div className="font-bold text-sm text-slate-900">{car.make} {car.model}</div>
                      <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${
                        car.status === CarStatus.APPROVED ? 'bg-green-100 text-green-700' : 
                        car.status === CarStatus.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {car.status}
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">List Your Car</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">Make</label>
                <input required type="text" className="w-full bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500" value={newCar.make} onChange={e => setNewCar({...newCar, make: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">Model</label>
                <input required type="text" className="w-full bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500" value={newCar.model} onChange={e => setNewCar({...newCar, model: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">Year</label>
                <input required type="number" className="w-full bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500" value={newCar.year} onChange={e => setNewCar({...newCar, year: parseInt(e.target.value)})} />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">Base Price ($/day)</label>
                <input required type="number" className="w-full bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500" value={newCar.basePrice} onChange={e => setNewCar({...newCar, basePrice: parseInt(e.target.value)})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                <input required type="text" placeholder="e.g. San Francisco" className="w-full bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500" value={newCar.location} onChange={e => setNewCar({...newCar, location: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea required rows={3} className="w-full bg-slate-50 border-slate-200 rounded-xl focus:ring-indigo-500" value={newCar.description} onChange={e => setNewCar({...newCar, description: e.target.value})} />
              </div>
              <div className="col-span-2">
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  Submit Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
