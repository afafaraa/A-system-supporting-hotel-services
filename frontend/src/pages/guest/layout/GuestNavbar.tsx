import { useTheme } from '@mui/material';
import { SectionWrapper } from '../../../theme/styled-components/SectionWrapper.ts';
import { useRef, useState, useEffect } from 'react';

function GuestNavbar({
                       setCurrentPage,
                       currentPage,
                       subpages,
                     }: {
  setCurrentPage: Function;
  currentPage: string;
  subpages: string[];
}) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const children = containerRef.current.querySelectorAll<HTMLSpanElement>('span');
    const idx = subpages.indexOf(currentPage);
    if (idx !== -1 && children[idx]) {
      const el = children[idx];
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [currentPage, subpages]);

  return (
    <SectionWrapper
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        padding: '4px',
        display: 'flex',
        gap: '1rem',
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
          key={item}
          role="button"
          style={{
            flexGrow: 1,
            padding: '2px',
            textAlign: 'center',
            fontWeight: 600,
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
            color: item === currentPage ? theme.palette.primary.contrastText : theme.palette.text.primary,
          }}
          onClick={() => setCurrentPage(item)}
        >
          {item}
        </span>
      ))}
    </SectionWrapper>
  );
}

export default GuestNavbar;
