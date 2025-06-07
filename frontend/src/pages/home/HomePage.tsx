import {Card, Typography} from "@mui/material";
import PageContainer from "../../components/layout/PageContainer.tsx";
import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";
import {useTranslation} from "react-i18next";

interface UserData {
  email: string,
  employeeData: object,
  guestData: GuestData | null,
  name: string,
  surname: string,
}

interface GuestData {
  roomNumber: string,
  checkInDate: string,
  checkOutDate: string,
  orders: object[],
}

function HomePage() {
  const loggedUser = useSelector(selectUser);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataError, setUserDataError] = useState<string | null>(null);
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.home.${key}`);

  useEffect(() => {
    axiosAuthApi.get<UserData>('/user')
      .then(res => {
        console.log("Response:", res);
        setUserData(res.data)
      })
      .catch(err => {
        setUserDataError(err.message);
      })
  }, []);

  return (
    <PageContainer title={tc("title")}>

      { loggedUser &&
        <Card sx={{p: 2, mb: 2}}>
          <Typography variant='h5' mb={1}>{tc("loggedUser")}</Typography>
          <Typography>{tc("username")}: {loggedUser.username}</Typography>
          <Typography>{tc("role")}: {loggedUser.role.split("_")[1].toLowerCase()}</Typography>
        </Card>
      }

      <Card sx={{p: 2, mb: 2}}>
        {userDataError}
        {userData && (
          <>
            <Typography variant='h5' mb={1}>{tc("accountData")}</Typography>
            <Typography>{tc("name")}: {userData.name + ' ' + userData.surname}</Typography>
            <Typography>{tc("email")}: {userData.email}</Typography>
            {userData.employeeData && (
              <Typography>{tc("employeeData")}: {JSON.stringify(userData.employeeData)}</Typography>
            )}
            {userData.guestData && (
              <>
                <Typography>{tc("roomNumber")}: {userData.guestData.roomNumber}</Typography>
                <Typography>{tc("checkInDate")}: {new Date(userData.guestData.checkInDate).toLocaleDateString(t("date.locale"))}</Typography>
                <Typography>{tc("checkOutDate")}: {new Date(userData.guestData.checkOutDate).toLocaleDateString(t("date.locale"))}</Typography>
              </>
            )}
          </>
        )}
      </Card>
    </PageContainer>
  )
}

export default HomePage;
