import React from 'react';
import { Switch } from 'react-router';

import Route from '../../../../routes/Route';

import Armazenagem from '..';
import Transpalete from '../Transpalete';

const ArmazenagemRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/armazenagem" exact component={Armazenagem} isPrivate />
      <Route
        path="/armazenagem/transpalete"
        component={Transpalete}
        isPrivate
      />
    </Switch>
  );
};

export default ArmazenagemRoutes;
