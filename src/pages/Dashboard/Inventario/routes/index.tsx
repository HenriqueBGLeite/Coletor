import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../routes/Route';

import Inventario from '..';
import Endereco from '../Wms/Endereco';
import Conferencia from '../Wms/Conferencia';

const InventarioRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/inventario" exact component={Inventario} isPrivate />

      <Route
        path="/inventario/endereco-inventario"
        component={Endereco}
        isPrivate
      />

      <Route
        path="/inventario/conferencia-invetario"
        component={Conferencia}
        isPrivate
      />
    </Switch>
  );
};

export default InventarioRoutes;
