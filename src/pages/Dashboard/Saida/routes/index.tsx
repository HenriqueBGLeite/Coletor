import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../routes/Route';

import Saida from '..';

const SaidaRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/saida" exact component={Saida} isPrivate />
    </Switch>
  );
};

export default SaidaRoutes;
