import {Box} from "@mui/material";

function AuthenticatedHeader({title}: {title: string}) {
  return (
    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: {xs: '8px', sm: '1rem'}, marginBottom: '1rem', paddingLeft: {xs: '30px', sm: '0'}}}>
      <h1>{title}</h1>
      <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center', gap: '10px'}}>
        <h3>MyHotelAssistant</h3>
        <div>Icon</div>
      </Box>
    </Box>

  )
}

export default AuthenticatedHeader;