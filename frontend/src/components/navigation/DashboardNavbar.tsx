import {Box, Stack} from "@mui/material";
import {useEffect, useMemo, useRef, useState} from "react";
import {matchPath, useLocation, useNavigate} from "react-router-dom";

interface DashboardNavbarProps {
  tabs: ReadonlyArray<{ name: string; link: string }>;
}

function DashboardNavbar({ tabs }: DashboardNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const activeLink = useMemo(() => {
    const match = tabs.find(t =>
      matchPath({path: `${t.link}/*`, end: false}, location.pathname));
    return match?.link ?? tabs[0].link;
  }, [location.pathname, tabs]);

  useEffect(() => {
    function updateIndicator() {
      if (!containerRef.current) return;
      const idx = tabs.findIndex(t => t.link === activeLink);
      const tabEl = containerRef.current.children[idx+1] as HTMLElement;
      if (tabEl) {
        setIndicatorStyle({left: tabEl.offsetLeft, width: tabEl.offsetWidth});
        if (window.innerWidth < 600) {
          const container = containerRef.current;
          const containerWidth = container.offsetWidth;
          const tabCenter = tabEl.offsetLeft + tabEl.offsetWidth / 2;
          const scrollTo = tabCenter - containerWidth / 2;
          container.scrollTo({
            left: scrollTo,
            behavior: "smooth",
          });
        }
      }
    }
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeLink, tabs]);

  return (
    <Stack ref={containerRef} direction="row" position="relative" overflow="hidden" alignItems="center" mb={2}
           height={40} p={0.5} borderRadius="99px" bgcolor="background.paper"
           border={theme => `1px solid ${theme.palette.divider}`}
           sx={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: "none", "::-webkit-scrollbar": {display: "none"} }}
    >

      <Box position="absolute" top={4} bottom={4} borderRadius="99px" bgcolor="primary.main"
           sx={{transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0ms"}}
           style={indicatorStyle}
      />

      {tabs.map((tab) => (
        <Box key={tab.link} display="flex" flex="1 0 0" px={3} justifyContent="center" alignItems="center" zIndex={1}
             fontWeight={600} fontSize="14px" color={activeLink === tab.link ? "primary.contrastText" : "text.primary"}
             sx={{cursor: "pointer", userSelect: "none"}}
             onClick={() => navigate(tab.link)}
        >
          {tab.name}
        </Box>
      ))}
    </Stack>
  );
}

export default DashboardNavbar;
