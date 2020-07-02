import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import ProductsRoutes from '../pages/Dashboard/Consult-Products/routes';
import InventarioRoutes from '../pages/Dashboard/Inventario/routes';
import ListarEnderecosRoutes from '../pages/Dashboard/Listar-Enderecos/routes';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />

    <Route path="/dashboard" component={Dashboard} isPrivate />

    <Route path="/consult-products" component={ProductsRoutes} isPrivate />

    <Route path="/inventario" component={InventarioRoutes} isPrivate />

    <Route
      path="/listar-enderecos"
      component={ListarEnderecosRoutes}
      isPrivate
    />
  </Switch>
);

export default Routes;
