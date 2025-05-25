// FOR DELETION AFTER MERGING
import {PropsWithChildren} from "react";
import {Box, Typography} from "@mui/material";

interface PageContainerProps {
  title?: string;
}

function PageContainer({ children, title }: PropsWithChildren<PageContainerProps>) {

  return (
    <Box width='100%' height='100%' mx={{xs: '2%', sm: '4%', md: '6%', lg: '8%', xl: '10%'}} my='2rem'
         sx={{border: '0px dashed grey', transition: 'margin 0.3s ease-in-out'}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="h5">MyHotelAssistant</Typography>
      </Box>
      {children}
    </Box>
  );

}

export default PageContainer;
