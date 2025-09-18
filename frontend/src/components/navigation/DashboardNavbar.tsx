import Box from "@mui/system/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import {useEffect, useMemo, useRef, useState} from "react";
import {matchPath, useLocation, useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface DashboardNavbarProps {
  tabs: ReadonlyArray<{ name: string; link: string }>;
  arrowButtons?: boolean;
}

function DashboardNavbar({ tabs, arrowButtons=false }: DashboardNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [disableLeftArrow, setDisableLeftArrow] = useState(true);
  const [disableRightArrow, setDisableRightArrow] = useState(true);

  const activeLink = useMemo(() => {
    const match = tabs.find(t =>
      matchPath({path: `${t.link}/*`, end: false}, location.pathname));
    return match?.link ?? tabs[0].link;
  }, [location.pathname, tabs]);

  useEffect(() => {
    function updateIndicator() {
      const container = containerRef.current;
      if (!container) return;
      const idx = tabs.findIndex(t => t.link === activeLink);
      const tabEl = container.children[idx] as HTMLElement;
      if (tabEl) {
        setIndicatorStyle({left: tabEl.offsetLeft, width: tabEl.offsetWidth});
        if (container.scrollWidth > container.offsetWidth) {
          const containerWidth = container.offsetWidth;
          const tabCenter = tabEl.offsetLeft + tabEl.offsetWidth / 2;
          const scrollTo = tabCenter - containerWidth / 2;
          container.scrollTo({left: scrollTo, behavior: "smooth"});
        }
      }
    }
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeLink, tabs]);
  
  useEffect(() => {
    if (!arrowButtons) return
    function updateArrows() {
      const container = containerRef.current;
      if (!container) return;
      setDisableLeftArrow(container.scrollLeft <= 0);
      setDisableRightArrow(container.scrollLeft + container.clientWidth >= container.scrollWidth);
    }
    updateArrows();
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      container.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [arrowButtons, tabs]);

  const handleArrowClick = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth * 0.7;
    const newScrollPosition = direction === "left"
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
    container.scrollTo({left: newScrollPosition, behavior: "smooth"});
  }

  return (
    <Stack mb={2} direction="row" width="100%" borderRadius="99px" height={40} p={0.5}
           bgcolor="background.paper" border={theme => `1px solid ${theme.palette.divider}`}
    >

      <IconButton style={{display: !arrowButtons ? "none" : undefined}} disabled={disableLeftArrow} onClick={() => handleArrowClick("left")}>
        <ArrowBackIosNewIcon sx={{fontSize: "18px"}} />
      </IconButton>

      <Stack ref={containerRef} direction="row" borderRadius="99px" flexGrow={1} position="relative"
             sx={{ overflowX: 'auto', scrollbarWidth: "none", "&::-webkit-scrollbar": {display: "none"} }}>
        {tabs.map((tab) => (
          <Box key={tab.link} display="flex" flex="1 0 0" px={3} justifyContent="center" alignItems="center" zIndex={1}
               fontWeight={600} fontSize="14px" color={activeLink === tab.link ? "primary.contrastText" : "text.primary"}
               sx={{cursor: "pointer", userSelect: "none"}}
               onClick={() => navigate(tab.link)}
          >
            {tab.name}
          </Box>
        ))}
        <Box position="absolute" top={0} bottom={0} borderRadius="99px" bgcolor="primary.main"
             sx={{transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0ms"}}
             style={indicatorStyle}
        />
      </Stack>

      <IconButton style={{display: !arrowButtons ? "none" : undefined}} disabled={disableRightArrow} onClick={() => handleArrowClick("right")}>
        <ArrowForwardIosIcon sx={{fontSize: "18px"}} />
      </IconButton>

    </Stack>
  );
}

export default DashboardNavbar;
