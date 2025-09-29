import { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Chip,
  Typography,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Employee } from "../../types";
import EditEmployeeModal from "./modals/EditEmployeeModal.tsx";
import { useTranslation } from "react-i18next";
import { EmployeeCardPaper } from "../../theme/styled-components/EmployeeCardPaper.ts";

interface EmployeeCardProps {
  employee: Employee;
  onUpdated: (employee: Employee) => void;
}

function EmployeeCard({ employee, onUpdated }: EmployeeCardProps) {
  const { t } = useTranslation();
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
              {t(`common.department.${(employee.employeeData?.department ?? "").toLowerCase()}`)}
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
        {employee.employeeData?.sectors?.map((area: string, idx: number) => (
          <Chip
            key={idx}
            label={t(`common.sectors.${area.toLowerCase()}`)}
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
        onSaved={(updatedEmployee) => {
          if (updatedEmployee) {
            onUpdated(updatedEmployee);
          }
          setEditOpen(false);
        }}
      />
    </EmployeeCardPaper>
  );
}

export default EmployeeCard;
