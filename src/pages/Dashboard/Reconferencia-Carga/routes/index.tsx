import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../routes/Route';

import Reconferencia from '..';
import ReconferenciaOs from '../Reconferencia-Os';
import Divergencia from '../Reconferencia-Os/Divergencia';
import Pendencia from '../Reconferencia-Os/Os-Pendente';

const ReconferenciaRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/reconferencia" exact component={Reconferencia} isPrivate />
      <Route
        path="/reconferencia/reconferencia-os"
        component={ReconferenciaOs}
        isPrivate
      />
      <Route
        path="/reconferencia/divergencia"
        component={Divergencia}
        isPrivate
      />
      <Route path="/reconferencia/pendencia" component={Pendencia} isPrivate />
    </Switch>
  );
};

export default ReconferenciaRoutes;
