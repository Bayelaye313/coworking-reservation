'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ReservationData, api } from '../services/api';

interface ReservationFormProps {
    onSuccess?: () => void;
}

export default function ReservationForm({ onSuccess }: ReservationFormProps) {
    const [formData, setFormData] = useState<ReservationData>({
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endTime: '17:00',
        spaceType: 'bureau',
        notes: ''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await api.createReservation(formData);
            setSuccess(true);
            onSuccess?.();
            // Réinitialiser le formulaire
            setFormData({
                date: format(new Date(), 'yyyy-MM-dd'),
                startTime: '09:00',
                endTime: '17:00',
                spaceType: 'bureau',
                notes: ''
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    Réservation créée avec succès !
                </div>
            )}

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                </label>
                <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                        Heure de début
                    </label>
                    <input
                        type="time"
                        id="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                        Heure de fin
                    </label>
                    <input
                        type="time"
                        id="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>
            </div>

            <div>
                <label htmlFor="spaceType" className="block text-sm font-medium text-gray-700">
                    Type d'espace
                </label>
                <select
                    id="spaceType"
                    value={formData.spaceType}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                >
                    <option value="bureau">Bureau individuel</option>
                    <option value="salle_reunion">Salle de réunion</option>
                    <option value="espace_commun">Espace commun</option>
                </select>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes (optionnel)
                </label>
                <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {isLoading ? 'Réservation en cours...' : 'Réserver'}
            </button>
        </form>
    );
} 