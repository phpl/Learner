import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import CardInfo from './card-info';
import CardInfoDetail from './card-info-detail';
import CardInfoUpdate from './card-info-update';
import CardInfoDeleteDialog from './card-info-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={CardInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CardInfoUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CardInfoDetail} />
      <ErrorBoundaryRoute path={match.url} component={CardInfo} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={CardInfoDeleteDialog} />
  </>
);

export default Routes;
