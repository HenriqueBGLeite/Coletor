import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../routes/Route';

import ConsultProducts from '..';
import Enderecos from '../Enderecos';
import Estoque from '../Estoque';

const ProductsRoutes: React.FC = () => {
  return (
    <Switch>
      <Route
        path="/consult-products"
        exact
        component={ConsultProducts}
        isPrivate
      />

      <Route path="/consult-products/estoque" component={Estoque} isPrivate />

      <Route
        path="/consult-products/enderecos"
        component={Enderecos}
        isPrivate
      />
    </Switch>
  );
};

export default ProductsRoutes;
