import { createTheme } from "@material-ui/core";
import { css } from 'styled-components';
//import { createGlobalStyle } from "styled-components";

const themeMui = createTheme({

  // theme 와 관련없이 요소에 직접 스타일 반영(cf.반영 위해선 Material ui ThemeProvider 필수)
  components: {
    // Name of the component
    MuiCssBaseline: {
      // Name of the components key
      styleOverrides: `
        body {
          //background-color: red;
        }    
      `
    }
  },

  palette: {
    primary: {
      main: '#01684b',
      //contrastText: '#ffffff',
      //main: 'rgba(0, 0, 0, 0.12)',
      //contrastText: 'rgba(0, 0, 0, 0.26)',
    },
    secondary: {
      main: '#fe7a01',
    },
    mono: {
      main: '#f8f7f7',
    }
    //   action: {
    //     active: 'rgba(0,0,0,0.54)',
    //     hover: 'rgba(0,0,0,0.04)',
    //     hoverOpacity: 0.04,
    //   },
  },

  select: {
    '&:before': {
      borderColor: "red",
    },
    '&:after': {
      borderColor: "red",
    }
  },

  // theme 에 스타일 요소를 반영(cf.반영 위해선 Material ui ThemeProvider 필수)
  typography: {
    fontFamily: "'Roboto', 'Noto Sans Kr', sans-serif",

    title1: {
      fontSize: '3.5rem',
      fontWeight: 300,
      lineHeight: 1.167,
      letterSpacing: '-0.01562em',

      '@media (min-width:500px)': {
        fontSize: '4.7rem',
      },
      '@media (min-width:900px)': {
        fontSize: '5.3rem',
      },
      '@media (min-width:1200px)': {
        fontSize: '6rem',
      },
    }
  }
});

export default themeMui;