import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {Box, Checkbox, IconButton, Stack, Typography, List, Tooltip, Alert, Card} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

interface Notification {
  id: string,
  title: string
  message: string,
  timestamp: string,
  isRead: boolean,
}

function NotificationsPage(){
  const user = useSelector(selectUser);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setError("User not logged in");
      return;
    }
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

  function markAsRead() {
    const selectedUnread = notifications.filter(n => selected.has(n.id) && !n.isRead)
      .map(n => n.id);
    if (selectedUnread.length === 0) { setSelected(new Set()); return; }
    axiosAuthApi.patch('/user/notifications/mark-read', selectedUnread)
      .then(() => {
        setNotifications(prev => prev.map(n =>
          selected.has(n.id) ? { ...n, isRead: true } : n
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

  return (
    <Box component="section" sx={{ p: 4, width: '70%', margin: '0 auto', boxShadow: 3, borderRadius: 2, mt: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>Notifications</Typography>
      {error &&
          <Alert severity="error" sx={{ mb: 1 }}>{error}.</Alert>
      }
      <Card sx={{ p: 1, paddingLeft: 1.3, backgroundColor: 'background.default' }}>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Select all" arrow>
            <Checkbox checked={selected.size === notifications.length}
                      indeterminate={selected.size > 0 && selected.size < notifications.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelected(new Set(notifications.map((n) => n.id)));
                        else setSelected(new Set());
                      }}
            />
          </Tooltip>
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
        </Stack>
      </Card>
      <List>
        {notifications.map((n) => (
          <Card key={n.id} sx={{ p: 2, paddingLeft: 0.8, mb: 1, backgroundColor: getCardColor(n.id, n.isRead),
            color: n.isRead ? 'text.disabled' : 'text.primary', borderRadius: '10px' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Checkbox color='primary' checked={selected.has(n.id)} onChange={(e) => {
                if (e.target.checked) setSelected(new Set([...selected, n.id]));
                else setSelected(prev => {
                  const newSelected = new Set(prev);
                  newSelected.delete(n.id);
                  return newSelected;
                });
              }} sx={{ height: '50px', width: '50px', borderRadius: '10px' }}/>
              <Stack direction="column" sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={n.isRead ? 'normal' : 'bold'}>{n.title}</Typography>
                <Typography variant="body2" fontWeight={n.isRead ? 'normal' : 'bold'}>{n.message}</Typography>
              </Stack>
              <Stack direction="column" sx={{ alignItems: 'flex-end' }}>
                <Typography variant="body2" color="text.secondary">{getDay(n.timestamp)}</Typography>
                <Typography variant="body1" color="text.primary">{getTime(n.timestamp)}</Typography>
              </Stack>

            </Stack>
          </Card>
        ))}
      </List>
      {notifications.length === 0 &&
          <Box sx={{ p: 2, paddingLeft: 0.8, mb: 1 }}>
              <Typography variant="body1" align="center">You don't have any notifications.</Typography>
          </Box>
      }
    </Box>
  )
}

export default NotificationsPage;
