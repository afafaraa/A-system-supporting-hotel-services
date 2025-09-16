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
        ...(ownerState.variant === 'outlined'
          ? ownerState.color === 'error'
            ? {
              border: `1px solid ${theme.palette.error.main}`,
              backgroundColor: 'transparent',
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: theme.palette.error.main,
                border: `1px solid ${theme.palette.error.main}`,
                color: theme.palette.primary.contrastText,
              },
            }
            : {}
          : ownerState.color === 'error'
            ? {
              backgroundColor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
            }
            : {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
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
};

export default components;
