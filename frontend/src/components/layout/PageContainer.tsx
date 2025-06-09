// FOR DELETION AFTER MERGING
import {PropsWithChildren} from "react";
import {Box, Stack, Typography} from "@mui/material";

interface PageContainerProps {
  title?: string;
}

function PageContainer({ children, title }: PropsWithChildren<PageContainerProps>) {

  return (
    <Box width='100%' height='100%' mx={{xs: 0, sm: '1%', md: '1%', lg: '2%', xl: '2%'}} my='2rem'
         sx={{border: '0px dashed grey', transition: 'margin 0.3s ease-in-out'}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
        <Typography variant="h4" fontWeight="bold">{title}</Typography>
        <Stack direction="row" spacing={2}>
          <Typography variant="h5" fontWeight="bold">MyHotelAssistant</Typography>
          <img alt="icon" src="/logo.png" width={32}/>
        </Stack>
      </Box>
      {children}
    </Box>
  );

}

export default PageContainer;
