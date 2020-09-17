import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../../routes/Route';

import AuditoriaPaletizacao from '..';
import Conferencia from '../Conferencia';
import Divergencia from '../Conferencia/Divergencia';
import Pendencia from '../Conferencia/Os-Pendente';

const ReconferenciaRoutes: React.FC = () => {
  return (
    <Switch>
      <Route
        path="/auditoria-paletizacao"
        exact
        component={AuditoriaPaletizacao}
        isPrivate
      />
      <Route
        path="/auditoria-paletizacao/conferencia"
        component={Conferencia}
        isPrivate
      />
      <Route
        path="/auditoria-paletizacao/divergencia"
        component={Divergencia}
        isPrivate
      />
      <Route
        path="/auditoria-paletizacao/pendencia"
        component={Pendencia}
        isPrivate
      />
    </Switch>
  );
};

export default ReconferenciaRoutes;
