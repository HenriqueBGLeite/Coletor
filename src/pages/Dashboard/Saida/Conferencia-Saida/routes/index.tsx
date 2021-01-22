import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../../routes/Route';

import Dashboard from '../Wms';
import ConferenciaOs from '../Wms/Conferencia-Os';
import ConfirmaPalete from '../Wms/Confirma-Palete';
import Divergencia from '../Wms/Conferencia-Os/Divergencia';
import OsPendente from '../Wms/Conferencia-Os/Os-Pendente';

const ConferenciaSaidaRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/conferencia-saida" exact component={Dashboard} isPrivate />
      <Route
        path="/conferencia-saida/confirma-palete"
        component={ConfirmaPalete}
        isPrivate
      />
      <Route
        path="/conferencia-saida/conferencia-os"
        component={ConferenciaOs}
        isPrivate
      />
      <Route
        path="/conferencia-saida/divergencia"
        component={Divergencia}
        isPrivate
      />
      <Route
        path="/conferencia-saida/os-pendente"
        component={OsPendente}
        isPrivate
      />
    </Switch>
  );
};

export default ConferenciaSaidaRoutes;
