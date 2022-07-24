import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import theme from './theme';
import themeMui from './themeMui';
import store from './store';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';

import { ThemeProvider as StyledThemeProvider } from "styled-components"
import { ThemeProvider as MUThemeProvider } from '@material-ui/core';
import reportWebVitals from './reportWebVitals';

if (process.env.NODE_ENV === 'production') {
  console.log = () => { }
  console.error = () => { }
  console.debug = () => { }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <MUThemeProvider theme={themeMui}>
      <StyledThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </StyledThemeProvider>
    </MUThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
