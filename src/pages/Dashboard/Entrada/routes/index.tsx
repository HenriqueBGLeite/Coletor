import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../routes/Route';

import Entrada from '..';
import CaixaPlastica from '../Caixa-Plastica';
import ConferenciaEntradaDev from '../Conferencia-Entrada';
import EquipeBonus from '../Conferencia-Entrada/Equipe-Bonus';
import ConferenciaBonus from '../Conferencia-Entrada/Conferencia-Bonus';
import ConferenciaUma from '../Conferencia-Uma';

const EntradaRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/entrada" exact component={Entrada} isPrivate />

      <Route
        path="/entrada/caixa-plastica"
        component={CaixaPlastica}
        isPrivate
      />

      <Route
        path="/entrada/conferencia-bonus"
        component={ConferenciaEntradaDev}
        isPrivate
      />

      <Route path="/entrada/equipe-bonus" component={EquipeBonus} isPrivate />

      <Route
        path="/entrada/conferencia-entrada"
        component={ConferenciaBonus}
        isPrivate
      />

      <Route
        path="/entrada/conferencia-uma"
        component={ConferenciaUma}
        isPrivate
      />
    </Switch>
  );
};

export default EntradaRoutes;
