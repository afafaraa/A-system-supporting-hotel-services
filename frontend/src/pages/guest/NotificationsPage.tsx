import {ChangeEvent, useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {
  Box, Checkbox, IconButton, Stack, Typography,
  Tooltip, Alert, Divider, CircularProgress, Paper, Card
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useTranslation } from 'react-i18next';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import {Notification, NotificationVariant} from "../../types/notification.ts";
import {getDay, getTime} from "../../utils/utils.ts";

function NotificationsPage() {
  const [isLoading, setLoading] = useState<boolean>(true)
  const user = useSelector(selectUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.notifications.${key}`);

  useEffect(() => {
    if (!user) return;
    axiosAuthApi.get<Notification[]>('/user/notifications')
      .then(res => {
        setLoading(false)
        setNotifications(res.data)
        console.log("Response:", res);
      })
      .catch(err => {
        setError(err.message);
        console.log("Error:", err);
      });
  }, [user]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 20_000);
      return () => clearTimeout(timer);
    }
  }, [error]);


  function markAsRead() {
    const selectedUnread = notifications.filter(n => selected.has(n.id) && !n.isRead)
      .map(n => n.id);
    if (selectedUnread.length === 0) {
      setSelected(new Set());
      return;
    }
    axiosAuthApi.patch('/user/notifications/mark-read', selectedUnread)
      .then(() => {
        setNotifications(prev => prev.map(n =>
          selected.has(n.id) ? {...n, isRead: true} : n
        ));
        setSelected(new Set());
      })
      .catch(err => {
        setError(err.message);
        console.log("Error:", err);
      });
  }

  function deleteSelected() {
    axiosAuthApi.delete('/user/notifications', {data: Array.from(selected)})
      .then(() => {
        setNotifications(prev => prev.filter(n =>
          !selected.has(n.id)
        ))
        setSelected(new Set());
      })
      .catch(err => {
        setError(err.message);
        console.log("Error:", err);
      });
  }

  const handleToggle = (id: string) => () => {
    if (!selected.has(id)) setSelected(new Set([...selected, id]));
    else setSelected(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
  }

  const handleAllToggle = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected(new Set(notifications.map((n) => n.id)));
    else setSelected(new Set());
  }

  const countUnread = notifications.reduce((count, n) => n.isRead ? count : count + 1, 0);

  return (
    <Paper variant="outlined" sx={{px: {xs: 2, sm: 5}, py: {xs: 3, sm: 5}, borderRadius: 5}}>
      <Box mb={3}>
        <Stack direction="row" alignItems="center" fontSize="1.8rem" spacing={1}>
          <NotificationsOutlinedIcon fontSize="inherit"/>
          <Typography fontSize="inherit" lineHeight="2rem">
            {tc("title")}
          </Typography>
        </Stack>
        {countUnread !== 0 &&
          <Typography color="text.secondary" mt={1}>
            {countUnread} {tc("unread")}
          </Typography>
        }
      </Box>

      {error && <Alert severity="error" sx={{mb: 3}}>{error}</Alert>}

      <Card variant="outlined" sx={{display: "flex", p: 2, gap: 2, borderRadius: "inherit", backgroundColor: "primary.medium"}}>
        <Tooltip title={tc("tooltip.selectAll")} arrow>
          <Checkbox checked={selected.size === notifications.length}
                    indeterminate={selected.size > 0 && selected.size < notifications.length}
                    onChange={handleAllToggle}
          />
        </Tooltip>
        <Divider orientation="vertical" flexItem />
        <Tooltip title={tc("tooltip.markAsRead")} arrow>
          <span><IconButton aria-label="mark as read" disabled={selected.size === 0} onClick={markAsRead}>
            <MarkEmailReadIcon/>
          </IconButton></span>
        </Tooltip>
        <Tooltip title={tc("tooltip.delete")} arrow>
          <span><IconButton aria-label="delete" color='error' disabled={selected.size === 0} onClick={deleteSelected}>
            <DeleteForeverIcon/>
          </IconButton></span>
        </Tooltip>
      </Card>

      {isLoading ?
        <Box textAlign="center" mt={4}><CircularProgress /></Box>
        :
        notifications.length === 0 ?
          <Typography align="center" mt={4}>{tc("empty")}</Typography>
          :
          notifications.map(n => {
            const { icon: Icon, color } = NotificationVariant[n.variant];
            return (
              <Card key={n.id} variant="outlined" onClick={handleToggle(n.id)}
                    sx={{mt: 2, p: 2, borderRadius: "inherit", color: n.isRead ? "text.disabled" : "text.primary", display: "flex",
                      backgroundColor: selected.has(n.id) ? "primary.light" : "inherit", cursor: "pointer"}}>
                <Checkbox edge="start" checked={selected.has(n.id)} tabIndex={-1} disableRipple sx={{px: 2.5, display: {xs: "none", sm: "inherit"}}}/>
                <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                  <Stack direction="column">
                    <Typography fontSize="1.1rem" sx={{display: "flex", alignItems: "center", gap: 1}}>
                      <Icon sx={{fontSize: "1.3rem"}} color={n.isRead ? "inherit" : color} />
                      {n.title}
                    </Typography>
                    <Typography fontSize="0.8rem">{n.message}</Typography>
                    <Typography fontSize="0.8rem" display={{xs: "inherit", sm: "none"}} mt={1}>
                      {getDay(n.timestamp)}, {getTime(n.timestamp)}
                    </Typography>
                  </Stack>
                  <Stack display={{xs: "none", sm: "inherit"}} direction="column" alignItems='flex-end' sx={{textAlign: 'right', minWidth: 'fit-content'}}>
                    <Typography variant="body2">{getDay(n.timestamp)}</Typography>
                    <Typography variant="body1">{getTime(n.timestamp)}</Typography>
                  </Stack>
                </Stack>
              </Card>
            )
          })
      }
    </Paper>
  )
}

export default NotificationsPage;
