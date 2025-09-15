import { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Employee } from "../../types";
import { styled } from "@mui/material/styles";
import EditEmployeeModal from "./modals/EditEmployeeModal.tsx";

const EmployeeCardPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  padding: theme.spacing(2),
  borderRadius: 12,
  width: "100%",
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
  flexDirection: "column",
  gap: 1.5,
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    boxShadow: 6,
    transform: "translateY(-2px)",
  },
}));

interface EmployeeCardProps {
  employee: Employee;
}

const tempAreas: string[] = ["Breakfast", "Lunch", "Dinner"];

function EmployeeCard({ employee }: EmployeeCardProps) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <EmployeeCardPaper>
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        onClick={() => navigate(`/employees/${employee.username}`)}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar
            sx={{
              bgcolor: "primary.medium",
              width: 64,
              height: 64,
              color: "primary.main",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {employee.name[0]}
            {employee.surname[0]}
          </Avatar>

          <Box>
            <Typography fontWeight="bold">
              {employee.name} {employee.surname}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {employee.role.replace("ROLE_", "").toLowerCase()}
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              setEditOpen(true);
            }}
            sx={{
              border: 1,
              borderColor: "primary.main",
              borderRadius: 1,
              width: 40,
              height: 40,
              p: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Edit />
          </IconButton>
        </Box>
      </Box>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={1}
        justifyContent="center"
        mt={1}
      >
        {tempAreas?.map((area: string, idx: number) => (
          <Chip
            key={idx}
            label={area}
            size="small"
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>

      <EditEmployeeModal
        open={editOpen}
        initial={employee}
        onClose={() => setEditOpen(false)}
        onSaved={() => {
          setEditOpen(false);
          window.location.reload();
        }}
      />
    </EmployeeCardPaper>
  );
}

export default EmployeeCard;
