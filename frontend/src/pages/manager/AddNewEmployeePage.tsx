import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAuthApi } from "../../middleware/axiosApi";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const roles = [
  { value: "EMPLOYEE", label: "Employee" },
  { value: "RECEPTIONIST", label: "Receptionist" },
  { value: "MANAGER", label: "Manager" },
];

function AddNewEmployeePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.role
    ) {
      setError("All fields, including role, are required");
      return;
    }
    setLoading(true);

    try {
      const res = await axiosAuthApi.post("/management/employees", {
        username: `${formData.name.toLowerCase()}${formData.surname.toLowerCase()}`,
        password: "password",
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        role: formData.role,
      });
      navigate(`/employees/${res.data.username}`);
    } catch (err) {
      console.error(err);
      setError("Failed to add new employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2} sx={{ width: "60%" }}>
      <Typography variant="h4" gutterBottom>
        Add New Employee
      </Typography>

      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          m: 3,
          ml: 20,
        }}
      >
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          flexDirection="column"
          p={2}
          gap={2}
        >
          <TextField
            label="Name"
            size="small"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Surname"
            size="small"
            value={formData.surname}
            onChange={(e) =>
              setFormData({ ...formData, surname: e.target.value })
            }
            required
            fullWidth
          />
          <TextField
            label="Email"
            size="small"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            fullWidth
          />
          <FormControl required fullWidth size="small">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={formData.role}
              label="Role"
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Button variant="outlined" onClick={() => navigate("/employees")}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddNewEmployeePage;
