import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import UserProgress from './user-progress';
import UserProgressDetail from './user-progress-detail';
import UserProgressUpdate from './user-progress-update';
import UserProgressDeleteDialog from './user-progress-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={UserProgressUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={UserProgressUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={UserProgressDetail} />
      <ErrorBoundaryRoute path={match.url} component={UserProgress} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={UserProgressDeleteDialog} />
  </>
);

export default Routes;
