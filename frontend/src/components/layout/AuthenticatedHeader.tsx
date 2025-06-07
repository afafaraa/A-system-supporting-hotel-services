import {Box} from "@mui/material";

function AuthenticatedHeader({title}: {title: string}) {
  return (
    <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: '1rem', marginBottom: '2rem'}}>
      <h1>{title}</h1>
      <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center', gap: '16px'}}>
        <h3>MyHotelAssistant</h3>
        <img alt="icon" src="/logo.png" width={32}/>
      </Box>
    </header>

  )
}

export default AuthenticatedHeader;