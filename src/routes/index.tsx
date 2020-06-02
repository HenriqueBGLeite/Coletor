import React from 'react';
import { Switch, HashRouter } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import ConsultProducts from '../pages/Dashboard/Consult-Products';

import Inventario from '../pages/Dashboard/Inventario';
import Endereco from '../pages/Dashboard/Inventario/Wms/Endereco';
import Conferencia from '../pages/Dashboard/Inventario/Wms/Conferencia';

const Routes: React.FC = () => (
  <HashRouter>
    <Switch>
      <Route path="/" exact component={SignIn} />

      <Route path="/dashboard" component={Dashboard} isPrivate />

      <Route path="/consult-products" component={ConsultProducts} isPrivate />

      <Route path="/inventario" component={Inventario} isPrivate />

      <Route path="/endereco-inventario" component={Endereco} isPrivate />

      <Route path="/conferencia-invetario" component={Conferencia} isPrivate />
    </Switch>
  </HashRouter>
);

export default Routes;
