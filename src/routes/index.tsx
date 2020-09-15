import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import ProdutoRoutes from '../pages/Dashboard/Consultar-Produtos/routes';
import ArmazenagemRoutes from '../pages/Dashboard/Armazenagem/routes';
import InventarioRoutes from '../pages/Dashboard/Inventario/routes';
import ListarEnderecosRoutes from '../pages/Dashboard/Listar-Enderecos/routes';
import ConferenciaSaidaRoutes from '../pages/Dashboard/Conferencia-Saida/routes';
import ReconferenciaRoutes from '../pages/Dashboard/Reconferencia-Carga/routes';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />

    <Route path="/dashboard" component={Dashboard} isPrivate />

    <Route
      path="/conferencia-saida"
      component={ConferenciaSaidaRoutes}
      isPrivate
    />
    <Route path="/reconferencia" component={ReconferenciaRoutes} isPrivate />

    <Route path="/consultar-produtos" component={ProdutoRoutes} isPrivate />

    <Route path="/armazenagem" component={ArmazenagemRoutes} isPrivate />

    <Route path="/inventario" component={InventarioRoutes} isPrivate />

    <Route
      path="/listar-enderecos"
      component={ListarEnderecosRoutes}
      isPrivate
    />
  </Switch>
);

export default Routes;
