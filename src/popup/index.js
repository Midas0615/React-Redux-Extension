import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import {
  Router,
  hashHistory,
} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import routes from './routes';
import configureStore from './store';
import actions from './actions';
import transport from '../common/transport';
import logger from '../common/logger';

import './index.scss';

const muiTheme = getMuiTheme();
const store = configureStore();

setTimeout(() => {
  transport.post('/browser/badge/reset')
           .then((status) => logger.log('/browser/badge/reset', status))
           .catch((error) => logger.log('/browser/badge/reset', error));
}, 1000);

// Loading
render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <div style={{ paddingTop: 150, textAlign: 'center' }}>
      <CircularProgress size={1.5} />
    </div>
  </MuiThemeProvider>, document.getElementById('container')
);

const renderApp = () => {
  // Create an enhanced history that syncs navigation events with the store
  const history = syncHistoryWithStore(hashHistory, store);

  // Needed for onTouchTap
  // http://stackoverflow.com/a/34015469/988941
  injectTapEventPlugin();

  render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <Router routes={routes} history={history} />
      </MuiThemeProvider>
    </Provider>, document.getElementById('container')
  );
};

store.dispatch(actions.form.restore());
store.dispatch(actions.session.restore())
     .then(renderApp, renderApp);
