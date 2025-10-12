import React from "react";
import Box from "@mui/system/Box";
import {Typography} from "@mui/material";

interface SectionTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  mb?: number | string;
  smaller?: boolean;
  sx?: object;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, mb=3, smaller=false, sx }) => (
  <Box mb={mb} sx={sx}>
    <Typography fontSize={smaller ? "1.2rem" : "1.4rem"} display="flex" alignItems="center" gap={1} noWrap>{title}</Typography>
    <Typography fontSize="inherit" color="text.secondary" mt="3px">{subtitle}</Typography>
  </Box>
)

export default SectionTitle;
