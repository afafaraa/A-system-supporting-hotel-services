import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Employee } from "../../../types";
import { axiosAuthApi } from "../../../middleware/axiosApi";
import { EditOutlined, Save } from "@mui/icons-material";

type Props = {
  open: boolean;
  initial: Employee;
  onClose: () => void;
  onSaved: (employee: Employee) => void;
};

function EditEmployeeModal({ open, initial, onClose, onSaved }: Props) {
  const [form, setForm] = useState<Employee>({
    id: "",
    role: "EMPLOYEE",
    username: "",
    email: "",
    name: "",
    surname: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (open) {
      setForm(initial);
    }
  }, [open]);

  const handleChange = (k: keyof Employee, v: unknown) => {
    setForm((prev) => ({ ...prev, [k]: v }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosAuthApi.put(`/employees/${form.id}`, form);
      onSaved(response.data);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          p: 2,
          maxHeight: "70vh",
          position: "relative",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <EditOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
          <Typography variant="h5" fontWeight="bold">
            Edit Employee
          </Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary">
          Update employee information
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Full Name
            </Typography>
            <TextField
              variant="filled"
              value={form.name + (form.surname ? " " + form.surname : "")}
              onChange={(e) => {
                const parts = e.target.value.split(" ");
                handleChange("name", parts[0]);
                handleChange("surname", parts.slice(1).join(" "));
              }}
              fullWidth
              sx={{
                fontSize: "1.1rem",
                py: 1,
                "& .MuiInputBase-input": {
                  p: 1,
                  color: "text.secondary",
                },
              }}
              slotProps={{
                input: { disableUnderline: true } as any,
              }}
            />
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Email
            </Typography>
            <TextField
              variant="filled"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
              sx={{
                fontSize: "1.1rem",
                py: 1,
                "& .MuiInputBase-input": {
                  p: 1,
                  color: "text.secondary",
                },
              }}
              slotProps={{
                input: { disableUnderline: true } as any,
              }}
            />
          </Box>
        </Box>

        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Department
            </Typography>
            <TextField
              variant="filled"
              value={"Food & Beverages"}
              fullWidth
              sx={{
                fontSize: "1.1rem",
                py: 1,
                "& .MuiInputBase-input": {
                  p: 1,
                  color: "text.secondary",
                },
              }}
              slotProps={{
                input: { disableUnderline: true } as any,
              }}
            />
          </Box>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Role
            </Typography>
            <TextField
              variant="filled"
              value={form.role.toLocaleLowerCase()}
              onChange={(e) => handleChange("role", e.target.value)}
              fullWidth
              sx={{
                fontSize: "1.1rem",
                py: 1,
                "& .MuiInputBase-input": {
                  p: 1,
                  color: "text.secondary",
                },
              }}
              slotProps={{
                input: { disableUnderline: true } as any,
              }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          <Save sx={{ mr: 1, verticalAlign: "middle" }} />
          Update Employee
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditEmployeeModal;
