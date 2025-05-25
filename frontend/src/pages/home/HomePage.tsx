import {Card, Typography} from "@mui/material";
import PageContainer from "../../components/layout/PageContainer.tsx";
import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataError, setUserDataError] = useState<string | null>(null);

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
    <PageContainer title='My Home Page'>
      <Card sx={{p: 2}}>
        {userDataError}
        {userData && (
          <>
            <Typography variant='h5' mb={1}>Your account data</Typography>
            <Typography>Name: {userData.name + ' ' + userData.surname}</Typography>
            <Typography>Email: {userData.email}</Typography>
            {userData.employeeData && (
              <Typography>employeeData: {JSON.stringify(userData.employeeData)}</Typography>
            )}
            {userData.guestData && (
              <>
                <Typography>Room Number: {userData.guestData.roomNumber}</Typography>
                <Typography>Check-in Date: {new Date(userData.guestData.checkInDate).toDateString()}</Typography>
                <Typography>Check-out Date: {new Date(userData.guestData.checkOutDate).toDateString()}</Typography>
              </>
            )}
          </>
        )}
      </Card>
    </PageContainer>
  )
}

export default HomePage;
