import {useEffect, PropsWithChildren} from "react";
import { useNavigate } from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUser} from "../redux/slices/userSlice.ts";
import {Box} from "@mui/material";

function ProtectedRoute({ children }: PropsWithChildren) {
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    useEffect(() => {
        if (user === null) navigate("/login");
    }, [navigate, user]);

    if (!user) return null;

    return (
      <Box width='100%' height='100%' mx={{xs: '2%', sm: '4%', md: '6%', lg: '8%', xl: '10%'}} my='2rem'
           sx={{border: '0px dashed grey', transition: 'margin 0.3s ease-in-out'}}>
          {children}
      </Box>
    );
}

export default ProtectedRoute;
