
import React from 'react';
import { useApp } from '../App';
import { db } from '../lib/mockDatabase';

const Login: React.FC = () => {
  const { setUser, setView } = useApp();
  const users = db.getUsers();

  const handleLogin = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setUser(user);
      setView('HOME');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl shadow-slate-200">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
            <span className="text-white text-3xl font-black">D</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-500">Pick a role to explore the platform functionality.</p>
        </div>

        <div className="space-y-4">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => handleLogin(user.id)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-slate-100">
                <img src={user.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 group-hover:text-indigo-900">{user.name}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{user.role} Account</div>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-400">
            Need an account? <span className="text-indigo-600 font-bold cursor-pointer hover:underline">Contact sales</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
