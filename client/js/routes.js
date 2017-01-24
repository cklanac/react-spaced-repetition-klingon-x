import React from 'react';
import { Route, Router, hashHistory } from 'react-router';
import Home from './components/home';
import Quiz from './components/quiz';

const routes = (
  <Router history={hashHistory}>
    <Route path="/" component={Home} />
    <Route path="quiz" component={Quiz} />
  </Router>
);

export default routes;
