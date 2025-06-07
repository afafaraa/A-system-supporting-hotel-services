import {Box} from "@mui/material";

function AuthenticatedHeader({title}: {title: string}) {
  return (
    <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '1rem', marginBottom: '1rem'}}>
      <h1>{title}</h1>
      <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center', gap: '10px'}}>
        <h3>MyHotelAssistant</h3>
        <div>Icon</div>
      </Box>
    </header>

  )
}

export default AuthenticatedHeader;