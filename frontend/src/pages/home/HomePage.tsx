import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/userSlice.ts';
import { useNavigate } from 'react-router-dom';
import navigateToDashboard from '../../utils/navigateToDashboard.ts';
import { useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  useTheme,
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
} from '@mui/material';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import TvIcon from '@mui/icons-material/Tv';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SpaIcon from '@mui/icons-material/Spa';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import RoomServiceIcon from '@mui/icons-material/RoomService';

const roomOptions = [
  {
    title: 'Standard Room',
    price: 120,
    description: 'Comfortable room with essential amenities',
    guests: 2,
    amenities: [
      { icon: <RssFeedIcon />, label: 'Free Wi-Fi' },
      { icon: <AcUnitIcon />, label: 'Air Conditioning' },
      { icon: <TvIcon />, label: 'Cable TV' },
      { icon: <RestaurantIcon />, label: 'Mini Fridge' },
    ],
  },
  {
    title: 'Deluxe Room',
    price: 180,
    description: 'Spacious room with premium amenities and city view',
    guests: 3,
    amenities: [
      { icon: <RssFeedIcon />, label: 'Free Wi-Fi' },
      { icon: <AcUnitIcon />, label: 'Air Conditioning' },
      { icon: <TvIcon />, label: 'Smart TV' },
      { icon: <LocalBarIcon />, label: 'Mini Bar' },
      { label: '+2 more' },
    ],
  },
  {
    title: 'Executive Suite',
    price: 350,
    description:
      'Luxurious suite with separate living area and premium services',
    guests: 4,
    amenities: [
      { icon: <RssFeedIcon />, label: 'Free Wi-Fi' },
      { icon: <AcUnitIcon />, label: 'Air Conditioning' },
      { icon: <TvIcon />, label: 'Smart TV' },
      { icon: <LocalBarIcon />, label: 'Full Bar' },
      { label: '+4 more' },
    ],
  },
];

function HomePage() {
  const user = useSelector(selectUser);
  const navigation = useNavigate();
  navigateToDashboard(user?.role ?? "", navigation);
  return null;
}

export default HomePage;
