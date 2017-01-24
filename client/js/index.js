import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import routes from './routes';
import store from './store';

console.log(`Client running in ${process.env.NODE_ENV} mode`);

ReactDOM.render((
  <Provider store={store}>
    {routes}
  </Provider>
), document.getElementById('main'));

