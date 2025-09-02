import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {
  Box, Stack, Typography,
  Paper, Card
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import {Notification, NotificationVariant} from "../../types/notification.ts";
import {getDay, getTime} from "../../utils/utils.ts";

function NotificationsContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.notifications.${key}`);

  useEffect(() => {
    axiosAuthApi.get<Notification[]>('/user/notifications')
      .then(res => {
        setNotifications(res.data.filter(n => !n.isRead))
      })
      .catch(err => {
        console.log("Error:", err);
      });
  }, []);

  return (
    <Paper variant="outlined" sx={{p: 4, borderRadius: 4}}>
      <Box mb={notifications.length === 0 ? 0 : 2}>
        <Stack direction="row" alignItems="center" fontSize="1.5rem" spacing={0.8}>
          <NotificationsOutlinedIcon fontSize="inherit"/>
          <Typography fontSize="inherit" lineHeight="2rem">
            {tc("title")}
          </Typography>
        </Stack>
        <Typography fontSize="0.8rem" color="text.secondary" mt={0.5}>
          {notifications.length} {tc("unread")}
        </Typography>
      </Box>

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
              <Typography fontSize="0.8rem" mt={1}>
                {getDay(n.timestamp)}, {getTime(n.timestamp)}
              </Typography>
          </Card>
        )
      })}
    </Paper>
  )
}

export default NotificationsContainer;
