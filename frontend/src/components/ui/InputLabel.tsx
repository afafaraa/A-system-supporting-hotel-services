import {ReactNode} from "react";
import Typography from "@mui/material/Typography";

interface Props {
  label: ReactNode | string;
  htmlFor?: string;
  mt?: number | string;
}

function InputLabel({label, htmlFor, mt=1.5}: Props) {
  return (
    <Typography component="label" htmlFor={htmlFor} mt={mt} pb={0.3}
                fontWeight={500} fontSize={14} color="text.primary"
                display="flex" alignItems="center" gap={0.8} sx={{userSelect: "none"}}
    >
      {label}
    </Typography>
  );
}

export default InputLabel;
