import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../routes/Route';

import Inventario from '..';
import ConfirmarEndereco from '../Confirmar-Endereco';

const InventarioRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/listar-enderecos" exact component={Inventario} isPrivate />

      <Route
        path="/listar-enderecos/endereco-inventario"
        component={ConfirmarEndereco}
        isPrivate
      />
    </Switch>
  );
};

export default InventarioRoutes;
