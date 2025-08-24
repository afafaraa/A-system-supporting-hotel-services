import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";

const subpages = {
  availableServices: { title: "Available Services", route: "/services/available" },
  bookedServices: { title: "Booked Services", route: "/services/requested" },
  bookHotelRoom: { title: "Book Hotel Room", route: "/services/requested" },
};

function GuestNavbar() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(subpages.availableServices);
  const theme = useTheme();

  useEffect(() => {
    navigate(currentPage.route);
  }, [currentPage, navigate]);

  return (
    <div style={{width: '100%', padding: '3px', display: 'flex', gap: '1rem', background: 'white', borderRadius: '20px', border: `1px solid ${theme.palette.primary.border}`}}>
      {Object.values(subpages).map((item) => (
          <button
            style={{flexGrow: 1, borderRadius: '20px', padding: '5px', width: '100%', border: 'none', backgroundColor: currentPage === item ? theme.palette.primary.main : 'transparent', color: currentPage === item ? 'white' : ''}}
            key={item.route}
            onClick={() => setCurrentPage(item)}
          >
            {item.title}
          </button>
      ))}
    </div>
  );
}

export default GuestNavbar;
