import {Typography} from "@mui/material";

function AuthenticatedHeader({title}: {title: string}) {
  return (
    <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary" mb={2.5}>
      {title}
    </Typography>
  )
}

export default AuthenticatedHeader;
