import React from "react";
import Box from "@mui/system/Box";
import {Typography} from "@mui/material";

const Title: React.FC<{ title: React.ReactNode; subtitle?: React.ReactNode, mb?: number | string, bigger?: boolean }> = ({ title, subtitle, mb=3, bigger }) => (
  <Box mb={mb}>
    <Typography fontSize={bigger ? "1.4rem" : "1.2rem"} display="flex" alignItems="center" gap={1} noWrap>{title}</Typography>
    <Typography fontSize="inherit" color="text.secondary">{subtitle}</Typography>
  </Box>
)

export default Title;
