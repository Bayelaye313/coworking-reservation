'use client';

import { useEffect, useState } from 'react';
import ReservationForm from '@/app/components/ReservationForm';
import ReservationList from '@/app/features/reservations/ReservationList';
import Pagination from '@/app/components/Pagination';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { Reservation, api } from '@/app/services/api';
import LoadingSpinner from '@/app/components/LoadingSpinner';

function ReservationsContent() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReservations = async (page: number) => {
        try {
            setLoading(true);
            const data = await api.getReservations(page);
            setReservations(data.reservations);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des réservations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations(currentPage);
    }, [currentPage]);

    const handleCancel = async (id: string) => {
        try {
            await api.cancelReservation(id);
            fetchReservations(currentPage);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de l\'annulation');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Réservation d'espace</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Nouvelle réservation</h2>
                    <ReservationForm onSuccess={() => fetchReservations(currentPage)} />
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Mes réservations</h2>
                    {loading ? (
                        <LoadingSpinner />
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    ) : (
                        <>
                            <ReservationList
                                reservations={reservations}
                                onCancel={handleCancel}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ReservationsPage() {
    return (

        <ReservationsContent />

    );
} 