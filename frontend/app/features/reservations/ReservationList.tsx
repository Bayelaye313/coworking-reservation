'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Reservation } from '@/app/services/api';

interface ReservationListProps {
    reservations: Reservation[];
    onCancel: (id: string) => void;
}

export default function ReservationList({ reservations, onCancel }: ReservationListProps) {
    return (
        <div className="space-y-4">
            {reservations.map((reservation) => (
                <div
                    key={reservation._id}
                    className={`p-4 rounded-lg border ${reservation.status === 'cancelled'
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-white border-gray-200'
                        }`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium">
                                {format(new Date(reservation.date), 'dd MMMM yyyy', { locale: fr })}
                            </p>
                            <p className="text-sm text-gray-600">
                                {reservation.startTime} - {reservation.endTime}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">
                                {reservation.spaceType.replace('_', ' ')}
                            </p>
                            {reservation.notes && (
                                <p className="text-sm text-gray-600 mt-2">{reservation.notes}</p>
                            )}
                        </div>
                        <div>
                            {reservation.status === 'active' && (
                                <button
                                    onClick={() => onCancel(reservation._id)}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    Annuler
                                </button>
                            )}
                            {reservation.status === 'cancelled' && (
                                <span className="text-sm text-gray-500">Annulée</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 