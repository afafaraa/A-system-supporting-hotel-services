import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {Box, Checkbox, IconButton, Stack, Typography, List, Tooltip} from "@mui/material";
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
    axiosAuthApi.get<Notification[]>(`/user/notifications?username=${user.username}`)
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
    setNotifications(prev => prev.map(n =>
      selected.has(n.id) ? { ...n, isRead: true } : n
    ));
    setSelected(new Set());
  }

  function deleteSelected() {
    setNotifications(prev => prev.filter(n =>
      !selected.has(n.id)
    ))
    setSelected(new Set());
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
    const timeStr = date.toLocaleTimeString('pl-PL', {hour: '2-digit', minute: '2-digit'});
    return timeStr;
  }

  const getCardColor = (id: string, isRead: boolean): string => {
    if (selected.has(id)) return 'background.main'
    else return isRead ? 'background.default' : 'background.paper'
  }

  return (
    <Box component="section" sx={{ p: 2, width: '70%', margin: '0 auto' }}>
      <Typography variant="h4" align="center" sx={{ mb: 2 }}>Notifications</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box backgroundColor='background.main' sx={{ p: 1, paddingLeft: 1.3, border: '1px solid grey' }}>
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
            <span><IconButton aria-label="delete" color='warning' disabled={selected.size === 0} onClick={deleteSelected}>
              <DeleteForeverIcon/>
            </IconButton></span>
          </Tooltip>
        </Stack>
      </Box>
      <List>
        {notifications.map((n) => (
          <Box backgroundColor={getCardColor(n.id, n.isRead)} key={n.id} sx={{ p: 2, paddingLeft: 0.8, border: '1px solid grey', mb: 1,
          color: n.isRead ? 'text.ternary' : 'text.primary' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Checkbox color='primary' checked={selected.has(n.id)} onChange={(e) => {
                if (e.target.checked) setSelected(new Set([...selected, n.id]));
                else setSelected(prev => {
                  const newSelected = new Set(prev);
                  newSelected.delete(n.id);
                  return newSelected;
                });
              }} sx={{ height: '50px', width: '50px', borderRadius: '10px'}}/>
              <Stack direction="column" sx={{ flex: 1 }}>
                <Typography variant="h6">{n.title}</Typography>
                <Typography variant="body2">{n.message}</Typography>
              </Stack>
              <Stack direction="column" sx={{ alignItems: 'flex-end' }}>
                <Typography variant="body2" color="text.secondary">{getDay(n.timestamp)}</Typography>
                <Typography variant="body1" color="text.primary">{getTime(n.timestamp)}</Typography>
              </Stack>

            </Stack>
          </Box>
        ))}
      </List>
      {notifications.length === 0 &&
          <Box sx={{ p: 2, paddingLeft: 0.8, border: '1px solid grey', mb: 1 }}>
              <Typography variant="body1" align="center">You don't have any notifications.</Typography>
          </Box>
      }
    </Box>
  )
}

export default NotificationsPage;
