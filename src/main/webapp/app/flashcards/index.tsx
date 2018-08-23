import React from 'react';
import { Switch } from 'react-router-dom';

// tslint:disable-next-line:no-unused-variable
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Card from './card/index';
import Category from './category/index';

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/card`} component={Card} />
      <ErrorBoundaryRoute path={`${match.url}/category`} component={Category} />
    </Switch>
  </div>
);

export default Routes;
