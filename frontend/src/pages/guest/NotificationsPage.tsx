import {ChangeEvent, useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {
  Box, Checkbox, IconButton, Stack, Typography,
  List, Tooltip, Alert, Divider, ListSubheader, CircularProgress
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PageContainer from "../../components/layout/PageContainer.tsx";
import { useTranslation } from 'react-i18next';

interface Notification {
  id: string,
  title: string
  message: string,
  timestamp: string,
  isRead: boolean,
}

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

  const getDay = (timestamp: string): string => {
    const date = new Date(timestamp);
    const shortWeekdays = t("date.shortWeekdays", { returnObjects: true }) as string[];
    const dayOfWeek = shortWeekdays[(date.getDay() + 6) % 7]; // Adjust for Monday as first day of week
    const dateStr = date.toLocaleDateString(t('date.locale'), {day: 'numeric', month: 'long'});
    const sep = t('date.separator');
    return `${dayOfWeek}${sep} ${dateStr}`
  }

  const getTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString(t('date.locale'), {hour: '2-digit', minute: '2-digit'});
    return time.replace(/\s?AM/i, ' am').replace(/\s?PM/i, ' pm');
  }

  const getCardColor = (id: string, isRead: boolean): string => {
    if (selected.has(id)) return 'background.primaryLight'
    else return isRead ? 'background.default' : 'background.paper'
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

  return (
    <PageContainer title={tc("title")}>
      {error &&
          <Alert severity="error" sx={{mb: 3, border: '1px solid red'}}>{error}.</Alert>
      }
      <List sx={{boxShadow: 4, borderRadius: 2, overflow: 'hidden'}} disablePadding>
        <ListSubheader sx={{display: 'flex', p: 0.5,
          backgroundColor: 'background.default', alignItems: 'center', '& svg': {m: 1,}}}>
          <Tooltip title={tc("tooltip.selectAll")} arrow>
            <Checkbox checked={selected.size === notifications.length}
                      indeterminate={selected.size > 0 && selected.size < notifications.length}
                      onChange={handleAllToggle}
            />
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{mx: 1}}/>
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
        </ListSubheader>
        { isLoading ?
          <>
            <Divider key={`divider_loading`} component="li"/>
            <Box sx={{p: 4, backgroundColor: "background.paper"}} textAlign="center"><CircularProgress /></Box>
          </>
          :
          <>
          {notifications.length === 0 ?
            <>
              <Divider key={`divider_empty`} component="li"/>
              <Box sx={{p: 4, backgroundColor: "background.paper"}}>
                <Typography variant="body1" align="center">{tc("empty")}</Typography>
              </Box>
            </>
            :
            <>
              {notifications.map((n) => ([
                <Divider key={`divider_${n.id}`} component="li"/>,
                <ListItem key={n.id} sx={{
                  backgroundColor: getCardColor(n.id, n.isRead),
                  color: n.isRead ? 'text.disabled' : 'text.primary'
                }} disablePadding>
                  <ListItemButton onClick={handleToggle(n.id)} sx={{px: 3, py: 1.5}} disableRipple>
                    <ListItemIcon>
                      <Checkbox edge="start" checked={selected.has(n.id)} tabIndex={-1} disableRipple/>
                    </ListItemIcon>
                    <ListItemText disableTypography
                                  primary={
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                                      <Stack direction="column">
                                        <Typography variant="h6"
                                                    fontWeight={n.isRead ? 'normal' : 'bold'}>{n.title}</Typography>
                                        <Typography variant="body2"
                                                    fontWeight={n.isRead ? 'normal' : 'bold'}>{n.message}</Typography>
                                      </Stack>
                                      <Stack direction="column" alignItems='flex-end' sx={{textAlign: 'right', minWidth: 'fit-content'}}>
                                        <Typography variant="body2" color="text.secondary">{getDay(n.timestamp)}</Typography>
                                        <Typography variant="body1" color="text.primary">{getTime(n.timestamp)}</Typography>
                                      </Stack>
                                    </Stack>
                                  }/>
                  </ListItemButton>
                </ListItem>
              ]))}
            </>
          }
          </>
        }
      </List>
    </PageContainer>
  )
}

export default NotificationsPage;
