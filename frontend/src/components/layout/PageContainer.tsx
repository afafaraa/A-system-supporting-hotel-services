// FOR DELETION AFTER MERGING
import {PropsWithChildren} from "react";
import {Box, Typography} from "@mui/material";

interface PageContainerProps {
  title?: string;
}

function PageContainer({ children, title }: PropsWithChildren<PageContainerProps>) {

  return (
    <Box width='100%' height='100%' mx={{xs: 0, sm: '1%', md: '2%', lg: '3%', xl: '4%'}} my='2rem'
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
