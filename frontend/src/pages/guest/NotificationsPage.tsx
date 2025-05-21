import {ChangeEvent, useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {Box, Checkbox, IconButton, Stack, Typography,
  List, Tooltip, Alert, Divider, ListSubheader} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

interface Notification {
  id: string,
  title: string
  message: string,
  timestamp: string,
  isRead: boolean,
}

function NotificationsPage() {
  const user = useSelector(selectUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    axiosAuthApi.get<Notification[]>('/user/notifications')
      .then(res => {
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
    const shortWeekdays = ['Nd.', 'Pn.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'So.'];
    const dayOfWeek = shortWeekdays[date.getDay()];
    const dateStr = date.toLocaleDateString('pl-PL', {day: 'numeric', month: 'long'});
    return `${dayOfWeek} ${dateStr}`
  }

  const getTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'});
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
    <>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
        <Typography variant="h4">Notifications</Typography>
        <Typography variant="h5">MyHotelAssistant</Typography>
      </Box>
      {error &&
          <Alert severity="error" sx={{mb: 3, border: '1px dashed red'}}>{error}.</Alert>
      }

      <List sx={{boxShadow: 10, borderRadius: 5, overflow: 'hidden'}} disablePadding>
        <ListSubheader sx={{display: 'flex', p: 0.5,
          backgroundColor: 'background.default', alignItems: 'center', '& svg': {m: 1,}}}>
          <Tooltip title="Select all" arrow>
            <Checkbox checked={selected.size === notifications.length}
                      indeterminate={selected.size > 0 && selected.size < notifications.length}
                      onChange={handleAllToggle}
            />
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{mx: 1}}/>
          <Tooltip title="Mark as Read" arrow>
            <span><IconButton aria-label="mark as read" disabled={selected.size === 0} onClick={markAsRead}>
              <MarkEmailReadIcon/>
            </IconButton></span>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <span><IconButton aria-label="delete" color='error' disabled={selected.size === 0} onClick={deleteSelected}>
              <DeleteForeverIcon/>
            </IconButton></span>
          </Tooltip>
        </ListSubheader>
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
      </List>
      {notifications.length === 0 &&
          <Box sx={{p: 4}}>
              <Typography variant="body1" align="center">You don't have any notifications.</Typography>
          </Box>
      }
    </>
  )
}

export default NotificationsPage;
