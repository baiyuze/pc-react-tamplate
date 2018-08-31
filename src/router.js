import React from 'react';
import { Router, Route, Switch, HashRouter } from 'react-router-dom';
import Products from './pages/products';

function RouterConfig() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={Products} />
      </Switch>
    </HashRouter >
  );
}
 

export default RouterConfig;

