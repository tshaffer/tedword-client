import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import { rootReducer } from './models';
import Pizza from './components/Pizza';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware)
  ));

//  height: '1080px',
//    height: '870px',

/*
const divStyle = {
  height: '98vh',
};

    <div style={divStyle}>
      < Home />
    </div>
*/

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/pizza' component={Pizza} />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('content')
);
