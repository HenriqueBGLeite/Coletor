import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../routes/Route';

import Dashboard from '../Wms';
import ConferenciaOs from '../Wms/Conferencia-Os';

const ConferenciaSaidaRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/conferencia-saida" exact component={Dashboard} isPrivate />
      <Route
        path="/conferencia-saida/conferencia-os"
        component={ConferenciaOs}
        isPrivate
      />
    </Switch>
  );
};

export default ConferenciaSaidaRoutes;
