import {PropsWithChildren} from "react";
import {Box} from "@mui/material";

function PageMargin({ children }: PropsWithChildren) {

  return (
    <Box width='100%' height='100%' mx={{xs: '2%', sm: '4%', md: '6%', lg: '8%', xl: '10%'}} my='2rem'
         sx={{border: '0px dashed grey', transition: 'margin 0.3s ease-in-out'}}>
      {children}
    </Box>
  );

}

export default PageMargin;
