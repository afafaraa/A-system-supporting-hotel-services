import {useEffect} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";

interface Notification {
  id: string,
  title: string
  message: string,
  timestamp: string,
}

function NotificationsPage(){
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!user) return;
    axiosAuthApi.get<Notification>(`/user/notifications?username=${user.username}`)
      .then(res => {
        console.log("Response:", res);
        console.log("Data:", res.data);
      })
      .catch(err => {
        console.log("Error:", err);
      });
  }, [user]);

  return (
    <div>Notifications Page in progress...</div>
  )
}

export default NotificationsPage;
