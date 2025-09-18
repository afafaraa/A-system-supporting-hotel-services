import {ComponentProps, ReactNode} from "react";
import {Link as RouterLink} from "react-router-dom";
import MuiLink from "@mui/material/Link";

interface Props extends ComponentProps<typeof MuiLink> {
  children?: ReactNode | undefined;
  to: string;
}

function AppLink({ children, to, ...props }: Props) {
  return <MuiLink
    component={RouterLink}
    to={to}
    {...props}
  >
    {children}
  </MuiLink>
}

export default AppLink;
