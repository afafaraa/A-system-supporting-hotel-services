import {Button, Card, Chip, Divider, Grid, Stack, Switch} from "@mui/material";
import {Typography} from "@mui/material";
import Box from "@mui/system/Box"
import {useSelector} from "react-redux";
import {selectUserDetails} from "../../redux/slices/userDetailsSlice.ts";
import {selectUser} from "../../redux/slices/userSlice.ts";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import {t} from "i18next";
import LanguageSwitcher from "../../components/layout/LanguageSwitcher.tsx";
import React from "react";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import ThemeSwitcher from "../../components/layout/ThemeSwitcher.tsx";

function ProfilePage() {
  const user = useSelector(selectUser);
  const userDetails = useSelector(selectUserDetails);

  if (!user) return null;

  const getUserInitials = (name: string, surname: string) => {
    return name.charAt(0).toUpperCase() + surname.charAt(0).toUpperCase();
  }

  const Title: React.FC<{ title: React.ReactNode; subtitle?: React.ReactNode }> = ({ title, subtitle }) => (
    <Box mb={3}>
      <Typography fontSize="1.2rem" display="flex" alignItems="center" gap={1}>{title}</Typography>
      <Typography fontSize="inherit" color="text.secondary">{subtitle}</Typography>
    </Box>
  )

  const UserProfile = () => (
    <SectionCard sx={{backgroundColor: "primary.main"}}>
      <Stack direction="row">
        <Box fontWeight="bold" width={100} height={100} borderRadius="50%" mr={4}
             display="flex" alignItems="center" justifyContent="center" bgcolor="#A85AFB" border='2px solid #cb9cfd'>
          <Typography fontWeight="bold" lineHeight={1} fontSize="2.5rem" color="background.default">
            {userDetails && getUserInitials(userDetails.name, userDetails.surname)}
          </Typography>
        </Box>

        <Stack justifyContent="space-between">
          <Typography fontWeight="bold" fontSize="2rem" color="background.default" lineHeight={1}>
            {userDetails && `${userDetails.name} ${userDetails.surname}`}
          </Typography>
          <Typography fontWeight="bold" fontSize="0.8rem" color="black" bgcolor="secondary.main" px={1.5} py={0.2} borderRadius={2} width="fit-content">
            Hotel {user && user.role.split("_")[1].toLowerCase()}
          </Typography>
          <Box display="flex" flexDirection="row" gap={6} mt={1}>
            <Typography color="background.default" fontSize="0.8rem" display="flex" alignItems="center" gap={0.5}>
              <EmailOutlinedIcon fontSize="small"/> {userDetails && userDetails.email}
            </Typography>
            {userDetails && userDetails.guestData &&
                <Typography color="background.default" fontSize="0.8rem" display="flex" alignItems="center" gap={0.5}>
                    <PlaceOutlinedIcon fontSize="small"/> Room {userDetails && userDetails.guestData.roomNumber}
                </Typography>
            }
          </Box>
        </Stack>
      </Stack>
    </SectionCard>
  )

  const PersonalInformation = () => (
    <SectionCard>
      <Title title={<><PersonOutlineOutlinedIcon color="primary"/> Personal Information</>}
             subtitle={"Manage your personal details and contact information"} />
      <Stack direction="row" gap={4}>
        <Stack direction="column" gap={2} fontWeight="bold">
          <span>Username</span>
          <span>Full name</span>
          <span>Email</span>
          <span>Phone</span>
        </Stack>
        <Stack direction="column" gap={2}>
          <span>{user.username}</span>
          <span>{userDetails && `${userDetails.name} ${userDetails.surname}`}</span>
          <span>{userDetails?.email ?? "—"}</span>
          <span>—</span>
        </Stack>
      </Stack>
      <Divider sx={{ my: 3 }} />
      <span style={{fontWeight: "bold"}}>Special Requests</span>
      <Typography fontSize="inherit" color="text.secondary" mt={1}>—</Typography>
    </SectionCard>
  )

  const StayInformation = () => (
    <SectionCard>
        <Title title={<><CalendarTodayOutlinedIcon color="primary"/> Stay information</>}
               subtitle={"Details about your current hotel stay"} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontSize="inherit" fontWeight="bold">Room number</Typography>
          <Chip label={`Room ${userDetails?.guestData?.roomNumber ?? ''}`} size="small" color="primary" variant="outlined"/>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" gap={2}>
            <span>Check-in Date</span>
            <span>Check-out Date</span>
          </Stack>
          <Stack direction="column" gap={2} textAlign="right" fontWeight="bold">
            {userDetails?.guestData && <>
                <span>{new Date(userDetails.guestData.checkInDate).toLocaleDateString(t('date.locale'))}</span>
                <span>{new Date(userDetails.guestData.checkOutDate).toLocaleDateString(t('date.locale'))}</span>
            </>}
          </Stack>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Button variant="contained" fullWidth>View all</Button>
    </SectionCard>
  )

  const EmployeeCard = () => (
    <SectionCard>
      <Title title={<><BadgeOutlinedIcon color="primary"/> Employee Card</>}
             subtitle={"Employee specific data card (e.g., position, department, hire date)"} />
      123
    </SectionCard>
  )

  const PageSettings = () => (
    <SectionCard>
      <Title title={<><SettingsOutlinedIcon color="primary"/> Page settings</>} />
      <Stack gap={2}>
        <Typography display="flex" alignItems="center" gap={3}>
          Page language: <LanguageSwitcher />
        </Typography>
        <Typography display="flex" alignItems="center" gap={3}>
          Page theme: <ThemeSwitcher />
        </Typography>
      </Stack>
    </SectionCard>
  )

  const CardWithSwitch: React.FC<{ title: React.ReactNode; subtitle: React.ReactNode; endAdornment: React.ReactNode }> = ({ title, subtitle, endAdornment }) => (
    <Card variant="outlined" sx={{p: 3, borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <Box>
        <Typography fontSize="1.1rem" fontWeight="bold">{title}</Typography>
        <Typography fontSize="0.8rem" color="text.secondary">{subtitle}</Typography>
      </Box>
      {endAdornment}
    </Card>
  )

  const AccountInformation = () => (
    <SectionCard>
      <Title title={"Account Information"}
             subtitle={"Manage your account preferences and security settings"}/>
      <Stack gap={2}>
        <CardWithSwitch title={"Email Notifications"}
                        subtitle={"Receive updates about your bookings and services"}
                        endAdornment={<Switch />} />
        <CardWithSwitch title={"Marketing Communications"}
                        subtitle={"Receive special offers and promotions"}
                        endAdornment={<Switch />} />
      </Stack>
    </SectionCard>
  )

  return (
    <Stack gap={4}>
      <UserProfile />
      <Grid container spacing={4} columns={{ xs: 1, md: 2 }}>
        <Grid size={1}>
          <PersonalInformation />
        </Grid>
        <Grid size={1}>
          {user.role === "ROLE_GUEST" ? <StayInformation /> : <EmployeeCard />}
        </Grid>
      </Grid>
      <PageSettings />
      <AccountInformation />
    </Stack>
  )
}

export default ProfilePage;
