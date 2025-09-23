import RssFeedIcon from '@mui/icons-material/RssFeed';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import TvIcon from '@mui/icons-material/Tv';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export function mapAmenityToIcon(key: string, fontSize?: string) {
  switch (key) {
    case 'wifi':
      return <RssFeedIcon sx={{fontSize: fontSize ?? '12px'}} />;
    case 'ac':
      return <AcUnitIcon sx={{fontSize: fontSize ?? '12px'}}/>;
    case 'tv':
      return <TvIcon sx={{fontSize: fontSize ?? '12px'}}/>;
    case 'miniFridge':
      return <RestaurantIcon sx={{fontSize: fontSize ?? '12px'}}/>;
    case 'miniBar':
      return <LocalBarIcon sx={{fontSize: fontSize ?? '12px'}}/>;
    default:
      return (<span></span>);
  }
}