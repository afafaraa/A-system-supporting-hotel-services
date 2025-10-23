import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ShadowCard from '../../../theme/styled-components/ShadowCard.ts';
import dashboardDestination from '../../../utils/dashboardDestination.ts';
import { selectUser } from '../../../redux/slices/userSlice.ts';
import { SectionWrapper } from '../../../theme/styled-components/SectionWrapper.ts';
import Logo from '../../../assets/hotel.svg?react';

function RegisterPage() {
  const user = useSelector(selectUser);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const tc = (key: string) => t(`pages.register.${key}`);
  const theme = useTheme();
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const subpages = useMemo(
    () => [
      { label: t('pages.register.registerNoCodeNavButton'), path: '/register/no-code' },
      { label: t('pages.register.registerWithCodeNavButton'), path: '/register/with-code' },
    ],
    [t]
  );
  const updateIndicator = useCallback(() => {
    if (!containerRef.current) return;
    const children =
      containerRef.current.querySelectorAll<HTMLSpanElement>('span');

    const idx = subpages.findIndex((s) => location.pathname.endsWith(s.path));
    if (idx !== -1 && children[idx]) {
      const el = children[idx];
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [subpages, location.pathname]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10_000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    updateIndicator();
  }, [subpages, updateIndicator]);

  if (user) return <Navigate to={dashboardDestination(user.role)} replace />;

  return (
    <ShadowCard
      style={{
        minHeight: '70%',
        flexBasis: '460px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <Logo
        style={{
          background: theme.palette.primary.main,
          padding: '5px 10px',
          color: theme.palette.background.default,
          borderRadius: '10%',
        }}
        width={70}
        height={70}
      />

      <Typography
        variant="h1"
        fontWeight="regular"
        fontSize={28}
        color="primary.main"
        mb={1}
      >
        {tc('title')}
      </Typography>

      <SectionWrapper
        ref={containerRef}
        style={{
          position: 'relative',
          padding: '4px',
          display: 'flex',
          gap: '1rem',
          overflow: 'hidden',
          width: '100%',
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
              color: location.pathname.endsWith(item.path)
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              width: '50%',
            }}
            onClick={() => navigate(item.path)}
            title={item.label}
          >
            {item.label}
          </span>
        ))}
      </SectionWrapper>
      <Outlet />
    </ShadowCard>
  );
}

export default RegisterPage;
