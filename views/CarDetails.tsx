
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../App';
import { BookingStatus, Car, GlobalPriceRules } from '../types';

interface Props {
  id: string;
}

const CarDetails: React.FC<Props> = ({ id }) => {
  const { user, setView } = useApp();
  const [car, setCar] = useState<Car | null>(null);
  const [rules, setRules] = useState<GlobalPriceRules>({ weekendMultiplier: 1.2, seasonalMultiplier: 1.1, depositFee: 500 });

  const [dates, setDates] = useState({ start: '', end: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch Car
        const { data: carData } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();

        if (carData) setCar(carData);

        // Fetch Rules
        const { data: rulesData } = await supabase
          .from('global_rules')
          .select('*')
          .single();

        if (rulesData) setRules({
          weekendMultiplier: rulesData.weekend_multiplier,
          seasonalMultiplier: rulesData.seasonal_multiplier,
          depositFee: rulesData.deposit_fee
        });

      } catch (error) {
        console.error("Error fetching car details", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading car details...</div>;
  if (!car) return <div className="p-10 text-center">Car not found</div>;

  const calculateTotal = () => {
    if (!dates.start || !dates.end) return 0;
    const start = new Date(dates.start);
    const end = new Date(dates.end);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Simplistic pricing: base * days + deposit
    return car.basePrice * diffDays + rules.depositFee;
  };

  const handleBook = async () => {
    if (!user) {
      setView('LOGIN');
      return;
    }

    setIsBooking(true);

    try {
      const total = calculateTotal();

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          renter_id: user.id,
          car_id: car.id,
          start_date: new Date(dates.start).toISOString(),
          end_date: new Date(dates.end).toISOString(),
          total_price: total,
          status: BookingStatus.PAID // In real app, this would be PENDING until payment
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert({
          booking_id: booking.id,
          amount: total,
          payment_status: 'success',
          payout_status: 'pending'
        });

      if (txError) throw txError;

      setView('SUCCESS');
    } catch (error: any) {
      alert('Booking failed: ' + error.message);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] md:h-[500px] overflow-hidden">
        <div className="h-full">
          <img src={car.images[0]} className="w-full h-full object-cover" alt="Car Main" />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-2 h-full">
          <img src={car.images[1] || car.images[0]} className="w-full h-full object-cover" alt="Car Detail 1" />
          <img src={car.images[0]} className="w-full h-full object-cover" alt="Car Detail 2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Left: Info */}
        <div className="flex-grow">
          <div className="mb-8 pb-8 border-b border-slate-200">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{car.make} {car.model} {car.year}</h1>
            <div className="flex items-center gap-4 text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                4.9 (42 reviews)
              </span>
              <span>•</span>
              <span>{car.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Type</div>
              <div className="font-bold text-slate-900">{car.type}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Transmission</div>
              <div className="font-bold text-slate-900">{car.transmission}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Seats</div>
              <div className="font-bold text-slate-900">{car.seats} People</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Fuel</div>
              <div className="font-bold text-slate-900">Electric/Gas</div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Description</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              {car.description}
            </p>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-100">
            <div className="flex items-end gap-1 mb-8">
              <span className="text-3xl font-extrabold text-slate-900">R{car.basePrice}</span>
              <span className="text-slate-500 font-medium mb-1">/ day</span>
            </div>

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 border border-slate-200 rounded-xl">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Trip Start</label>
                  <input
                    type="date"
                    className="w-full border-none p-0 focus:ring-0 text-sm font-bold"
                    value={dates.start}
                    onChange={(e) => setDates(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div className="p-3 border border-slate-200 rounded-xl">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Trip End</label>
                  <input
                    type="date"
                    className="w-full border-none p-0 focus:ring-0 text-sm font-bold"
                    value={dates.end}
                    onChange={(e) => setDates(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>
              <div className="p-3 border border-slate-200 rounded-xl">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pickup & Return</label>
                <div className="text-sm font-bold text-slate-900">{car.location}</div>
              </div>
            </div>

            {dates.start && dates.end && (
              <div className="space-y-3 mb-8 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>R{car.basePrice} x 3 days</span>
                  <span>R{car.basePrice * 3}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Refundable deposit</span>
                  <span>R{rules.depositFee}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-lg pt-2 border-t border-slate-100">
                  <span>Total price</span>
                  <span>R{calculateTotal()}</span>
                </div>
              </div>
            )}

            <button
              disabled={!dates.start || !dates.end || isBooking}
              onClick={handleBook}
              className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${!dates.start || !dates.end
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                }`}
            >
              {isBooking ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </>
              ) : 'Book this drive'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">You won't be charged yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;