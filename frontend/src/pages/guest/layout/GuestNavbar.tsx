import { useTheme } from '@mui/material';
import { SectionWrapper } from '../../../theme/styled-components/SectionWrapper.ts';
import { useRef, useState, useEffect, useCallback } from 'react';
import { PageState } from './GuestLayout.tsx';
import { useLocation, useNavigate } from 'react-router-dom';

function GuestNavbar({ subpages }: { subpages: PageState[] }) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });

  const updateIndicator = useCallback(() => {
    if (!containerRef.current) return;
    const children = containerRef.current.querySelectorAll<HTMLSpanElement>("span");

    const idx = subpages.findIndex((s) => location.pathname.endsWith(s.path));
    if (idx !== -1 && children[idx]) {
      const el = children[idx];
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [subpages, location.pathname]);


  // Update when page changes
  useEffect(() => {
    updateIndicator();
  }, [subpages, updateIndicator]);

  // Update on window resize (responsive)
  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [subpages, updateIndicator]);

  return (
    <SectionWrapper
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        padding: '4px',
        display: 'flex',
        gap: '1rem',
        overflow: 'hidden',
        marginBottom: theme.spacing(3),
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '3px',
          bottom: '3px',
          left: indicatorStyle.left,
          width: indicatorStyle.width,
          borderRadius: '20px',
          backgroundColor: theme.palette.primary.main,
          transition: 'all 0.3s ease-in-out',
          zIndex: 0,
        }}
      />

      {subpages.map((item) => (
        <span
          key={item.path}
          role="button"
          style={{
            flexGrow: 1,
            minWidth: 0,
            padding: '5px',
            textAlign: 'center',
            fontWeight: 600,
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color:
              location.pathname.endsWith(item.path)
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
          }}
          onClick={() => navigate(item.path)}
          title={item.label}
        >
          {item.label}
        </span>
      ))}
    </SectionWrapper>
  );
}

export default GuestNavbar;
