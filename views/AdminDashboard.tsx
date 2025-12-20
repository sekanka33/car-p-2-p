
import React, { useState } from 'react';
import { db } from '../lib/mockDatabase';
import { CarStatus, UserRole, GlobalPriceRules } from '../types';
import { useApp } from '../App';

const AdminDashboard: React.FC = () => {
  const { user, setView } = useApp();
  const cars = db.getCars();
  const bookings = db.getBookings();
  const transactions = db.getTransactions();
  const [rules, setRules] = useState<GlobalPriceRules>(db.getRules());
  const [activeTab, setActiveTab] = useState<'listings' | 'pricing' | 'payouts'>('listings');

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-slate-500 mb-6">Administrator privileges required.</p>
        <button onClick={() => setView('HOME')} className="bg-slate-900 text-white px-6 py-2 rounded-lg">Go Home</button>
      </div>
    );
  }

  const handleStatusUpdate = (carId: string, status: CarStatus) => {
    db.updateCarStatus(carId, status);
    // Trigger refresh in real app would be refetching
    window.location.reload();
  };

  const handleUpdateRules = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateRules(rules);
    alert('Rules updated successfully!');
  };

  const handlePayout = (txId: string) => {
    db.updatePayoutStatus(txId, 'paid');
    window.location.reload();
  };

  const platformStats = {
    totalRevenue: transactions.reduce((acc, t) => acc + t.amount, 0),
    pendingApprovals: cars.filter(c => c.status === CarStatus.PENDING).length,
    activeRenters: new Set(bookings.map(b => b.renterId)).size,
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900">Admin Control Panel</h1>
          <p className="text-slate-500 font-medium">Platform overview and management</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase">Total Volume</div>
              <div className="text-2xl font-black text-slate-900">R{platformStats.totalRevenue.toLocaleString()}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase">Approvals Needed</div>
              <div className="text-2xl font-black text-slate-900">{platformStats.pendingApprovals}</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase">Active Renters</div>
              <div className="text-2xl font-black text-slate-900">{platformStats.activeRenters}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-8">
          <button onClick={() => setActiveTab('listings')} className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'listings' ? 'text-indigo-600' : 'text-slate-400'}`}>
            Listings Pending Approval
            {activeTab === 'listings' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </button>
          <button onClick={() => setActiveTab('pricing')} className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'pricing' ? 'text-indigo-600' : 'text-slate-400'}`}>
            Global Price Rules
            {activeTab === 'pricing' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </button>
          <button onClick={() => setActiveTab('payouts')} className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'payouts' ? 'text-indigo-600' : 'text-slate-400'}`}>
            Pending Payouts
            {activeTab === 'payouts' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === 'listings' && (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Car</th>
                    <th className="px-6 py-4">Owner</th>
                    <th className="px-6 py-4">Price/Day</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cars.filter(c => c.status === CarStatus.PENDING).map(car => (
                    <tr key={car.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={car.images[0]} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-slate-900">{car.make} {car.model}</div>
                            <div className="text-xs text-slate-500">{car.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{db.getUsers().find(u => u.id === car.ownerId)?.name}</td>
                      <td className="px-6 py-4 font-bold">R{car.basePrice}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{car.location}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(car.id, CarStatus.APPROVED)}
                            className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition-colors shadow-sm shadow-green-100"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(car.id, CarStatus.REJECTED)}
                            className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {cars.filter(c => c.status === CarStatus.PENDING).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-slate-400 font-medium">No pending listings at the moment.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="max-w-xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Market Rules Configuration</h3>
              <form onSubmit={handleUpdateRules} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Weekend Multiplier (Fri-Sun)</label>
                  <input 
                    type="number" step="0.1" 
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                    value={rules.weekendMultiplier}
                    onChange={e => setRules({...rules, weekendMultiplier: parseFloat(e.target.value)})}
                  />
                  <p className="text-xs text-slate-400 mt-2">Example: 1.2 adds 20% to weekend bookings.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Seasonal Multiplier (Peak Times)</label>
                  <input 
                    type="number" step="0.1" 
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                    value={rules.seasonalMultiplier}
                    onChange={e => setRules({...rules, seasonalMultiplier: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Standard Deposit Fee (R)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                    value={rules.depositFee}
                    onChange={e => setRules({...rules, depositFee: parseInt(e.target.value)})}
                  />
                  <p className="text-xs text-slate-400 mt-2">Held during the trip and returned after completion.</p>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                  Apply New Rules
                </button>
              </form>
            </div>
          )}

          {activeTab === 'payouts' && (
             <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Owner Account</th>
                    <th className="px-6 py-4">Host Share (80%)</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.filter(t => t.payoutStatus === 'pending').map(tx => {
                    const booking = bookings.find(b => b.id === tx.bookingId);
                    const car = cars.find(c => c.id === booking?.carId);
                    const owner = db.getUsers().find(u => u.id === car?.ownerId);
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{tx.id}</td>
                        <td className="px-6 py-4 font-medium">{owner?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 font-bold text-green-600">R{(tx.amount * 0.8).toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider">Pending</span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handlePayout(tx.id)}
                            className="text-indigo-600 font-bold hover:underline text-sm"
                          >
                            Release Funds
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {transactions.filter(t => t.payoutStatus === 'pending').length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-slate-400 font-medium">All payouts up to date.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;