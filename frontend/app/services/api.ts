const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ReservationData {
    date: string;
    startTime: string;
    endTime: string;
    spaceType: 'bureau' | 'salle_reunion' | 'espace_commun';
    notes?: string;
}

export interface Reservation extends ReservationData {
    _id: string;
    //userId: string;
    status: 'active' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

interface ApiError extends Error {
    status?: number;
}

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error: ApiError = new Error('Une erreur est survenue');
        error.status = response.status;

        try {
            const data = await response.json();
            error.message = data.message || error.message;
        } catch {
            // Si la réponse n'est pas du JSON, on garde le message par défaut
        }

        throw error;
    }
    return response.json();
};

export const api = {
    async getReservations(page = 1, limit = 10) {
        try {
            const response = await fetch(
                `${API_URL}/reservations?page=${page}&limit=${limit}`,
                {
                    headers: getAuthHeaders(),
                }
            );
            return handleResponse(response);
        } catch (error) {
            throw new Error('Erreur lors de la récupération des réservations');
        }
    },

    async createReservation(data: ReservationData) {
        try {
            const response = await fetch(`${API_URL}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erreur lors de la création de la réservation');
        }
    },

    async updateReservation(id: string, data: Partial<ReservationData>) {
        try {
            const response = await fetch(`${API_URL}/reservations/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data),
            });
            return handleResponse(response);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erreur lors de la mise à jour de la réservation');
        }
    },

    async cancelReservation(id: string) {
        try {
            const response = await fetch(`${API_URL}/reservations/${id}/cancel`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
            });
            return handleResponse(response);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erreur lors de l\'annulation de la réservation');
        }
    },
}; 