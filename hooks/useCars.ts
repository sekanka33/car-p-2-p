import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Car, CarStatus } from '../types';

export function useCars() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCars();
    }, []);

    async function fetchCars() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('cars')
                .select('*')
                .eq('status', 'APPROVED');

            if (error) {
                throw error;
            }

            setCars(data || []);
        } catch (err: any) {
            console.error('Error fetching cars:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { cars, loading, error, refetch: fetchCars };
}
