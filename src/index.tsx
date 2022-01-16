import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Game from './components/Game';
import Home from './components/Home';
import Launcher from './components/Launcher';
import Login from './components/Login';
import Pizza from './components/Pizza';

import { rootReducer } from './models';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware)
  ));

//         <Route exact path='/game' component={Game} />

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/game/:id' component={Game}/>
        <Route exact path='/login' component={Login} />
        <Route exact path='/launcher' component={Launcher} />
        <Route exact path='/pizza' component={Pizza} />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('content')
);
