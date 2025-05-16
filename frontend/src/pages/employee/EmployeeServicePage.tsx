import {useNavigate, useParams} from "react-router-dom";

function EmployeeServicePage() {
  const {serviceId} = useParams();
  const navigate = useNavigate();

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <button onClick={() => navigate('/employee/schedule')}>Go back to schedule</button>
      Working on the employee's assigned service with id: '{serviceId}' page...
    </div>
  );
}

export default EmployeeServicePage;
