import {Components, Theme} from "@mui/material";

const components: Components<Omit<Theme, "components">>  = {
  MuiContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.custom1.main,
      }),
    }
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.custom3.main,
        color: theme.palette.custom3.secondary,
        fontWeight: "bold",
        textTransform: "none",
        "&:hover": { backgroundColor: theme.palette.primary.light }
      }),
    }
  },
  MuiTooltip: {
    defaultProps: {
      slotProps: {
        popper: { modifiers: [{name: 'offset', options: {offset: [0, -10]}}], },
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
}

export default components;
