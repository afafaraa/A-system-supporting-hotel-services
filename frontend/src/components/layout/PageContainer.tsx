// FOR DELETION AFTER MERGING
import {PropsWithChildren} from "react";
import {Box, Stack, Typography} from "@mui/material";

interface PageContainerProps {
  title?: string;
}

function PageContainer({ children, title }: PropsWithChildren<PageContainerProps>) {

  return (
    <Box width='100%' height='100%' my={3}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
        <Typography variant="h4" fontWeight="bold" color="textPrimary">{title}</Typography>
        <Stack direction="row" spacing={2}>
          <Typography variant="h5" fontWeight="bold" color="textPrimary">MyHotelAssistant</Typography>
          <img alt="icon" src="/logo.png" width={32}/>
        </Stack>
      </Box>
      {children}
    </Box>
  );

}

export default PageContainer;
