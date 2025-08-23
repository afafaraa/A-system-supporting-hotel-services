import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import {OverridableComponent} from "@mui/material/OverridableComponent";
import {SvgIconTypeMap} from "@mui/material";

type IconColorType = "info" | "success" | "warning" | "error" | "primary" | "inherit" | "disabled" | "secondary" | "action" | undefined

type NotificationConfig = {
  color: IconColorType,
  icon: OverridableComponent<SvgIconTypeMap> & { muiName: string }
}

const NotificationVariant: Record<string, NotificationConfig> = {
  NOTICE: { color: 'info', icon: InfoOutlinedIcon },
  CONFIRMATION: { color: 'success', icon: TaskAltIcon },
  ALERT: { color: 'warning', icon: WarningAmberOutlinedIcon },
  FAILURE: { color: 'error', icon: ErrorOutlineOutlinedIcon},
  ADVERTISEMENT: { color: 'primary', icon: CampaignOutlinedIcon},
} as const;

type NotificationVariantKey = keyof typeof NotificationVariant;

export {NotificationVariant, type NotificationVariantKey};
