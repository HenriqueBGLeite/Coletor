import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../routes/Route';

import Reconferencia from '..';

const ReconferenciaRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/reconferencia" exact component={Reconferencia} isPrivate />
    </Switch>
  );
};

export default ReconferenciaRoutes;
