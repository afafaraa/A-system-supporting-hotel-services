import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {
  Box, Typography,
  Card
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import {Notification, NotificationVariant} from "../../types/notification.ts";
import {formatDateFromTimestamp, formatTimeFromTimestamp} from "../../utils/dateFormatting.ts";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import SectionTitle from "./SectionTitle.tsx";

function NotificationsContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.notifications.${key}`);

  useEffect(() => {
    axiosAuthApi.get<Notification[]>('/user/notifications')
      .then(res => {
        setNotifications(res.data
          .filter(n => !n.isRead)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      })
      .catch(err => {
        console.log("Error:", err);
      });
  }, []);

  return (
    <SectionCard size={3}>
      <SectionTitle title={<><NotificationsOutlinedIcon /> {tc("title")}</>}
                    subtitle={<>{notifications.length} {tc("unread")}</>}
                    mb={notifications.length === 0 ? 0 : 3} />
      {notifications.length !== 0 && notifications.map(n => {
        const { icon: Icon, color } = NotificationVariant[n.variant];
        return (
          <Card key={n.id} variant="outlined" sx={{color: "text.primary",
            mt: 2, p: 2, borderRadius: "inherit", display: "flex", flexDirection: "column"}}>
              <Box display="flex" alignItems="center" gap={1}>
                <Icon sx={{fontSize: "1.3rem"}} color={color} />
                <Typography fontSize="1.1rem" noWrap textOverflow="ellipsis" overflow="hidden">{n.title}</Typography>
              </Box>
              <Typography fontSize="0.8rem">{n.message}</Typography>
              <Typography fontSize="0.8rem" mt={1} color="text.secondary">
                {formatDateFromTimestamp(n.timestamp)}, {formatTimeFromTimestamp(n.timestamp)}
              </Typography>
          </Card>
        )
      })}
    </SectionCard>
  )
}

export default NotificationsContainer;
