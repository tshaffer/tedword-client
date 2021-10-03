import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import Home from './components/Home';
import { rootReducer } from './models';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware)
  ));

const divStyle = {
  height: '1080px',
};

const contentElement = document.getElementById('content');
console.log('user', contentElement.dataset.user);
console.log('boardId', contentElement.dataset.boardid);

ReactDOM.render(
  <Provider store={store}>
    <div style={divStyle}>
      < Home />
    </div>
  </Provider>,
  document.getElementById('content')
);
