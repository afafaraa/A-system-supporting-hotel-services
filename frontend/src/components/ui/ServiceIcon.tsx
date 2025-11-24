import {ReactNode, useState} from "react";
import Box from "@mui/system/Box";
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';

interface Props {
  children?: ReactNode,
  icon?: typeof RoomServiceOutlinedIcon
  imageUrl?: string,
  imageAlt?: string,
  mb?: number | string
}

function ServiceIcon({children, icon = RoomServiceOutlinedIcon, imageUrl, imageAlt, mb = 0}: Props) {
  const Icon = icon;
  const [imgError, setImgError] = useState(false);
  return (
    <Box mb={mb} display="flex" flexDirection="row" alignItems="center" gap={{xs: 1.5, sm: 3}}>
      {!imgError && imageUrl ?
        <img src={imageUrl} alt={imageAlt}
             style={{width: 60, height: 60, objectFit: "cover", borderRadius: 10, flexShrink: 0}}
             onError={() => setImgError(true)}
        />
        :
        <Icon color="primary"
              sx={{padding: 1, bgcolor: "primary.medium", width: 60, height: 60, borderRadius: "10px"}}
        />
      }
      <div style={{textAlign: "left"}}>
        {children}
      </div>
    </Box>
  );
}

export default ServiceIcon;
