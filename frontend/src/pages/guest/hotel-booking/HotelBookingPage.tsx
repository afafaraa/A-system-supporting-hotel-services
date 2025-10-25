import {
    Typography,
    Grid,
    useTheme,
} from '@mui/material';
import { SectionWrapper } from '../../../theme/styled-components/SectionWrapper.ts';
import RoomCard from './RoomCard.tsx';
import { useEffect, useState } from 'react';
import axiosApi, { axiosAuthApi } from '../../../middleware/axiosApi.ts';
import { ReservationGuest, Room } from '../../../types/room.ts';
import ReservationDialog from './ReservationDialog.tsx';
import { useTranslation } from 'react-i18next';
import {useLocation} from "react-router-dom";

type LocationState = { selectedRoom?: Room };

export default function HotelBookingPage() {
    const navState = useLocation().state as LocationState | undefined;
    const selectedRoomFromNav = (navState)?.selectedRoom ?? null;
    const theme = useTheme();
    const { t } = useTranslation();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [reservations, setReservations] = useState<ReservationGuest[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingReservations, setLoadingReservations] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(selectedRoomFromNav);

    useEffect(() => {
        axiosApi.get('/rooms')
            .then(res => setRooms(res.data))
            .finally(() => setLoading(false));

        axiosAuthApi.get('/reservations/mine')
            .then(res => setReservations(res.data))
            .finally(() => setLoadingReservations(false));
    }, []);

    return (
        <main>
            <SectionWrapper sx={{ borderRadius: 3, padding: 3 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '20px' }}>
                    {t('pages.reservations.myReservations')}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {t('pages.reservations.myReservationsSubtitle')}
                </Typography>

                {loadingReservations ? (
                    <Typography>{t('pages.reservations.loading')}</Typography>
                ) : reservations.length > 0 ? (
                    reservations.map((reservation) => (
                        <div
                            key={reservation.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderRadius: '7px',
                                border: `1px solid ${theme.palette.divider}`,
                                padding: '15px 20px',
                                alignItems: 'center',
                                marginBottom: '10px',
                            }}
                        >
                            <div>
                                <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
                                    Room {reservation.room.standard} - Number {reservation.room.number}
                                </Typography>
                                <Typography fontSize="12px" color="text.secondary">
                                    {new Date(reservation.checkIn).toLocaleDateString()} – {new Date(reservation.checkOut).toLocaleDateString()}
                                </Typography>
                                <Typography fontSize="12px" color="text.secondary">
                                    {t('pages.reservations.reservationDetails', { count: reservation.guestCount, price: reservation.reservationPrice })}
                                </Typography>
                            </div>

                            <Typography
                                variant="caption"
                                sx={{
                                    backgroundColor: `${theme.palette.primary.main}`,
                                    color: `${theme.palette.primary.contrastText}`,
                                    fontWeight: 500,
                                    padding: '4px 12px',
                                    borderRadius: '8px',
                                }}
                            >
                                {t(`pages.reservations.status.${reservation.status}`)}
                            </Typography>
                        </div>
                    ))
                ) : (
                    <Typography color="text.secondary">{t('pages.reservations.noBookings')}</Typography>
                )}
            </SectionWrapper>

            <SectionWrapper sx={{ borderRadius: 3, padding: 3, mt: 3 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '20px' }}>
                    {t('pages.reservations.reserveRoom')}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    {t('pages.reservations.reserveRoomSubtitle')}
                </Typography>

                <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3 }}>
                    {loading ? (
                        <Typography>{t('pages.reservations.loadingRooms')}</Typography>
                    ) : (
                        rooms.map((room, index) => (
                            <Grid size={1} key={index}>
                                <RoomCard room={room} onReserve={() => setSelectedRoom(room)} size="small"/>
                            </Grid>
                        ))
                    )}
                </Grid>
            </SectionWrapper>

            <ReservationDialog
                onClose={() => setSelectedRoom(null)}
                room={selectedRoom}
            />
        </main>
    );
}
