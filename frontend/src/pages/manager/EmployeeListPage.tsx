import {useEffect, useState} from "react";
import axiosApi from "../../middleware/axiosApi.ts";

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

  const token = localStorage.getItem('ACCESS_TOKEN');

  useEffect(() => {
    if (!token) {
      setError('Brak tokena. ');
      return
    }
    axiosApi.get<Employee[]>('/management/employees', {
      params: { page: page, size: pageSize },
      headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        console.log(res)
        setEmployees(employees => [...employees, ...res.data])
        if (res.data.length === 0) {
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
  }, [page, token]);

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
                <div key={index}>
                  <h2>{employee.name} {employee.surname}</h2>
                  <p>Email: {employee.email}</p>
                  <p>Rola: {employee.role}</p>
                  <br/>
                </div>
              ))}
            </div>
            {showLoadMore && <button onClick={loadMore}>Załaduj więcej</button>}
        </div>
      }
    </>
  );
}

export default EmployeeListPage;