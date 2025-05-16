import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
//import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/slices/userSlice.ts";

function EmployeeSchedulePage() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user === null) return;
    console.log(user)
    //const response = axiosAuthApi.get('/employee/schedule');
  }, [user]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      Working on the employee schedule page...
      <button onClick={() => navigate('/employee/service/1')}>service 1</button>
      <button onClick={() => navigate('/employee/service/2')}>service 2</button>
      <button onClick={() => navigate('/employee/service/3')}>service 3</button>
    </div>
  );
}

export default EmployeeSchedulePage;
