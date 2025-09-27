import {ReactNode} from "react";
import Box from "@mui/system/Box";
import AirportShuttleOutlinedIcon from "@mui/icons-material/AirportShuttleOutlined";

function ServiceIcon({children, mb, icon=AirportShuttleOutlinedIcon}: {children: ReactNode, icon?: typeof AirportShuttleOutlinedIcon, mb?: number | string}) {
  const Icon = icon;
  return (
    <Box mb={mb} display="flex" flexDirection="row" alignItems="center" gap={{xs: 1.5, sm: 3}}>
      <Box bgcolor="primary.medium" p={1} borderRadius={1} display="flex" alignItems="center" justifyContent="center">
        <Icon color="primary" fontSize="large" /> {/* TODO: replace with icon from service */}
      </Box>
      <div style={{textAlign: "left"}}>
        {children}
      </div>
    </Box>
  );
}

export default ServiceIcon;
