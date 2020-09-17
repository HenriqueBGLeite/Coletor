import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../../routes/Route';

import ConsultaProdutos from '..';
import Enderecos from '../Enderecos';
import Estoque from '../Estoque';

const ProductsRoutes: React.FC = () => {
  return (
    <Switch>
      <Route
        path="/consultar-produtos"
        exact
        component={ConsultaProdutos}
        isPrivate
      />

      <Route path="/consultar-produtos/estoque" component={Estoque} isPrivate />

      <Route
        path="/consultar-produtos/enderecos"
        component={Enderecos}
        isPrivate
      />
    </Switch>
  );
};

export default ProductsRoutes;
