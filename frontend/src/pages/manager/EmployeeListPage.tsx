import { useEffect, useState, useMemo, useCallback } from "react";
import { axiosAuthApi } from "../../middleware/axiosApi.ts";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  ClickAwayListener,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from "@mui/material";
import { Search, PersonOutline, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Employee } from "../../types";
import { useTranslation } from "react-i18next";
import EmployeeCard from "./EmployeeCard.tsx";

function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.personnel.${key}`);
  const [searchOpen, setSearchOpen] = useState(false);

  const [filterName, setFilterName] = useState('');
  const [filterPosition, setFilterPosition] = useState<'ALL' | 'RECEPTIONIST' | 'MANAGER' | 'EMPLOYEE'>('ALL');

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

  const filteredEmployees = useMemo(() => {
    return employees.filter(person => {
      const nameMatch = filterName.trim() === '' ||
        person.name.toLowerCase().includes(filterName.toLowerCase()) ||
        person.surname.toLowerCase().includes(filterName.toLowerCase());
      const positionMatch = filterPosition === 'ALL' || person.role === filterPosition;
      return nameMatch && positionMatch;
    });
  }, [employees, filterName, filterPosition]);

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
    <Paper sx={{ p: 3, borderRadius: 3, mt: 5, border: `1px solid`, borderColor: 'divider' }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Box display="flex" alignItems="flex-start" flexDirection="row">
            <PersonOutline fontSize="large" />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {tc("title")}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" mb={3} gutterBottom>
            Manage employee information and schedules
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" flexWrap="wrap" gap={2}>
          <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
            <Box display="flex" alignItems="center" position="relative">
              <IconButton onClick={() => setSearchOpen(!searchOpen)}>
                <Search />
              </IconButton>
              {searchOpen && (
                <TextField
                  placeholder={tc("searchPlaceholder")}
                  variant="outlined"
                  size="small"
                  value={filterName}
                  onChange={e => setFilterName(e.target.value)}
                  sx={{
                    ml: 1,
                    width: { xs: '150px', sm: '200px' },
                    transition: 'width 0.3s ease',
                  }}
                  autoFocus
                />
              )}
            </Box>
          </ClickAwayListener>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="position-label">{tc("position")}</InputLabel>
            <Select
              labelId="position-label"
              label={tc("type")}
              value={filterPosition}
              onChange={e => setFilterPosition(e.target.value as "ALL" | "RECEPTIONIST" | "MANAGER" | "EMPLOYEE")}
            >
              <MenuItem value="ALL">{tc("all")}</MenuItem>
              <MenuItem value="RECEPTIONIST">{tc("receptionist")}</MenuItem>
              <MenuItem value="MANAGER">{tc("manager")}</MenuItem>
              <MenuItem value="EMPLOYEE">{tc("employee")}</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/employees/new")}
            >
            {tc("addEmployee")}
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ width: '100%' }}>
          {filteredEmployees.map((emp) => (
            <Grid key={emp.id} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: "flex" }} >
              <EmployeeCard employee={emp} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}

export default EmployeeListPage;