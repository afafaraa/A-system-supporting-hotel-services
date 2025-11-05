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
import LanguageSwitcher from "../../components/ui/LanguageSwitcher.tsx";
import ThemeToggleGroup from "../../components/ui/ThemeToggleGroup.tsx";
import React from "react";
import {SectionCard} from "../../theme/styled-components/SectionCard.ts";
import SectionTitle from "../../components/ui/SectionTitle.tsx";
import {useTranslation} from "react-i18next";
import useTranslationWithPrefix from "../../locales/useTranslationWithPrefix.tsx";

function ProfilePage() {
  const {t} = useTranslation();
  const {t: tc} = useTranslationWithPrefix("pages.profile");
  const user = useSelector(selectUser);
  const userDetails = useSelector(selectUserDetails);

  if (!user) return null;

  const getUserInitials = (name: string, surname: string) => {
    return name.charAt(0).toUpperCase() + surname.charAt(0).toUpperCase();
  }

  const UserProfile = () => (
    <SectionCard sx={{backgroundColor: "primary.main"}}>
      <Stack direction="row">
        <Box fontWeight="bold" minWidth={100} width={100} height={100} borderRadius="50%" mr={4}
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
            Hotel {user.role.split("_")[1].toLowerCase()}
          </Typography>
          <Box display="flex" flexDirection="row" gap={6} mt={1}>
            <Typography color="background.default" fontSize="0.8rem" display="flex" alignItems="center" gap={0.5}>
              <EmailOutlinedIcon fontSize="small"/> {userDetails && userDetails.email}
            </Typography>
            {userDetails && userDetails.guestData &&
                <Typography color="background.default" fontSize="0.8rem" display={{xs: "none", sm: "flex"}} alignItems="center" gap={0.5}>
                    <PlaceOutlinedIcon fontSize="small"/> {t("common.room")} {userDetails && userDetails.guestData.currentReservation.roomNumber}
                </Typography>
            }
          </Box>
        </Stack>
      </Stack>
    </SectionCard>
  )

  const PersonalInformation = () => (
    <SectionCard>
      <SectionTitle smaller title={<><PersonOutlineOutlinedIcon color="primary"/> {tc("personal_info")}</>}
                    subtitle={tc("personal_info_subtitle")} />
      <Stack direction="row" gap={4}>
        <Stack direction="column" gap={2} fontWeight="bold">
          <span>{tc("username")}</span>
          <span>{tc("full_name")}</span>
          <span>{tc("email")}</span>
          <span>{tc("phone")}</span>
        </Stack>
        <Stack direction="column" gap={2}>
          <span>{user.username}</span>
          <span>{userDetails && `${userDetails.name} ${userDetails.surname}`}</span>
          <span>{userDetails?.email ?? "—"}</span>
          <span>—</span>
        </Stack>
      </Stack>
      {user.role === "ROLE_GUEST" && <>
        <Divider sx={{ my: 3 }} />
        <span style={{fontWeight: "bold"}}>{t("common.special_requests")}</span>
        <Typography fontSize="95%" color="text.secondary" mt={1}>
          {userDetails?.guestData?.currentReservation.specialRequests ?? "—"}
        </Typography>
      </>}
    </SectionCard>
  )

  const StayInformation = () => (
    <SectionCard>
        <SectionTitle smaller title={<><CalendarTodayOutlinedIcon color="primary"/> {tc("stay_info")}</>}
                      subtitle={tc("stay_info_subtitle")} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontSize="inherit" fontWeight="bold">{tc("room_number")}</Typography>
          <Chip label={`${t("common.room")} ${userDetails?.guestData?.currentReservation.roomNumber ?? ''}`} size="small" color="primary" variant="outlined"/>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" gap={2}>
            <span>{tc("check_in")}</span>
            <span>{tc("check_out")}</span>
            <span>{tc("room_price")}</span>
          </Stack>
          <Stack direction="column" gap={2} textAlign="right" fontWeight="bold">
            {userDetails?.guestData && <>
                <span>{new Date(userDetails.guestData.currentReservation.checkIn).toLocaleDateString(t('date.locale'))}</span>
                <span>{new Date(userDetails.guestData.currentReservation.checkOut).toLocaleDateString(t('date.locale'))}</span>
                <span>{userDetails.guestData.currentReservation.reservationPrice.toFixed(2)} $</span>
            </>}
          </Stack>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Button variant="contained" fullWidth>{tc("view_all")}</Button>
    </SectionCard>
  )

  const EmployeeCard = () => ( // TODO: employee stats (services handled, hours worked, etc.)
    <SectionCard>
      <SectionTitle smaller title={<><BadgeOutlinedIcon color="primary"/> {tc("employee_card")}</>}
                    subtitle={tc("employee_card_subtitle")} />
      <Stack direction="row" gap={4}>
        <Stack direction="column" gap={2} fontWeight="bold">
          <span>{tc("position")}</span>
          <span>{tc("department")}</span>
          <span>{tc("sectors")}</span>
          <span>{tc("hire_date")}</span>
        </Stack>
        <Stack direction="column" gap={2}>
          <span>{user.role.split("_")[1].toLowerCase()}</span>
          <span>{userDetails?.employeeData?.department?.toLowerCase() ?? "—"}</span>
          <span>{userDetails?.employeeData?.sectors.map(s => s.toLowerCase()).join(", ") ?? "—"}</span>
          <span>{userDetails?.employeeData?.hireDate ? new Date(userDetails?.employeeData?.hireDate).toLocaleString(t("date.locale")) : "—"}</span>
        </Stack>
      </Stack>
    </SectionCard>
  )

  const AccountBalance = () => (
    <SectionCard>
      <SectionTitle smaller title={tc("account_balance")}
                    subtitle={tc("account_balance_subtitle")}/>
      <SectionCard sx={{backgroundColor: "primary.main"}} textAlign="center">
        <Typography color="background.default">{tc("current_bill")}</Typography>
        <Typography fontWeight="bold" color="background.default" fontSize="2.5rem">{userDetails?.guestData?.bill.toFixed(2)} $</Typography>
      </SectionCard>
      <Typography mt={3}>{tc("recent_transactions")}:</Typography>
      {[1, 2, 3].map(item => (
        <SectionCard key={item} sx={{p: 3, borderRadius: 3, mt: 2}}>Placeholder {item}</SectionCard>
      ))}

    </SectionCard>
  )

  const PageSettings = () => (
    <SectionCard>
      <SectionTitle smaller title={<><SettingsOutlinedIcon color="primary"/> {tc("page_settings")}</>} />
      <Stack gap={2}>
        <Typography component="div" display="flex" alignItems="center" gap={3}>
          {tc("page_language")}: <LanguageSwitcher />
        </Typography>
        <Typography component="div" display="flex" alignItems="center" gap={3}>
          {tc("page_theme")}: <ThemeToggleGroup />
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
      <SectionTitle smaller title={tc("account_info")}
                    subtitle={tc("account_info_subtitle")}/>
      <Stack gap={2}>
        <CardWithSwitch title={tc("email_notifications")}
                        subtitle={tc("email_notifications_subtitle")}
                        endAdornment={<Switch />} />
        <CardWithSwitch title={tc("marketing_communication")}
                        subtitle={tc("marketing_communication_subtitle")}
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
      {user.role === "ROLE_GUEST" && <AccountBalance />}
      <PageSettings />
      <AccountInformation />
    </Stack>
  )
}

export default ProfilePage;
