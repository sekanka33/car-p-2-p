import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User as AppUser, UserRole } from '../types';

export function useAuth() {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user.id, session.user.email!);
            } else {
                setLoading(false);
            }
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user) {
                    fetchProfile(session.user.id, session.user.email!);
                } else {
                    setUser(null);
                    setLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    async function fetchProfile(userId: string, email: string) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                // If profile doesn't exist, we might want to create one or handle it
                console.error('Error fetching profile:', error);
            }

            if (data) {
                setUser({
                    id: data.id,
                    name: data.full_name || email.split('@')[0],
                    email: data.email || email,
                    role: (data.role as UserRole) || UserRole.RENTER,
                    avatar: data.avatar_url,
                });
            }
        } catch (error) {
            console.error('Error in fetchProfile:', error);
        } finally {
            setLoading(false);
        }
    }

    return { user, loading };
}
