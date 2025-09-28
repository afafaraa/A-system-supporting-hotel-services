import React from "react";
import Box from "@mui/system/Box";
import {Typography} from "@mui/material";

interface SectionTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  mb?: number | string;
  smaller?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, mb=3, smaller=false }) => (
  <Box mb={mb}>
    <Typography fontSize={smaller ? "1.2rem" : "1.4rem"} display="flex" alignItems="center" gap={1} noWrap>{title}</Typography>
    <Typography fontSize="inherit" color="text.secondary" mt="3px">{subtitle}</Typography>
  </Box>
)

export default SectionTitle;
