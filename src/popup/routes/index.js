import React from 'react';
import {
  Route,
  IndexRoute,
} from 'react-router';
import ChartPage from '../containers/chart-page';
import CreatePage from '../containers/create-page';
import DetailPage from '../containers/detail-page';
import ErrorPage from '../containers/error-page';
import HomePage from '../containers/home-page';
import LoginPage from '../containers/login-page';
import LogoutPage from '../containers/logout-page';
import CreateStart from '../components/create/start';
import CreateForm from '../components/create/form';

export default (
  <Route path="/">
    <IndexRoute component={HomePage} />
    <Route path="chart" component={ChartPage} />
    <Route path="detail" component={DetailPage} />
    <Route path="login" component={LoginPage} />
    <Route path="logout" component={LogoutPage} />
    <Route path="error" component={ErrorPage} />
    <Route path="create" component={CreatePage}>
      <IndexRoute component={CreateStart} />
      <Route path="form" component={CreateForm} />
    </Route>
  </Route>
);
