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
        ...(ownerState.color === 'error'
          ? {
              backgroundColor: theme.palette.secondary.error,
              color: theme.palette.error.contrastText,
            }
          : {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }),
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
};

export default components;
