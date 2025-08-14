import {Components, Theme} from "@mui/material";

const components: Components<Omit<Theme, "components">>  = {
  MuiContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.default,
      }),
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        fontWeight: "bold",
        textTransform: "none",
      },
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
