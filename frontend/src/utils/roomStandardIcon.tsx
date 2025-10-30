import SingleBedOutlinedIcon from '@mui/icons-material/SingleBedOutlined';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import HotelClassOutlinedIcon from '@mui/icons-material/HotelClassOutlined';
import DoorFrontOutlinedIcon from '@mui/icons-material/DoorFrontOutlined';
import {RoomStandard} from "../types/room.ts";

type MuiIcon = typeof SingleBedOutlinedIcon;

const roomStandardToIconMap: Record<RoomStandard['name'], MuiIcon> = {
  "Budget": SingleBedOutlinedIcon,
  "Standard": BedOutlinedIcon,
  "Deluxe": BusinessCenterOutlinedIcon,
  "Exclusive Suite": HotelClassOutlinedIcon,
}

const roomStandardIcon = (standard: RoomStandard): MuiIcon => {
  return roomStandardToIconMap[standard.name] ?? DoorFrontOutlinedIcon;
}

export default roomStandardIcon;
