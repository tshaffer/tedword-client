import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Pizza from './components/Pizza';
import Launcher from './components/Launcher';

import { rootReducer } from './models';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware)
  ));

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/pizza' component={Pizza} />
        <Route exact path='/launcher' component={Launcher} />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('content')
);
