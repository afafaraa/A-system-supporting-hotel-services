import {useEffect, useState} from "react";
import {axiosAuthApi} from "../../middleware/axiosApi.ts";
import {Button, Card, CardContent, Typography} from "@mui/material";
import {selectUser} from "../../redux/slices/userSlice";
import {useSelector} from "react-redux";

interface Employee {
  id: string;
  username: string;
  role: string;
  email: string;
  name: string;
  surname: string;
}

function EmployeeListPage() {
  
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(0);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const pageSize = 1;
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user === null) return

    axiosAuthApi.get<Employee[]>('/management/employees', {
      params: { page: page, size: pageSize },
    })
      .then(res => {
        console.log(res)
        setEmployees(employees => [...employees, ...res.data
          .filter(employee => !employees.some(e => e.id === employee.id)) ]); // for debug mode
        if (res.data.length < pageSize) {
          setShowLoadMore(false);
        }
      })
      .catch((reason) => {
        switch (reason.response.status) {
          case 401:
            setError('Niepoprawny token')
            break;
          case 400:
            setError('Niepoprawne dane')
            break;
          case 403:
            setError('Brak uprawnień')
            break;
          default:
            setError('Nie udało się pobrać listy pracowników')
        }
      });
  }, [page, user]);

  function loadMore() {
    setPage(prevState => prevState + 1)
  }

  return (
    <>
      {error && <div>{error}</div>}
      {!error &&
        <div style={{ padding: '20px', paddingInline: '80px' }}>
            
          <h1>Lista pracowników</h1>
            
          <div>
            {employees.map((employee, index) => (
              <Card key={index} style={{ margin: '20px' }}>
                <CardContent>
                  <Typography variant="h5" component="div">{employee.name} {employee.surname}</Typography>
                  <Typography variant="body2" color="text.secondary">Email: {employee.email}</Typography>
                  <Typography variant="body2" color="text.secondary">Rola: {employee.role}</Typography>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {showLoadMore &&
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" onClick={loadMore}>Załaduj więcej</Button>
            </div>
          }
          
        </div>
      }
    </>
  );
}

export default EmployeeListPage;