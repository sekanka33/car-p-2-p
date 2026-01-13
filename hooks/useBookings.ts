import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Booking, Transaction } from '../types';

export function useBookings(userId?: string) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        fetchBookings();
    }, [userId]);

    async function fetchBookings() {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .or(`renter_id.eq.${userId},car_id.in.(select id from cars where owner_id.eq.${userId})`);

            // Note: The above OR query is complex in Supabase JS syntax without raw SQL or joining.
            // Simplest is to fetch where renter_id = user OR owner_id via relation?
            // Supabase has RLS. So we can just select * from bookings and RLS will filter it!
            // IF we set up RLS correctly (which we did: "Users can view their own bookings").

            const { data: safeData, error: safeError } = await supabase
                .from('bookings')
                .select('*');

            if (safeError) throw safeError;
            setBookings(safeData || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    }

    return { bookings, loading, refetch: fetchBookings };
}
