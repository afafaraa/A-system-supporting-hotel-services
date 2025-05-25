import {useNavigate, useParams} from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer.tsx";
import {Box} from "@mui/system";
import Button from "@mui/material/Button";
import {Typography} from "@mui/material";

function EmployeeServicePage() {
  const {serviceId} = useParams();
  const navigate = useNavigate();

  return (
    <PageContainer title={`Service ${serviceId}`}>
      <Box display='flex' gap={3} flexDirection='column'>
        <Button onClick={() => navigate('/employee/schedule')} variant='contained'>
          Go back to schedule
        </Button>
        <Typography>
          Working on the employee's assigned service with id: '{serviceId}' page...
        </Typography>
      </Box>
    </PageContainer>
  );
}

export default EmployeeServicePage;
