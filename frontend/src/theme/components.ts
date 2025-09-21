import { Components, Theme } from '@mui/material';

const components: Components<Omit<Theme, 'components'>> = {
  MuiContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ ownerState, theme }) => ({
        fontWeight: 'bold',
        textTransform: 'none',
        ...(ownerState.variant === 'outlined' && ownerState.color === 'error' && {
          transition: theme.transitions.create(['background-color', 'color']),
          '&:hover': {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
          },
        }),
        '&.Mui-disabled': {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.secondary,
          cursor: 'not-allowed',
          border: 'none',
        },
      }),
    },
  },
  MuiTooltip: {
    defaultProps: {
      slotProps: {
        popper: {
          modifiers: [{ name: 'offset', options: { offset: [0, -10] } }],
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        width: '100%',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiCard: {
    defaultProps: {
      variant: "outlined",
    },
  },
  MuiLink: {
    styleOverrides: {
      root: ({ theme }) => ({
        display: 'block',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
          color: theme.palette.primary.main,
        },
      }),
    },
  },
};

export default components;
