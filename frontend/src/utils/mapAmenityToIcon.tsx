import RssFeedIcon from '@mui/icons-material/RssFeed';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import TvIcon from '@mui/icons-material/Tv';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export function mapAmenityToIcon(key: string, fontSize?: string) {
  const iconStyle = {fontSize: fontSize ?? '12px'};
  switch (key) {
    case 'wifi':
      return <RssFeedIcon sx={iconStyle} />;
    case 'ac':
      return <AcUnitIcon sx={iconStyle}/>;
    case 'tv':
      return <TvIcon sx={iconStyle}/>;
    case 'miniFridge':
      return <RestaurantIcon sx={iconStyle}/>;
    case 'miniBar':
      return <LocalBarIcon sx={iconStyle}/>;
    default:
      return (<span></span>);
  }
}