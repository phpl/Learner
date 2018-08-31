import React from 'react';
import { Switch } from 'react-router-dom';

// tslint:disable-next-line:no-unused-variable
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Card from './card/index';
import Category from './category/index';
import Playroom from './playroom/playroom';
import PrePlayroom from './prePlayroom/pre-playroom';
import PostPlayroom from './postPlayRoom/post-playroom';

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/card`} component={Card} />
      <ErrorBoundaryRoute path={`${match.url}/category`} component={Category} />
      <ErrorBoundaryRoute path={`${match.url}/preplayroom`} component={PrePlayroom} />
      <ErrorBoundaryRoute path={`${match.url}/playroom`} component={Playroom} />
      <ErrorBoundaryRoute path={`${match.url}/postplayroom`} component={PostPlayroom} />
    </Switch>
  </div>
);

export default Routes;
