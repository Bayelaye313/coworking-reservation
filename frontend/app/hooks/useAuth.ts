import { useState, useEffect } from 'react';

interface User {
    _id: string;
    email: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Vérifier le token au chargement
        const token = localStorage.getItem('token');
        if (token) {
            // TODO: Valider le token avec le backend
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    setUser(JSON.parse(userStr));
                } catch {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Identifiants invalides');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        } catch (error) {
            throw new Error('Erreur lors de la connexion');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };
} 