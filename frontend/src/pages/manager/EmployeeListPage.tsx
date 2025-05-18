import { useEffect, useState, useMemo, useCallback } from "react";
import { axiosAuthApi } from "../../middleware/axiosApi.ts";
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tabs,
  Tab,
  Typography,
  Paper,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Employee {
  id: string;
  role: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  status: string;
}

const sectors = [
  { label: "Room service", role: "EMPLOYEE" },
  { label: "Reception", role: "RECEPTIONIST" },
  { label: "Gastronomy", role: "EMPLOYEE" },
  { label: "Management", role: "MANAGER" },
];

function EmployeeListPage() {
  const [tab, setTab] = useState(0);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const pageSize = 10;
  
  const fetchEmployees = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axiosAuthApi.get<Employee[]>("/management/employees", {
        params: { page: page, size: pageSize },
      });
      console.log(res.data);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const employeesForTab = useMemo(() => {
    if (!sectors[tab]) return [];
    return employees.filter(emp => emp.role === sectors[tab].role);
  }, [tab, employees]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={2} width={"100%"} mr={10}>
      <Typography variant="h4" gutterBottom>
        Personnel
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          {sectors.map((s, i) => (
            <Tab key={i} label={s.label} />
          ))}
        </Tabs>
        <Button variant="contained" onClick={() => navigate("/employees/new")}>
          Add Employee
        </Button>
      </Box>

      <Paper elevation={2} sx={{ padding: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employeesForTab.map((emp) => (
              <TableRow key={emp.id} hover>
                <TableCell>
                  {emp.name} {emp.surname}
                </TableCell>
                <TableCell>{emp.role.replace("ROLE_", "")}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.status}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/employees/${emp.username}`)}
                  >
                    Preview
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {employees.length > pageSize && (
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button onClick={() => setPage(prev => Math.max(prev - 1, 0))} disabled={page === 0}>
              Previous
            </Button>
            <Button
              onClick={() => setPage(prev => Math.min(prev + 1, Math.floor(employees.length / pageSize) - 1))}
              disabled={page === Math.floor(employees.length / pageSize) - 1}
            >
              Next
            </Button>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}

export default EmployeeListPage;