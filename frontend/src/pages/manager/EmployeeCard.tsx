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
}))

interface EmployeeCardProps {
    employee: Employee;
}

const tempAreas: string[] = ["Breakfast", "Lunch", "Dinner"]

function EmployeeCard({ employee }: EmployeeCardProps) {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <EmployeeCardPaper
            onClick={() => navigate(`/employees/${employee.username}`)}
        >
            <Box display="flex" justifyContent="space-between" width="100%">
                <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                        sx={{
                            bgcolor: "primary.medium",
                            width: 64,
                            height: 64,
                            color: "primary.main",
                            fontSize: 20,
                            fontWeight: "bold",
                            border: `1px solid`,
                            borderColor: "primary.main"
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
                            {employee.role.replace("ROLE_", "")}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    onClick={e => e.stopPropagation()}
                >
                    <IconButton
                        color="primary"
                        onClick={() => {
                            setModalOpen(true);
                        }}
                        sx={{
                            border: 1,
                            borderColor: 'primary.main',
                            borderRadius: 1,
                            width: 40,
                            height: 40,
                            p: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
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
            
        </EmployeeCardPaper>
    );
}

export default EmployeeCard;