import React from "react";
import Box from "@mui/system/Box";
import {Typography} from "@mui/material";

const Title: React.FC<{ title: React.ReactNode; subtitle?: React.ReactNode }> = ({ title, subtitle }) => (
  <Box mb={3}>
    <Typography fontSize="1.2rem" display="flex" alignItems="center" gap={1}>{title}</Typography>
    <Typography fontSize="inherit" color="text.secondary">{subtitle}</Typography>
  </Box>
)

export default Title;
