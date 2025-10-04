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
        borderRadius: '12px',
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
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: '12px',
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        }
      }),
    },
  },
  MuiRating: {
    styleOverrides: {
      root: ({theme}) => ({
        "& .MuiRating-iconEmpty": {
          color: theme.palette.text.disabled,
        }
      }),
    }
  }
};

export default components;
